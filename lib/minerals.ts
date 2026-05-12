// Server-side loader for individual mineral JSON files.
// Uses fs at module scope (Node runtime); not bundled into the client.

import fs from "node:fs";
import path from "node:path";
import type { Mineral } from "@/types/mineral";

const MINERALS_DIR = path.join(process.cwd(), "data", "minerals");

export function loadMineral(slug: string): Mineral | null {
  const file = path.join(MINERALS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as Mineral;
}

export function allSlugs(): string[] {
  return fs
    .readdirSync(MINERALS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}
