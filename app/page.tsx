// Search page — full 6-criteria form, wired to the real filter-index.

import Link from "next/link";
import { searchMinerals } from "@/lib/filter";
import { ANY, type HardnessBucket, type SearchCriteria } from "@/types/mineral";
import { HARDNESS_BUCKETS } from "@/lib/hardness";
import { FILTER_INDEX, OPTIONS } from "@/lib/data";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import ChemicalFormula from "@/components/chemical-formula";

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
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="font-serif text-4xl tracking-tight text-[var(--color-ink)]">
          Identifique um mineral
        </h1>
        <p className="max-w-2xl text-base text-[var(--color-muted)]">
          Selecione as características observadas e clique em{" "}
          <span className="font-medium text-[var(--color-ink)]">
            Pesquisar
          </span>
          . Deixe um campo em{" "}
          <em className="not-italic font-medium text-[var(--color-ink)]">
            Qualquer
          </em>{" "}
          para ignorá-lo.
        </p>
      </section>

      <Card className="p-6 md:p-8">
        <form
          method="GET"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <Field
            label="Brilho"
            name="brilho"
            value={params.brilho}
            options={OPTIONS.brilho}
          />
          <Field
            label="Traço"
            name="traco"
            value={params.traco}
            options={OPTIONS.traco}
          />
          <Field
            label="Dureza"
            name="dureza"
            value={params.dureza}
            options={HARDNESS_BUCKETS}
          />
          <Field
            label="Hábito"
            name="habito"
            value={params.habito}
            options={OPTIONS.habito}
          />
          <Field
            label="Luz"
            name="luz"
            value={params.luz}
            options={OPTIONS.luz}
          />
          <Field
            label="Cor"
            name="cor"
            value={params.cor}
            options={OPTIONS.cor}
          />

          <div className="flex items-end gap-3 md:col-span-2 lg:col-span-3">
            <Button type="submit">Pesquisar</Button>
            <LinkButton href="/" variant="secondary">
              Limpar
            </LinkButton>
          </div>
        </form>
      </Card>

      {submitted && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">
              {results.length === 0
                ? "Nenhum mineral encontrado"
                : results.length === 1
                  ? "1 mineral encontrado"
                  : `${results.length} minerais encontrados`}
            </h2>
            {results.length > 0 && (
              <span className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                Clique para ver a ficha
              </span>
            )}
          </div>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {results.map((m) => {
              const formulaInline = m.rawName.replace(m.name, "").trim();
              return (
                <li key={m.slug}>
                  <Link
                    href={`/mineral/${m.slug}`}
                    className="group block"
                  >
                    <Card className="p-5 transition-colors hover:border-[var(--color-muted-soft)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="font-serif text-xl text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                            {m.name}
                          </div>
                          {formulaInline && (
                            <div className="text-sm text-[var(--color-muted)]">
                              <ChemicalFormula formula={formulaInline} />
                            </div>
                          )}
                        </div>
                        <Badge variant="outline">{m.type}</Badge>
                      </div>
                    </Card>
                  </Link>
                </li>
              );
            })}
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
    <Select label={label} name={name} defaultValue={value ?? ""}>
      <option value="">Qualquer</option>
      {options.map((opt) => (
        <option key={opt.key} value={opt.key}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
