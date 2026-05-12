import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: Props) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-[var(--color-border)]",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}
