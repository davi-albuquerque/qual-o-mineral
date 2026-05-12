// Pure mirror of `FilterMinerals` (Módulo4 in `Qual o Minério 3.xlsm`).
// See `docs/vba-original.bas` for the original VBA source.
//
// VBA semantics (verified):
//   - Brilho, Traço, Hábito, Luz, Cor: equality on label strings.
//   - Dureza: numeric range [min, max) — min inclusive, max exclusive.
//   - "Qualquer" (ANY) skips the criterion.
//   - The macro emits one row per matching DADOS MINERAIS row (with duplicates).
//     The web dedupes by slug for display, preserving first-seen order.

import { ANY, type FilterRow, type SearchCriteria, type MineralSummary } from "@/types/mineral";
import { matchHardness } from "@/lib/hardness";

export function filterRows(criteria: SearchCriteria, rows: FilterRow[]): FilterRow[] {
  return rows.filter((row) => {
    if (criteria.brilho !== ANY && row.brilho !== criteria.brilho) return false;
    if (criteria.traco !== ANY && row.traco !== criteria.traco) return false;
    if (criteria.dureza !== ANY && !matchHardness(row.durezaNum, criteria.dureza)) return false;
    if (criteria.habito !== ANY && row.habito !== criteria.habito) return false;
    if (criteria.luz !== ANY && row.luz !== criteria.luz) return false;
    if (criteria.cor !== ANY && row.cor !== criteria.cor) return false;
    return true;
  });
}

export function dedupeBySlug(rows: FilterRow[]): MineralSummary[] {
  const seen = new Set<string>();
  const result: MineralSummary[] = [];
  for (const row of rows) {
    if (seen.has(row.slug)) continue;
    seen.add(row.slug);
    result.push({
      slug: row.slug,
      name: row.name,
      rawName: row.rawName,
      type: row.type,
    });
  }
  return result;
}

export function searchMinerals(criteria: SearchCriteria, rows: FilterRow[]): MineralSummary[] {
  return dedupeBySlug(filterRows(criteria, rows));
}
