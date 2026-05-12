// Renders a chemical formula with proper subscripts.
// Pure server component — no client JS.

import { parseFormula } from "@/lib/chemistry";

interface Props {
  formula: string;
  className?: string;
}

export default function ChemicalFormula({ formula, className }: Props) {
  const tokens = parseFormula(formula);
  return (
    <span className={className}>
      {tokens.map((t, i) =>
        t.type === "sub" ? (
          <sub key={i} className="align-sub text-[0.7em] leading-none">
            {t.value}
          </sub>
        ) : (
          <span key={i}>{t.value}</span>
        ),
      )}
    </span>
  );
}
