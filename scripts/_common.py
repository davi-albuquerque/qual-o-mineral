"""Shared utilities for the extraction pipeline."""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = Path("/Users/davialbuquerque/Downloads/qual-o-minerio")
DATA_DIR = REPO_ROOT / "data"
REVIEW_DIR = REPO_ROOT / "review"
LOGS_DIR = REPO_ROOT / "logs"

XLSM_FILE = SOURCE_DIR / "Qual o Minério  3.xlsm"

# Files to ignore in the pipeline (they are CLASS summary pages or tooling artefacts).
CLASS_FILES = {
    "BORATOS", "CARBONATOS", "FILOSSILICATOS", "FOSFATOS",
    "HALÓIDES", "METAL NATIVO", "NITRATOS", "SEMIMETAL",
    "SILICATO", "SILICATOS - FAMÍLIA DOS ANFIBOLIOS",
    "SILICATOS-FAMÍLIA DO IPIROXÊNIO",
    "SULFATOS", "SULFETOS", "SULFOSSAIS", "TECTOSSILICATOS",
    "TUNGSTATOS", "ÓXIDOS",
}


def slugify(name: str) -> str:
    """Mirror of lib/slug.ts. ASCII slug for URLs."""
    nfd = unicodedata.normalize("NFD", name)
    no_marks = "".join(c for c in nfd if unicodedata.category(c) != "Mn")
    lower = no_marks.lower().strip()
    hyphenated = re.sub(r"[^a-z0-9]+", "-", lower)
    return hyphenated.strip("-")


def first_token(cell_value: str) -> str:
    """Mirror of VBA `Split(value, " ")(0)` — first whitespace-separated token."""
    return cell_value.strip().split(" ", 1)[0].strip()


def write_json(path: Path, data) -> None:
    """Idempotent JSON write — sorted keys, no timestamps, UTF-8, trailing newline."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=False)
        f.write("\n")
