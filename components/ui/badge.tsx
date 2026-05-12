import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "accent";

const VARIANTS: Record<Variant, string> = {
  default:
    "bg-[var(--color-border-soft)] text-[var(--color-ink-soft)] border border-[var(--color-border)]",
  outline:
    "bg-transparent text-[var(--color-muted)] border border-[var(--color-border)]",
  accent:
    "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border border-[var(--color-accent)]/20",
};

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ variant = "default", className, ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
