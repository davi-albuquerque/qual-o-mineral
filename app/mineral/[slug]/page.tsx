// Technical sheet route — loads <slug>.json from data/minerals/.

import { notFound } from "next/navigation";
import Link from "next/link";
import type { SectionKey } from "@/types/mineral";
import PrintButton from "@/components/print-button";
import { loadMineral, allSlugs } from "@/lib/minerals";

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

export async function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MineralPage({ params }: PageProps) {
  const { slug } = await params;
  const mineral = loadMineral(slug);
  if (!mineral) notFound();

  const ordered = [...mineral.sections].sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a.key as SectionKey);
    const ib = SECTION_ORDER.indexOf(b.key as SectionKey);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

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
        {mineral.isClassSummary && (
          <p className="mt-2 text-xs uppercase tracking-wide text-amber-700 bg-amber-50 inline-block px-2 py-1 rounded">
            Página resumo de classe
          </p>
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
