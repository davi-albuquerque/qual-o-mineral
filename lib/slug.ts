// Generate ASCII URL slugs from PT-BR mineral names.
// Round-trip uniqueness is verified in `slug.test.ts`.

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // strip combining diacritics (NFD marks)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
