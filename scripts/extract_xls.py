"""Convert each `.XLS` to `.xlsx` via LibreOffice headless, then parse the
embedded drawing XML to extract the technical sheet text.

Outputs:
    data/minerals/<slug>.json   — structured Mineral
    review/minerals/<NAME>.md   — human-readable for the geologist's review
    data/minerals.json          — consolidated index of all sheets

The actual technical-sheet content lives in `xl/drawings/drawing1.xml` as
text boxes. xlrd cannot read these. See ADR-0003.
"""

from __future__ import annotations

import html
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _common import (  # noqa: E402
    CLASS_FILES,
    DATA_DIR,
    REVIEW_DIR,
    SOURCE_DIR,
    first_token,
    slugify,
    write_json,
)

SOFFICE = "/opt/homebrew/bin/soffice"

# Section header patterns (PT-BR). Order matters only for tie-breaking.
SECTIONS = [
    ("cristalografia", r"Cristalografia"),
    ("propriedadesFisicas", r"Propriedades\s+f[íi]sicas"),
    ("composicao", r"Composi[çc][ãa]o"),
    ("ensaios", r"Ensaios"),
    ("aspectosDiagnosticos", r"Aspectos\s+diagn[óo]sticos"),
    ("variedades", r"Variedades"),
    ("genese", r"G[êe]nese"),
    ("ocorrencia", r"Ocorr[êe]ncia"),
    ("uso", r"Usos?"),
    ("nome", r"Nome"),
    ("especiesSemelhantes", r"Esp[ée]cies\s+semelhantes"),
]

ALT = "|".join(f"(?P<h{i}>{p})" for i, (_, p) in enumerate(SECTIONS))
SPLIT_RE = re.compile(r"(?<![A-Za-zÀ-ÿ0-9])(" + ALT + r")\s*:", re.IGNORECASE)


def header_for_match(m: re.Match) -> tuple[str, str]:
    for i, (key, _) in enumerate(SECTIONS):
        if m.group(f"h{i}"):
            return key, m.group(f"h{i}")
    raise AssertionError("no matched group")


def normalise_filename(p: Path) -> Path:
    """Some macOS filenames are NFD; normalise to NFC for cross-platform safety."""
    nfc = unicodedata.normalize("NFC", str(p))
    return Path(nfc)


