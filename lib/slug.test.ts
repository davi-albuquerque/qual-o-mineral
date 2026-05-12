import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slug";
import minerals from "@/data/minerals.json";

interface MineralRecord {
  slug: string;
  name?: string;
  rawName?: string;
}

const records = minerals as MineralRecord[];

describe("slugify — PT-BR diacritic handling", () => {
  it("strips acute accents (CINÁBRIO → cinabrio)", () => {
    expect(slugify("CINÁBRIO")).toBe("cinabrio");
  });

  it("strips circumflex / tilde (BÓRAX → borax)", () => {
    expect(slugify("BÓRAX")).toBe("borax");
  });

  it("collapses punctuation and spaces into single hyphens", () => {
    expect(slugify("SILICATOS - FAMÍLIA DOS ANFIBOLIOS")).toBe(
      "silicatos-familia-dos-anfibolios",
    );
  });
});

describe("slugify — round-trip against data/minerals.json", () => {
  it("has all 218 minerals", () => {
    expect(records.length).toBe(218);
  });

  it("every name slugifies to its stored slug", () => {
    for (const m of records) {
      const source = m.name ?? m.rawName ?? "";
      expect(slugify(source), `name="${source}" expected slug="${m.slug}"`).toBe(
        m.slug,
      );
    }
  });

  it("all 218 slugs are unique (no collisions)", () => {
    const slugs = records.map((m) => slugify(m.name ?? m.rawName ?? ""));
    const unique = new Set(slugs);
    expect(unique.size).toBe(records.length);
  });

  it("produces only [a-z0-9-] characters", () => {
    for (const m of records) {
      expect(m.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});
