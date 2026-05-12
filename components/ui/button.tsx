import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "default" | "sm";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-[var(--color-bg)] hover:bg-[var(--color-ink-soft)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-muted-soft)] hover:bg-[var(--color-border-soft)]",
  ghost:
    "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-border-soft)] hover:text-[var(--color-ink)]",
};

const SIZES: Record<Size, string> = {
  default: "h-10 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
};

const BASE =
  "inline-flex items-center justify-center rounded-md font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)]/30 disabled:pointer-events-none disabled:opacity-50";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}

interface LinkButtonProps extends React.ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function LinkButton({
  variant = "primary",
  size = "default",
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}
