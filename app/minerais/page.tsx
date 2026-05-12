// Alphabetical list of all extracted minerals.

import Link from "next/link";
import { MINERALS_INDEX } from "@/lib/data";

export default function AllMineralsPage() {
  const sorted = [...MINERALS_INDEX].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
  const individual = sorted.filter((m) => !m.isClassSummary);
  const classes = sorted.filter((m) => m.isClassSummary);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Todos os Minerais</h1>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
          Minerais ({individual.length})
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {individual.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/mineral/${m.slug}`}
                className="block px-3 py-2 rounded-md hover:bg-zinc-100 text-zinc-800"
              >
                <span className="font-medium">{m.name}</span>
                {m.formula && (
                  <span className="text-xs text-zinc-500 ml-2">{m.formula}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
          Resumos por Classe ({classes.length})
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {classes.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/mineral/${m.slug}`}
                className="block px-3 py-2 rounded-md hover:bg-amber-50 text-zinc-800"
              >
                <span className="font-medium">{m.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
