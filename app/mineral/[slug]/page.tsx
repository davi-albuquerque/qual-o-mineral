// Technical sheet route — loads <slug>.json from data/minerals/.

import { notFound } from "next/navigation";
import Link from "next/link";
import type { SectionKey } from "@/types/mineral";
import PrintButton from "@/components/print-button";
import ChemicalFormula from "@/components/chemical-formula";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LinkButton } from "@/components/ui/button";
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
    <article className="space-y-10 print:space-y-6">
      <nav className="text-sm text-[var(--color-muted)] print:hidden">
        <Link
          href="/"
          className="transition-colors hover:text-[var(--color-ink)]"
        >
          ← Voltar para pesquisa
        </Link>
      </nav>

      <header className="space-y-4 border-b border-[var(--color-border)] pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {mineral.type && <Badge variant="outline">{mineral.type}</Badge>}
          {mineral.isClassSummary && (
            <Badge variant="accent">Resumo de classe</Badge>
          )}
        </div>
        <h1 className="font-serif text-5xl tracking-tight text-[var(--color-ink)] md:text-6xl">
          {mineral.name}
        </h1>
        {mineral.formula && (
          <p className="text-xl text-[var(--color-ink-soft)] md:text-2xl">
            <ChemicalFormula
              formula={mineral.formula}
              className="font-mono"
            />
          </p>
        )}
      </header>

      <div className="space-y-8">
        {ordered.map((s, i) => (
          <section key={`${s.key}-${i}`} className="space-y-3">
            {s.heading && (
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">
                {s.heading.replace(/:$/, "")}
              </h2>
            )}
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
              {s.body}
            </div>
            {i < ordered.length - 1 && (
              <Separator className="mt-8 print:hidden" />
            )}
          </section>
        ))}
      </div>

      <div className="flex gap-3 pt-4 print:hidden">
        <PrintButton />
        <LinkButton href="/" variant="secondary">
          Voltar
        </LinkButton>
      </div>
    </article>
  );
}
