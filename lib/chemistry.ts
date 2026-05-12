// Chemical-formula tokenizer.
//
// Converts a string like "Ca5(PO4)3(F,Cl,OH)" into tokens marked as either
// "text" or "sub" (subscript). Rule:
//   - A run of digits is rendered as a subscript when preceded by a letter
//     or a closing parenthesis (i.e., it's a count of the previous group).
//   - A run of digits at the start of the formula, or after '·' / space, is
//     a coefficient — rendered normally.
//
// This is a deliberately small parser; mineralogy formulas rarely need more.

export type FormulaToken =
  | { type: "text"; value: string }
  | { type: "sub"; value: string };

export function parseFormula(formula: string): FormulaToken[] {
  const tokens: FormulaToken[] = [];
  if (!formula) return tokens;

  let i = 0;
  let prev: "start" | "letter" | "close" | "open" | "digit" | "dot" | "other" =
    "start";
  let buf = "";

  const flushText = () => {
    if (buf.length > 0) {
      tokens.push({ type: "text", value: buf });
      buf = "";
    }
  };

  while (i < formula.length) {
    const ch = formula[i]!;

    if (/[0-9]/.test(ch)) {
      // Read a digit run.
      let j = i;
      while (j < formula.length && /[0-9]/.test(formula[j]!)) j++;
      const digits = formula.slice(i, j);
      if (prev === "letter" || prev === "close") {
        flushText();
        tokens.push({ type: "sub", value: digits });
      } else {
        buf += digits;
      }
      i = j;
      prev = "digit";
      continue;
    }

    buf += ch;
    if (/[A-Za-z]/.test(ch)) prev = "letter";
    else if (ch === ")") prev = "close";
    else if (ch === "(") prev = "open";
    else if (ch === "·" || ch === ".") prev = "dot";
    else if (ch === " ") prev = "dot"; // treat space same as separator
    else prev = "other";
    i++;
  }
  flushText();
  return tokens;
}
