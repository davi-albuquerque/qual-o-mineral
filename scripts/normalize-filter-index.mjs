#!/usr/bin/env node
// Normalize legacy spelling/typo divergences between filter-index.json and options/*.json.
// Idempotent: running twice yields byte-identical output.
//
// Root cause: the .xlsm DADOS MINERAIS tab has occasional typos and feminine/singular
// forms that don't match the canonical option keys (e.g. "fibrosa" vs "fibroso",
// "translucida" vs "translucido"). Fix here rather than touching the legacy .xlsm.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const FILTER_INDEX_PATH = resolve(ROOT, "data/filter-index.json");
const OPTION_PATHS = {
  brilho: resolve(ROOT, "data/options/brilho.json"),
  traco: resolve(ROOT, "data/options/traco.json"),
  habito: resolve(ROOT, "data/options/habito.json"),
  luz: resolve(ROOT, "data/options/luz.json"),
  cor: resolve(ROOT, "data/options/cor.json"),
};

// Manual canonicalization map: typo/variant -> canonical key.
const REWRITES = {
  luz: {
    translucida: "translucido",
  },
  habito: {
    fibrosa: "fibroso",
    macica: "macico",
    estalactite: "estalactites",
    granula: "granular",
  },
  cor: {
    vermelhobrilhante: "vermelho-brilhante",
  },
};

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function optionKeys(path) {
  return new Set(loadJson(path).map((o) => o.key));
}

function main() {
  const rows = loadJson(FILTER_INDEX_PATH);
  const optionKeyMap = Object.fromEntries(
    Object.entries(OPTION_PATHS).map(([field, path]) => [field, optionKeys(path)]),
  );

  const counts = { rewrites: 0, ok: 0 };
  const unknowns = { brilho: new Set(), traco: new Set(), habito: new Set(), luz: new Set(), cor: new Set() };

  for (const row of rows) {
    for (const field of Object.keys(OPTION_PATHS)) {
      const original = row[field];
      const rewritten = REWRITES[field]?.[original];
      if (rewritten) {
        row[field] = rewritten;
        counts.rewrites++;
      }
      const finalValue = row[field];
      if (!optionKeyMap[field].has(finalValue)) {
        unknowns[field].add(finalValue);
      } else {
        counts.ok++;
      }
    }
  }

  writeJson(FILTER_INDEX_PATH, rows);

  console.log(`Normalized filter-index.json — ${counts.rewrites} value rewrites applied across ${rows.length} rows.`);

  const anyUnknown = Object.values(unknowns).some((s) => s.size > 0);
  if (anyUnknown) {
    console.log("\nValues still missing from options/*.json (add them or extend REWRITES):");
    for (const [field, set] of Object.entries(unknowns)) {
      if (set.size === 0) continue;
      console.log(`  ${field}: ${[...set].sort().join(", ")}`);
    }
    process.exit(1);
  } else {
    console.log("All values reconcile with options/*.json.");
  }
}

main();
