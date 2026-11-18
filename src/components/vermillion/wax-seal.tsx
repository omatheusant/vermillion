import { cn } from "@/lib/utils";

const sizePx = {
  sm: 40,
  md: 64,
  lg: 96,
} as const;

/**
 * Selo de cera geométrico original (círculo irregular + monograma "V").
 * Reservado para momentos de peso: aprovação, publicação, autenticidade
 * (docs/DESIGN_SYSTEM.md §3) — não usar como decoração recorrente.
 *
 * `animateStamp` liga o "carimbo" (escala 0.8→1 com leve overshoot,
 * docs/DESIGN_SYSTEM.md §5) — só deve ser `true` no instante real da
 * ação (aprovar/publicar), nunca em toda renderização da página.
 */
export function WaxSeal({
  size = "md",
  className,
  label,
  animateStamp = false,
}: {
  size?: keyof typeof sizePx;
  className?: string;
  label?: string;
  animateStamp?: boolean;
}) {
  const px = sizePx[size];
  return (
    <div
      role="img"
      aria-label={label ?? "Selo de autenticidade Vermillion"}
      className={cn("inline-flex flex-col items-center gap-2", animateStamp && "animate-seal-stamp", className)}
    >
      <svg width={px} height={px} viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M50 4 C64 6 72 12 80 20 C90 28 96 38 94 52 C97 64 90 76 80 82 C70 92 58 96 46 94 C32 97 18 90 12 78 C4 70 2 58 6 46 C3 32 10 18 22 12 C30 4 40 2 50 4 Z"
          fill="var(--accent-crimson-deep)"
        />
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="var(--ink-ivory)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontSize="42"
          fontFamily="var(--font-display)"
          fill="var(--ink-ivory)"
        >
          V
        </text>
      </svg>
      {label ? (
        <span className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
          {label}
        </span>
      ) : null}
    </div>
  );
}
