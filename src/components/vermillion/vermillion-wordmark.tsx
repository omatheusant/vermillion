import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "text-sm tracking-[0.3em]",
  md: "text-lg tracking-[0.35em]",
  lg: "text-3xl tracking-[0.4em] md:text-4xl",
  xl: "text-5xl tracking-[0.35em] md:text-7xl",
} as const;

/**
 * Wordmark autoral do produto — Cinzel, versalete espaçado, nunca usado
 * em corpo de texto (docs/DESIGN_SYSTEM.md §2).
 */
export function VermillionWordmark({
  size = "md",
  className,
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-badge font-medium uppercase text-foreground",
        sizeClasses[size],
        className
      )}
    >
      Vermillion
    </span>
  );
}
