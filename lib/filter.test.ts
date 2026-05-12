import { describe, it, expect } from "vitest";
import { searchMinerals, filterRows } from "@/lib/filter";
import { ANY, type FilterRow, type SearchCriteria } from "@/types/mineral";
import filterIndex from "@/data/filter-index.json";

const rows = filterIndex as FilterRow[];

const baseCriteria: SearchCriteria = {
  brilho: ANY,
  traco: ANY,
  dureza: ANY,
  habito: ANY,
  luz: ANY,
  cor: ANY,
};

describe("searchMinerals — parity scenarios against data/filter-index.json", () => {
  // Scenario 1: brilho=vitreo + dureza=gte-7 → 23 unique minerals, QUARTZO present.
  it("brilho=vitreo, dureza=gte-7 → 23 unique minerals including QUARTZO", () => {
    const results = searchMinerals(
      { ...baseCriteria, brilho: "vitreo", dureza: "gte-7" },
      rows,
    );
    expect(results.length).toBe(23);
    expect(results.some((m) => m.name === "QUARTZO")).toBe(true);
  });

  // Scenario 2: brilho=metalico alone → OURO is among results.
  it("brilho=metalico alone → OURO is in the result set", () => {
    const results = searchMinerals(
      { ...baseCriteria, brilho: "metalico" },
      rows,
    );
    expect(results.some((m) => m.name === "OURO")).toBe(true);
  });

  // Scenario 3: no criteria → all unique minerals from the index.
  it("no criteria → returns all unique minerals (dedup by slug)", () => {
    const results = searchMinerals(baseCriteria, rows);
    const uniqueSlugs = new Set(rows.map((r) => r.slug));
    expect(results.length).toBe(uniqueSlugs.size);
    // Sanity check: every result has a unique slug.
    expect(new Set(results.map((m) => m.slug)).size).toBe(results.length);
  });

  // Scenario 4: dureza=lt-2.5 excludes hard minerals like QUARTZO (hardness 7).
  it("dureza=lt-2.5 excludes QUARTZO (durezaNum = 7)", () => {
    const results = searchMinerals(
      { ...baseCriteria, dureza: "lt-2.5" },
      rows,
    );
    expect(results.some((m) => m.name === "QUARTZO")).toBe(false);
    // Sanity: a softer mineral like TALCO (1) should pass if present in the index.
    const talcoInIndex = rows.some((r) => r.name === "TALCO" && r.durezaNum < 2.5);
    if (talcoInIndex) {
      expect(results.some((m) => m.name === "TALCO")).toBe(true);
    }
  });

  // Scenario 5: dedup — QUARTZO has many raw rows in the index but appears
  // once in the deduped result.
  it("dedupes by slug — QUARTZO appears exactly once despite many rows", () => {
    const quartzoRowCount = rows.filter((r) => r.slug === "quartzo").length;
    expect(quartzoRowCount).toBeGreaterThan(1);

    const results = searchMinerals(baseCriteria, rows);
    const quartzoMatches = results.filter((m) => m.slug === "quartzo");
    expect(quartzoMatches.length).toBe(1);
  });
});

describe("filterRows — raw VBA-equivalent row matching (no dedup)", () => {
  it("preserves duplicate rows that the VBA macro would emit", () => {
    const raw = filterRows({ ...baseCriteria, brilho: "metalico" }, rows);
    const ouroRaw = raw.filter((r) => r.slug === "ouro");
    // OURO has at least one metalico row in the source.
    expect(ouroRaw.length).toBeGreaterThanOrEqual(1);
    // And every returned row actually has brilho=metalico.
    expect(raw.every((r) => r.brilho === "metalico")).toBe(true);
  });
});
