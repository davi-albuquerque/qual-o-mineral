// Tracer-bullet search page — 1 criterion (Brilho) only.
// Wired to lib/filter.ts so swapping seed data for the real index requires no UI changes.

import Link from "next/link";
import { searchMinerals } from "@/lib/filter";
import { ANY, type SearchCriteria } from "@/types/mineral";
import { SEED_ROWS } from "@/data/seed-filter-index";

const BRILHO_OPTIONS = [
  { key: "metalico", label: "Metálico" },
  { key: "adamantino", label: "Adamantino" },
  { key: "gorduroso", label: "Gorduroso" },
  { key: "nacarado", label: "Nacarado" },
  { key: "resinoso", label: "Resinoso" },
  { key: "sedoso", label: "Sedoso" },
  { key: "vitreo", label: "Vítreo" },
  { key: "terroso", label: "Terroso" },
];

interface PageProps {
  searchParams: Promise<{ brilho?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedBrilho = params.brilho ?? "";

  const criteria: SearchCriteria = {
    brilho: selectedBrilho ? selectedBrilho : ANY,
    traco: ANY,
    dureza: ANY,
    habito: ANY,
    luz: ANY,
    cor: ANY,
  };

  const submitted = selectedBrilho !== "";
  const results = submitted ? searchMinerals(criteria, SEED_ROWS) : [];

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Identifique um mineral
        </h1>
        <p className="text-sm text-zinc-600 mb-6">
          Selecione as características observadas e clique em <strong>Pesquisar</strong>.
        </p>

        <form method="GET" className="space-y-4">
          <div>
            <label
              htmlFor="brilho"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Brilho
            </label>
            <select
              id="brilho"
              name="brilho"
              defaultValue={selectedBrilho}
              className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="">Qualquer</option>
              {BRILHO_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Pesquisar
            </button>
            <Link
              href="/"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Limpar
            </Link>
          </div>
        </form>
      </section>

      {submitted && (
        <section>
          <h2 className="text-sm font-medium text-zinc-500 mb-3">
            {results.length === 0
              ? "Nenhum mineral encontrado"
              : `${results.length} mineral${results.length > 1 ? "is" : ""} encontrado${results.length > 1 ? "s" : ""}`}
          </h2>
          <ul className="space-y-2">
            {results.map((m) => (
              <li
                key={m.slug}
                className="rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-400"
              >
                <Link href={`/mineral/${m.slug}`} className="block">
                  <div className="font-semibold text-zinc-900">{m.name}</div>
                  <div className="text-sm text-zinc-600">
                    {m.rawName.replace(m.name, "").trim()} — {m.type}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="text-xs text-zinc-400 border-t border-zinc-200 pt-4">
        Versão tracer-bullet — apenas QUARTZO está disponível. Filtro completo (6 critérios e 196 minerais) será habilitado nas próximas iterações.
      </section>
    </div>
  );
}
