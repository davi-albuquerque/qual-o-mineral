import { describe, it, expect } from "vitest";
import { parseFormula } from "@/lib/chemistry";

const flatten = (s: string) =>
  parseFormula(s)
    .map((t) => (t.type === "sub" ? `[${t.value}]` : t.value))
    .join("");

describe("parseFormula", () => {
  it("subscripts digits after a letter", () => {
    expect(flatten("SiO2")).toBe("SiO[2]");
    expect(flatten("CaCO3")).toBe("CaCO[3]");
  });

  it("subscripts digits after a closing parenthesis", () => {
    expect(flatten("(Mg,Fe)2SiO4")).toBe("(Mg,Fe)[2]SiO[4]");
    expect(flatten("Al2(SO4)3")).toBe("Al[2](SO[4])[3]");
  });

  it("keeps coefficients (digits after ·) as text", () => {
    expect(flatten("CaSO4·2H2O")).toBe("CaSO[4]·2H[2]O");
    expect(flatten("(Ca,Na)2(Al2Si4O12)·6H2O")).toBe(
      "(Ca,Na)[2](Al[2]Si[4]O[12])·6H[2]O",
    );
  });

  it("handles complex formulas with mixed groups", () => {
    expect(flatten("NaAlSi3O8")).toBe("NaAlSi[3]O[8]");
    expect(flatten("Ca5(F,Cl,OH)(PO4)3")).toBe("Ca[5](F,Cl,OH)(PO[4])[3]");
  });

  it("returns empty array for empty input", () => {
    expect(parseFormula("")).toEqual([]);
  });
});
