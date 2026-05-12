#!/usr/bin/env node
// Sanitize chemical formulas in data/minerals.json and data/minerals/*.json.
// Idempotent: running twice yields byte-identical output.
//
// Cleanups applied (in order):
//   1. Trim leading hyphens / "- OTHERNAME" prefixes left over from .xlsm cells
//      that listed multiple variants in one cell (e.g. ALBITA had
//      "- ANORTITA   NaAlSi3O8         CaAl2Si2O8").
//   2. Collapse runs of internal whitespace to a single space, then drop spaces
//      adjacent to '(' or ')' so subscripts don't break visually.
//   3. If multiple distinct formulas remain space-separated, keep the FIRST one.
//      (Heuristic: a "second formula" starts after >=3 spaces or after the first
//      well-formed formula token of length >= 4.)
//   4. Replace '.' between groups (hydrate dot) with '·' (U+00B7).
//   5. Per-slug manual overrides from overrides/formulas.json win over heuristics.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const MINERALS_JSON = resolve(ROOT, "data/minerals.json");
const MINERAL_DIR = resolve(ROOT, "data/minerals");
const OVERRIDES_PATH = resolve(ROOT, "overrides/formulas.json");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// Heuristic: strip a leading "- NAME" prefix (uppercase letters, max ~25 chars)
// followed by 2+ spaces. Matches ".- ANORTITA   NaAlSi3O8".
function stripLeadingVariantName(s) {
  return s.replace(/^-\s*[A-ZÀ-Ý][A-ZÀ-Ý\- ]{1,25}\s{2,}/u, "").trim();
}

// Replace hydration-dot conventions: " .6H2O", ".6H2O", " · 6H2O" → "·6H2O"
function normalizeHydration(s) {
  return s
    .replace(/\s*[·.]\s*(\d*\s*H2O)/g, "·$1")
    .replace(/·\s+/g, "·");
}

// Collapse whitespace, drop spaces adjacent to parens.
function tightenWhitespace(s) {
  return s
    .replace(/\s+/g, " ")
    .replace(/\s+\(/g, "(")
    .replace(/\)\s+([0-9])/g, ")$1")
    .trim();
}

// If multiple formulas remain (e.g. after stripping variant name we still have
// "NaAlSi3O8 CaAl2Si2O8"), keep the first one. A "formula" is a sequence with
// no internal whitespace.
function keepFirstFormula(s) {
  const parts = s.split(/\s{2,}/).filter(Boolean);
  if (parts.length > 1) return parts[0];
  // Also catch "NaAlSi3O8 CaAl2Si2O8" — two tokens separated by single space
  // where both look like formulas (start with capital, contain digits).
  const tokens = s.split(/\s+/);
  if (tokens.length >= 2) {
    const looksLikeFormula = (t) =>
      /^[\(A-Z]/.test(t) && /\d/.test(t) && t.length >= 4;
    if (looksLikeFormula(tokens[0]) && looksLikeFormula(tokens[1])) {
      return tokens[0];
    }
  }
  return s;
}

function sanitize(formula) {
  if (!formula || typeof formula !== "string") return formula;
  let out = formula.trim();
  out = stripLeadingVariantName(out);
  out = normalizeHydration(out);
  out = tightenWhitespace(out);
  out = keepFirstFormula(out);
  out = tightenWhitespace(out);
  return out;
}

function loadOverrides() {
  if (!existsSync(OVERRIDES_PATH)) return {};
  try {
    const raw = loadJson(OVERRIDES_PATH);
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function main() {
  const overrides = loadOverrides();
  const index = loadJson(MINERALS_JSON);

  let touched = 0;
  for (const m of index) {
    if (!m.formula) continue;
    const original = m.formula;
    const cleaned = overrides[m.slug] ?? sanitize(original);
    if (cleaned !== original) {
      m.formula = cleaned;
      touched++;
    }
  }
  writeJson(MINERALS_JSON, index);

  // Also update per-mineral files.
  const files = readdirSync(MINERAL_DIR).filter((f) => f.endsWith(".json"));
  let perFileTouched = 0;
  for (const file of files) {
    const path = join(MINERAL_DIR, file);
    const m = loadJson(path);
    if (!m.formula) continue;
    const cleaned = overrides[m.slug] ?? sanitize(m.formula);
    if (cleaned !== m.formula) {
      m.formula = cleaned;
      writeJson(path, m);
      perFileTouched++;
    }
  }

  console.log(`Sanitized ${touched} formulas in minerals.json (of ${index.length}).`);
  console.log(`Sanitized ${perFileTouched} formulas across ${files.length} per-mineral files.`);
}

main();
