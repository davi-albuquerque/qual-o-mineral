// Single source of truth for the Mineral data model.
// All JSON files in `data/` conform to these types.
// PT-BR `label` is what the user sees; ASCII `key` is what code branches on.

export type LusterKey =
  | "metalico"
  | "adamantino"
  | "gorduroso"
  | "nacarado"
  | "resinoso"
  | "sedoso"
  | "vitreo"
  | "terroso";

export type LightKey = "opaco" | "translucido" | "transparente";

/** Hardness bucket (mirrors the .xlsm DUREZA tab). Boundaries: min inclusive, max exclusive. */
export type HardnessBucket = "lt-2.5" | "2.5-5.5" | "5.5-7" | "gte-7";

export interface Option<K extends string = string> {
  /** Stable ASCII identifier used in code, URLs, and JSON keys. */
  key: K;
  /** PT-BR label rendered in the UI, exactly as authored in the .xlsm. */
  label: string;
}

/** Sentinel for "any value" on a search criterion (the user picks "Qualquer"). */
export const ANY = null;
export type Any = typeof ANY;

export interface SearchCriteria {
  brilho: string | Any; // option key
  traco: string | Any;
  dureza: HardnessBucket | Any;
  habito: string | Any;
  luz: LightKey | Any;
  cor: string | Any;
}

/** A single row of `DADOS MINERAIS` (one per mineral × habit × color combination). */
export interface FilterRow {
  /** Canonical mineral name (first whitespace-separated token of the original cell). */
  name: string;
  /** Original full cell value, e.g. `"OURO Au"`. */
  rawName: string;
  /** Slug for URLs, e.g. `"ouro"`. */
  slug: string;
  type: string; // e.g. "METAL NATIVO"
  brilho: string; // option key
  brilhoLabel: string; // PT-BR label (kept for debug/display)
  traco: string;
  tracoLabel: string;
  /** Numeric hardness as stored in the .xlsm (e.g. 3, 4, 6). */
  durezaNum: number;
  habito: string;
  habitoLabel: string;
  luz: string;
  luzLabel: string;
  cor: string;
  corLabel: string;
}

export interface FilterIndex {
  /** All ~4946 rows in deterministic order. */
  rows: FilterRow[];
  /** Lookup by slug. */
  bySlug: Record<string, MineralSummary>;
}

export interface MineralSummary {
  slug: string;
  name: string;
  rawName: string;
  formula?: string;
  type: string;
}

export type SectionKey =
  | "cristalografia"
  | "propriedadesFisicas"
  | "composicao"
  | "ensaios"
  | "aspectosDiagnosticos"
  | "ocorrencia"
  | "uso"
  | "nome"
  | "variedades"
  | "genese"
  | "outros";

/** Full technical sheet for a mineral (extracted from its .XLS). */
export interface Mineral {
  slug: string;
  name: string;
  rawName: string;
  formula?: string;
  type?: string;
  /** Sections detected in the source by header (e.g. "Cristalografia:"). */
  sections: { key: SectionKey; heading: string; body: string }[];
  /** True if this is a class summary page (e.g. SULFETOS), not an individual mineral. */
  isClassSummary: boolean;
}
