"""Integrity checks on the generated dataset.

Exits non-zero on any failure. Prints a human summary at the end.
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _common import DATA_DIR, REVIEW_DIR, slugify  # noqa: E402

errors: list[str] = []
warnings: list[str] = []


def check(condition: bool, msg: str) -> None:
    if not condition:
        errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def main() -> None:
    minerals_index = json.loads((DATA_DIR / "minerals.json").read_text(encoding="utf-8"))
    filter_index = json.loads((DATA_DIR / "filter-index.json").read_text(encoding="utf-8"))

    # 1. Slug uniqueness across all minerals
    slug_counts = Counter(m["slug"] for m in minerals_index)
    dups = [s for s, c in slug_counts.items() if c > 1]
    check(not dups, f"Duplicate slugs in minerals.json: {dups}")

    # 2. Slug round-trip
    for m in minerals_index:
        round_tripped = slugify(m["name"])
        check(round_tripped == m["slug"], f"Slug round-trip failed for {m['name']}: got {round_tripped!r}, expected {m['slug']!r}")

    # 3. Each mineral has a JSON file
    minerals_dir = DATA_DIR / "minerals"
    for m in minerals_index:
        check((minerals_dir / f"{m['slug']}.json").exists(),
              f"Missing per-mineral file for slug {m['slug']!r}")

    # 4. Each mineral file has at least one section (warn for class summaries)
    for m in minerals_index:
        if m["sectionCount"] == 0:
            (warn if m["isClassSummary"] else check.__call__)(
                False, f"Zero sections in {m['name']}"
            ) if not m["isClassSummary"] else warn(f"Zero sections in class summary {m['name']}")

    # 5. Filter index integrity
    for i, row in enumerate(filter_index):
        check(row.get("name"), f"row {i}: missing name")
        check(isinstance(row.get("durezaNum"), (int, float)), f"row {i}: dureza not numeric")
        check(row.get("slug"), f"row {i}: missing slug")

    # 6. UTF-8 sanity — ensure NFC names work
    for s in ["CINÁBRIO", "ZIRCAO", "BÓRAX"]:
        match = next((m for m in minerals_index if m["name"] == s), None)
        check(match is not None, f"Expected mineral {s!r} not found in index")

    # 7. Review markdown files exist
    for m in minerals_index:
        md = REVIEW_DIR / "minerals" / f"{m['name']}.md"
        check(md.exists(), f"Missing review markdown for {m['name']!r}")

    # Summary
    print(f"=== validate.py ===")
    print(f"Total minerals:      {len(minerals_index)}")
    print(f"Class summaries:     {sum(1 for m in minerals_index if m['isClassSummary'])}")
    print(f"Filter index rows:   {len(filter_index)}")
    print(f"Warnings:            {len(warnings)}")
    print(f"Errors:              {len(errors)}")

    if warnings:
        print("\n--- WARNINGS ---")
        for w in warnings:
            print(f"  ! {w}")
    if errors:
        print("\n--- ERRORS ---")
        for e in errors:
            print(f"  ✗ {e}")
        sys.exit(1)
    print("\n✓ All checks passed.")


if __name__ == "__main__":
    main()
