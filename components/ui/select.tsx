// Styled native select. Avoids client-side JS hydration; works on every browser
// and on mobile out of the box (especially important for the elderly target user).

import { cn } from "@/lib/utils";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, id, className, children, ...props }: Props) {
  const selectId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "w-full appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 pr-9 text-sm text-[var(--color-ink)] transition-colors hover:border-[var(--color-muted-soft)] focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/15",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown />
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 8"
      className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-muted)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 1.5 6 6.5l5-5" />
    </svg>
  );
}
