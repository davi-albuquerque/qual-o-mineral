import { describe, it, expect } from "vitest";
import { matchHardness } from "@/lib/hardness";

// Mirror of the VBA `>= min AND < max` semantics from docs/vba-original.bas:
// boundary value belongs to the bucket whose MIN equals it, never to the
// bucket whose MAX equals it.
describe("matchHardness — VBA boundary semantics", () => {
  it("2.5 is NOT in lt-2.5 (max is exclusive)", () => {
    expect(matchHardness(2.5, "lt-2.5")).toBe(false);
  });

  it("2.5 IS in 2.5-5.5 (min is inclusive)", () => {
    expect(matchHardness(2.5, "2.5-5.5")).toBe(true);
  });

  it("7 IS in gte-7 (min is inclusive, no upper bound)", () => {
    expect(matchHardness(7, "gte-7")).toBe(true);
  });

  it("7 is NOT in 5.5-7 (max is exclusive)", () => {
    expect(matchHardness(7, "5.5-7")).toBe(false);
  });

  it("interior values land in the expected buckets", () => {
    expect(matchHardness(1, "lt-2.5")).toBe(true);
    expect(matchHardness(4, "2.5-5.5")).toBe(true);
    expect(matchHardness(6, "5.5-7")).toBe(true);
    expect(matchHardness(10, "gte-7")).toBe(true);
  });

  it("a value belongs to exactly one bucket", () => {
    const buckets = ["lt-2.5", "2.5-5.5", "5.5-7", "gte-7"] as const;
    for (const v of [0, 1, 2.5, 4, 5.5, 6, 7, 9]) {
      const hits = buckets.filter((b) => matchHardness(v, b));
      expect(hits.length, `value ${v} matched ${hits.join(",")}`).toBe(1);
    }
  });
});
