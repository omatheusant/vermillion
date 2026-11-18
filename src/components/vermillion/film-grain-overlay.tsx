import { cn } from "@/lib/utils";

/**
 * Grão de filme finíssimo para telas de tela cheia (hero, splash) —
 * docs/design/redesign-plan.md §5.1/§6. SVG determinístico (seed fixa,
 * nunca Math.random) para não gerar mismatch de hidratação entre
 * servidor e cliente. Puramente decorativo e estático — não é
 * animação, então não depende de `prefers-reduced-motion`.
 */
const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<filter id='vermillion-grain'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='7'/>" +
  "<feColorMatrix type='saturate' values='0'/>" +
  "</filter>" +
  "<rect width='100%' height='100%' filter='url(#vermillion-grain)'/>" +
  "</svg>";

const GRAIN_BACKGROUND_IMAGE = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

export function FilmGrainOverlay({ className, opacity = 0.035 }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 mix-blend-overlay", className)}
      style={{ backgroundImage: GRAIN_BACKGROUND_IMAGE, backgroundRepeat: "repeat", opacity }}
    />
  );
}
