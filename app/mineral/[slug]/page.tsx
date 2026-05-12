// Technical sheet route. Loads the JSON for a slug and renders sections in fixed order.

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Mineral, SectionKey } from "@/types/mineral";
import quartzoJson from "@/data/minerals/quartzo.json";
import PrintButton from "@/components/print-button";

const KNOWN: Record<string, Mineral> = {
  quartzo: quartzoJson as Mineral,
};

const SECTION_ORDER: SectionKey[] = [
  "cristalografia",
  "propriedadesFisicas",
  "composicao",
  "ensaios",
  "aspectosDiagnosticos",
  "variedades",
  "genese",
  "ocorrencia",
  "uso",
  "nome",
  "outros",
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MineralPage({ params }: PageProps) {
  const { slug } = await params;
  const mineral = KNOWN[slug];
  if (!mineral) notFound();

  const ordered = [...mineral.sections].sort(
    (a, b) =>
      SECTION_ORDER.indexOf(a.key as SectionKey) -
      SECTION_ORDER.indexOf(b.key as SectionKey),
  );

  return (
    <article className="space-y-6 print:space-y-4">
      <nav className="text-sm text-zinc-500 print:hidden">
        <Link href="/" className="hover:text-zinc-900">
          ← Voltar para pesquisa
        </Link>
      </nav>

      <header className="border-b border-zinc-200 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">{mineral.name}</h1>
        {mineral.formula && (
          <p className="mt-1 text-lg text-zinc-700">{mineral.formula}</p>
        )}
        {mineral.type && (
          <p className="mt-1 text-sm text-zinc-500">{mineral.type}</p>
        )}
      </header>

      <div className="space-y-6">
        {ordered.map((s, i) => (
          <section key={`${s.key}-${i}`}>
            {s.heading && (
              <h2 className="text-base font-semibold text-zinc-800 mb-2">
                {s.heading}
              </h2>
            )}
            <div className="whitespace-pre-wrap text-zinc-800 leading-relaxed">
              {s.body}
            </div>
          </section>
        ))}
      </div>

      <div className="flex gap-3 pt-4 print:hidden">
        <PrintButton />
        <Link
          href="/"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Voltar
        </Link>
      </div>
    </article>
  );
}
