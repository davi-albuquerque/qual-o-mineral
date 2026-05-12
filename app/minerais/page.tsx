// Alphabetical list — placeholder for tracer bullet (only QUARTZO available).
// Will be wired to data/minerals.json once the full extraction lands.

import Link from "next/link";

const MINERALS = [{ slug: "quartzo", name: "QUARTZO" }];

export default function AllMineralsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Todos os Minerais</h1>
      <p className="text-sm text-zinc-500">
        Lista alfabética. (Tracer bullet — apenas {MINERALS.length} mineral disponível.)
      </p>
      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
        {MINERALS.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/mineral/${m.slug}`}
              className="block px-4 py-3 hover:bg-zinc-50"
            >
              {m.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
