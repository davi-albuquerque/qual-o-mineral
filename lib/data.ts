// Single import point for the bundled JSON dataset.
// Importing here (instead of in pages) keeps the build graph clean.

import filterIndexJson from "@/data/filter-index.json";
import minerals from "@/data/minerals.json";
import brilhoOptions from "@/data/options/brilho.json";
import corOptions from "@/data/options/cor.json";
import habitoOptions from "@/data/options/habito.json";
import luzOptions from "@/data/options/luz.json";
import tracoOptions from "@/data/options/traco.json";
import type { FilterRow, Option } from "@/types/mineral";

export const FILTER_INDEX = filterIndexJson as FilterRow[];

export const MINERALS_INDEX = minerals as {
  slug: string;
  name: string;
  formula: string | null;
  type: string | null;
  isClassSummary: boolean;
  sectionCount: number;
}[];

export const OPTIONS = {
  brilho: brilhoOptions as Option[],
  traco: tracoOptions as Option[],
  habito: habitoOptions as Option[],
  luz: luzOptions as Option[],
  cor: corOptions as Option[],
};
