// Search page — full 6-criteria form, wired to the real filter-index.

import Link from "next/link";
import { searchMinerals } from "@/lib/filter";
import { ANY, type HardnessBucket, type SearchCriteria } from "@/types/mineral";
import { HARDNESS_BUCKETS } from "@/lib/hardness";
import { FILTER_INDEX, OPTIONS } from "@/lib/data";

interface PageProps {
  searchParams: Promise<{
    brilho?: string;
    traco?: string;
    dureza?: string;
    habito?: string;
    luz?: string;
    cor?: string;
  }>;
}

function valueOrAny<T extends string>(v: string | undefined): T | null {
  return v && v !== "" ? (v as T) : null;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const submitted = Object.values(params).some((v) => v && v !== "");

  const criteria: SearchCriteria = {
    brilho: valueOrAny(params.brilho),
    traco: valueOrAny(params.traco),
    dureza: valueOrAny<HardnessBucket>(params.dureza),
    habito: valueOrAny(params.habito),
    luz: valueOrAny(params.luz),
    cor: valueOrAny(params.cor),
  };

  const results = submitted ? searchMinerals(criteria, FILTER_INDEX) : [];

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Identifique um mineral
        </h1>
        <p className="text-sm text-zinc-600 mb-6">
          Selecione as características observadas e clique em <strong>Pesquisar</strong>.
          Use <em>Qualquer</em> para ignorar um critério.
        </p>

        <form method="GET" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Brilho" name="brilho" value={params.brilho} options={OPTIONS.brilho} />
          <Field label="Traço" name="traco" value={params.traco} options={OPTIONS.traco} />
          <Field
            label="Dureza"
            name="dureza"
            value={params.dureza}
            options={HARDNESS_BUCKETS}
          />
          <Field label="Hábito" name="habito" value={params.habito} options={OPTIONS.habito} />
          <Field label="Luz" name="luz" value={params.luz} options={OPTIONS.luz} />
          <Field label="Cor" name="cor" value={params.cor} options={OPTIONS.cor} />

          <div className="md:col-span-2 flex gap-3 pt-2">
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
              : `${results.length} ${results.length === 1 ? "mineral encontrado" : "minerais encontrados"}`}
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
    </div>
  );
}

function Field({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string | undefined;
  options: { key: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-zinc-700 mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={value ?? ""}
        className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
      >
        <option value="">Qualquer</option>
        {options.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
