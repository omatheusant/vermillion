import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cartão-base do produto: borda dourada fina, cantos quase retos, sombra
 * interna sutil — tratamento de "dossiê confidencial" sem textura pesada
 * atrás do conteúdo (docs/DESIGN_SYSTEM.md §4).
 */
export function VelvetCard({
  children,
  className,
  cornerLabel,
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  /** Etiqueta única de canto — usar no máximo uma por cartão. */
  cornerLabel?: ReactNode;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-sm border border-border p-6",
        elevated ? "bg-surface-wine" : "bg-card",
        "shadow-[inset_0_1px_0_0_rgba(230,221,209,0.04)]",
        className
      )}
    >
      {cornerLabel ? (
        <div className="absolute -top-2.5 right-4">{cornerLabel}</div>
      ) : null}
      {children}
    </div>
  );
}
