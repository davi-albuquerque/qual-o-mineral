// Minimal cn() helper — joins truthy class names. Avoids adding clsx + tailwind-merge
// as dependencies. Good enough for our usage; if class conflicts emerge we can swap in
// tailwind-merge later.
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
