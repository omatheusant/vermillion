import { cn } from "@/lib/utils";

/**
 * Filete fino com ornamento geométrico original ao centro. Nunca usar
 * ícones de terceiros ou clip-art de outra marca — SVG próprio, simples.
 */
export function LoreDivider({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn("flex items-center gap-4 text-ornament-gold", className)}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-ornament-gold-soft to-ornament-gold-soft" />
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M9 1 L17 9 L9 17 L1 9 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="9" cy="9" r="2" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-ornament-gold-soft to-ornament-gold-soft" />
    </div>
  );
}
