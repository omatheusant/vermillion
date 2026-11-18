"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Parallax leve de 1 camada — nunca mais de uma por seção, nunca na
 * própria tipografia/conteúdo de leitura, só em pano de fundo
 * decorativo (docs/DESIGN_SYSTEM.md §5, regra revisada a pedido
 * explícito do usuário). `scroll`+`resize` com rAF, sem loop contínuo
 * ocioso; desliga por completo sob `prefers-reduced-motion`.
 */
export function ParallaxLayer({
  children,
  speed = 0.15,
  className,
}: {
  children: ReactNode;
  /** Fração do deslocamento de scroll aplicada à camada — positivo "arrasta" mais devagar que o scroll. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    function update() {
      ticking = false;
      const rect = el!.parentElement!.getBoundingClientRect();
      const centered = rect.top + rect.height / 2 - window.innerHeight / 2;
      el!.style.transform = `translate3d(0, ${(centered * speed).toFixed(1)}px, 0)`;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
