// Alphabetical list of all extracted minerals.

import Link from "next/link";
import { MINERALS_INDEX } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import ChemicalFormula from "@/components/chemical-formula";

export default function AllMineralsPage() {
  const sorted = [...MINERALS_INDEX].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
  const individual = sorted.filter((m) => !m.isClassSummary);
  const classes = sorted.filter((m) => m.isClassSummary);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="font-serif text-4xl tracking-tight text-[var(--color-ink)]">
          Todos os minerais
        </h1>
        <p className="text-base text-[var(--color-muted)]">
          {individual.length} fichas individuais e {classes.length} resumos de
          classe.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          Minerais
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {individual.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/mineral/${m.slug}`}
                className="group block rounded-md border border-transparent px-3 py-2.5 transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]"
              >
                <div className="font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                  {m.name}
                </div>
                {m.formula && (
                  <div className="mt-0.5 text-xs text-[var(--color-muted)]">
                    <ChemicalFormula formula={m.formula} />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          Resumos por classe
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/mineral/${m.slug}`}
                className="group flex items-center justify-between rounded-md border border-transparent px-3 py-2.5 transition-colors hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-soft)]/50"
              >
                <span className="font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                  {m.name}
                </span>
                <Badge variant="accent">Classe</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
