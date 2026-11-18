import { cn } from "@/lib/utils";

const SIZE_PX = { sm: 28, md: 40, lg: 56 } as const;

/**
 * Moldura de canto SVG original (4 brackets lineares estilo gravura +
 * um pequeno losango de acento) para "momentos de peso" — Ficha Viva
 * publicada, dossiê de clã, splash de aprovação
 * (docs/design/redesign-plan.md §5/§6). Nunca usar em cards de lista
 * comuns: reservada a no máximo 1 tela por fluxo, igual à regra do
 * `WaxSeal` (docs/DESIGN_SYSTEM.md §3).
 *
 * `animateOnMount` ativa um traço revelado único (~700ms) via CSS puro
 * — a regra global de `prefers-reduced-motion` em globals.css já reduz
 * a duração a ~0, então o resultado cai para "moldura completa
 * instantânea" sem nenhum tratamento extra aqui.
 */
function Corner({ size, animate, style }: { size: number; animate: boolean; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="absolute text-ornament-gold"
      style={style}
    >
      <path
        d="M2 36 L2 12 Q2 2 12 2 L36 2"
        stroke="currentColor"
        strokeWidth="1"
        pathLength={animate ? 1 : undefined}
        strokeDasharray={animate ? 1 : undefined}
        className={animate ? "animate-frame-reveal" : undefined}
      />
      <path
        d="M9 30 L9 16 Q9 9 16 9 L30 9"
        stroke="currentColor"
        strokeWidth="1"
        pathLength={animate ? 1 : undefined}
        strokeDasharray={animate ? 1 : undefined}
        className={animate ? "animate-frame-reveal" : undefined}
        style={animate ? { animationDelay: "90ms" } : undefined}
      />
      <path d="M7 3 L11 7 L7 11 L3 7 Z" fill="currentColor" opacity={animate ? 0 : 1} className={animate ? "animate-frame-dot" : undefined} />
    </svg>
  );
}

export function OrnateFrame({
  size = "md",
  className,
  animateOnMount = false,
}: {
  size?: keyof typeof SIZE_PX;
  className?: string;
  animateOnMount?: boolean;
}) {
  const px = SIZE_PX[size];
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <Corner size={px} animate={animateOnMount} style={{ top: 0, left: 0 }} />
      <Corner size={px} animate={animateOnMount} style={{ top: 0, right: 0, transform: "scaleX(-1)" }} />
      <Corner size={px} animate={animateOnMount} style={{ bottom: 0, left: 0, transform: "scaleY(-1)" }} />
      <Corner size={px} animate={animateOnMount} style={{ bottom: 0, right: 0, transform: "scale(-1, -1)" }} />
    </div>
  );
}