def convert_to_xlsx(xls_path: Path, out_dir: Path) -> Path:
    """Returns path to the resulting .xlsx."""
    result = subprocess.run(
        [SOFFICE, "--headless", "--convert-to", "xlsx", "--outdir", str(out_dir), str(xls_path)],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(f"soffice failed for {xls_path.name}: {result.stderr.strip()}")
    expected = out_dir / (xls_path.stem + ".xlsx")
    if not expected.exists():
        raise RuntimeError(f"soffice produced no output for {xls_path.name}")
    return expected


def extract_paragraphs(xlsx_path: Path) -> list[str]:
    """Return list of paragraph strings from xl/drawings/drawing*.xml.
    Empty paragraphs and the trailing 'VOLTAR' button are filtered."""
    paragraphs = []
    with zipfile.ZipFile(xlsx_path) as z:
        drawings = sorted(n for n in z.namelist() if n.startswith("xl/drawings/") and n.endswith(".xml"))
        for d in drawings:
            with z.open(d) as f:
                content = f.read().decode("utf-8", errors="replace")
            for m in re.finditer(r"<a:p[^>]*>(.*?)</a:p>", content, re.DOTALL):
                runs = re.findall(r"<a:t[^>]*>([^<]*)</a:t>", m.group(1))
                text = html.unescape("".join(runs)).strip()
                if not text:
                    continue
                if text.upper() == "VOLTAR":
                    continue
                paragraphs.append(text)
    return paragraphs


def parse_sections(paragraphs: list[str]) -> list[dict]:
    """Walk paragraphs and split on section header occurrences (mid-paragraph too)."""
    sections: list[dict] = []
    current: dict | None = None

    def flush(text: str, into: dict | None) -> None:
        text = text.strip()
        if not text:
            return
        if into is None:
            sections.append({"key": "preamble", "heading": "", "body": text})
        else:
            into["body"] = (into["body"] + "\n\n" + text).strip() if into["body"] else text

    for p in paragraphs:
        last_end = 0
        for m in SPLIT_RE.finditer(p):
            flush(p[last_end:m.start()], current)
            key, heading_word = header_for_match(m)
            current = {"key": key, "heading": f"{heading_word.strip()}:", "body": ""}
            sections.append(current)
            last_end = m.end()
        flush(p[last_end:], current)

    return [s for s in sections if s["body"]]


def derive_metadata(xls_filename: str) -> tuple[str, str]:
    """Return (canonical_name, slug) from the filename. Filename is the source of truth
    for the name (NOT the internal CDF Title metadata, which is unreliable).

    macOS stores filenames as NFD (decomposed). We normalise to NFC so equality
    against names from `.xlsm` (which are NFC) works."""
    name = unicodedata.normalize("NFC", xls_filename.removesuffix(".XLS").strip())
    return name, slugify(name)


def to_markdown(mineral: dict) -> str:
    out = [f"# {mineral['name']}", ""]
    if mineral.get("formula"):
        out.append(f"**Fórmula:** {mineral['formula']}")
        out.append("")
    if mineral.get("type"):
        out.append(f"**Tipo:** {mineral['type']}")
        out.append("")
    if mineral.get("isClassSummary"):
        out.append("> _Esta é uma página resumo de classe (não um mineral individual)._")
        out.append("")
    for s in mineral["sections"]:
        out.append(f"## {s['heading'] or s['key']}")
        out.append("")
        out.append(s["body"])
        out.append("")
    return "\n".join(out).rstrip() + "\n"


def process_one(xls_path: Path, tmp: Path, formulas_by_name: dict, types_by_name: dict) -> dict:
    name, slug = derive_metadata(xls_path.name)
    is_class = name in CLASS_FILES
    xlsx = convert_to_xlsx(xls_path, tmp)
    paragraphs = extract_paragraphs(xlsx)
    sections = parse_sections(paragraphs)

    return {
        "slug": slug,
        "name": name,
        "rawName": name,  # individual .XLS doesn't carry the long name+formula form
        "formula": formulas_by_name.get(name),
        "type": types_by_name.get(name),
        "isClassSummary": is_class,
        "sections": sections,
    }


def main() -> None:
    # Cross-reference name → formula and name → type from the xlsm exports
    minerals_list_path = DATA_DIR / "minerals-list.json"
    filter_index_path = DATA_DIR / "filter-index.json"
    formulas_by_name: dict[str, str] = {}
    types_by_name: dict[str, str] = {}
    if minerals_list_path.exists():
        for entry in json.loads(minerals_list_path.read_text(encoding="utf-8")):
            if entry.get("formula"):
                formulas_by_name[entry["name"]] = entry["formula"]
    if filter_index_path.exists():
        for row in json.loads(filter_index_path.read_text(encoding="utf-8")):
            types_by_name.setdefault(row["name"], row["type"])

    minerals_dir = DATA_DIR / "minerals"
    review_dir = REVIEW_DIR / "minerals"
    minerals_dir.mkdir(parents=True, exist_ok=True)
    review_dir.mkdir(parents=True, exist_ok=True)

    xls_files = sorted(SOURCE_DIR.glob("*.XLS"))
    print(f"Processing {len(xls_files)} .XLS files via soffice ...")

    consolidated = []
    failures = []

    with tempfile.TemporaryDirectory(prefix="qual-extract-") as tmp_str:
        tmp = Path(tmp_str)
        for i, xls in enumerate(xls_files, 1):
            try:
                m = process_one(xls, tmp, formulas_by_name, types_by_name)
                # Write per-mineral JSON + MD
                write_json(minerals_dir / f"{m['slug']}.json", m)
                (review_dir / f"{m['name']}.md").write_text(to_markdown(m), encoding="utf-8")
                consolidated.append({
                    "slug": m["slug"],
                    "name": m["name"],
                    "formula": m.get("formula"),
                    "type": m.get("type"),
                    "isClassSummary": m["isClassSummary"],
                    "sectionCount": len(m["sections"]),
                })
                if i % 25 == 0:
                    print(f"  [{i}/{len(xls_files)}] processed: {m['name']}")
            except Exception as e:
                failures.append((xls.name, str(e)))
                print(f"  ! FAILED {xls.name}: {e}")

    write_json(DATA_DIR / "minerals.json", sorted(consolidated, key=lambda x: x["slug"]))

    print(f"\nDone. Wrote {len(consolidated)} minerals + {len(consolidated)} markdown files.")
    if failures:
        print(f"FAILURES ({len(failures)}):")
        for name, err in failures:
            print(f"  - {name}: {err}")


if __name__ == "__main__":
    main()
