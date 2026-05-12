// Integrity check: every categorical value in filter-index.json must exist
// as a `key` in the matching options/*.json. Catches typos and missing options
// that would silently make rows invisible in search.

import { describe, it, expect } from "vitest";
import { FILTER_INDEX, OPTIONS } from "@/lib/data";

const FIELDS = ["brilho", "traco", "habito", "luz", "cor"] as const;

describe("filter-index ↔ options integrity", () => {
  for (const field of FIELDS) {
    it(`every '${field}' in filter-index has a matching option key`, () => {
      const optionKeys = new Set(OPTIONS[field].map((o) => o.key));
      const indexValues = new Set(FILTER_INDEX.map((r) => r[field]));
      const orphans = [...indexValues].filter((v) => !optionKeys.has(v));
      expect(orphans, `unknown ${field} values: ${orphans.join(", ")}`).toEqual(
        [],
      );
    });
  }
});
