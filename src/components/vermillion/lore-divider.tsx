import { cn } from "@/lib/utils";

/**
 * Filete fino com ornamento geométrico original ao centro. Nunca usar
 * ícones de terceiros ou clip-art de outra marca — SVG próprio, simples.
 *
 * `animateOnMount` revela o losango com um traço único (~700ms, CSS
 * puro) na entrada da seção — reservado a momentos editoriais de peso
 * (ex.: manifesto da landing), nunca ao uso corriqueiro do divisor em
 * telas de formulário. Cai para estático sob `prefers-reduced-motion`
 * via a regra global já existente em globals.css.
 */
export function LoreDivider({ className, animateOnMount = false }: { className?: string; animateOnMount?: boolean }) {
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
          pathLength={animateOnMount ? 1 : undefined}
          strokeDasharray={animateOnMount ? 1 : undefined}
          className={animateOnMount ? "animate-frame-reveal" : undefined}
        />
        <circle
          cx="9"
          cy="9"
          r="2"
          fill="currentColor"
          opacity={animateOnMount ? 0 : 1}
          className={animateOnMount ? "animate-frame-dot" : undefined}
        />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-ornament-gold-soft to-ornament-gold-soft" />
    </div>
  );
}
