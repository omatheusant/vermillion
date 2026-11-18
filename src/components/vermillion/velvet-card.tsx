import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { OrnateFrame } from "@/components/vermillion/ornate-frame";

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
  ornate = false,
}: {
  children: ReactNode;
  className?: string;
  /** Etiqueta única de canto — usar no máximo uma por cartão. */
  cornerLabel?: ReactNode;
  elevated?: boolean;
  /**
   * Moldura de canto + glow sutil para "momentos de peso" (Ficha Viva
   * publicada, dossiê de clã) — nunca em cards de lista comuns
   * (docs/design/redesign-plan.md §5.2/§6).
   */
  ornate?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-sm border border-border p-6",
        ornate && "overflow-hidden",
        elevated || ornate ? "bg-surface-wine" : "bg-card",
        "shadow-[inset_0_1px_0_0_rgba(230,221,209,0.04)]",
        ornate && "shadow-[inset_0_1px_0_0_rgba(230,221,209,0.04),0_18px_52px_-16px_color-mix(in_oklab,var(--accent-crimson-deep)_70%,transparent)]",
        className
      )}
    >
      {ornate ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 55% at 85% 0%, color-mix(in oklab, var(--accent-crimson-deep) 20%, transparent), transparent 70%)",
          }}
        />
      ) : null}
      {ornate ? <OrnateFrame size="md" animateOnMount /> : null}
      {cornerLabel ? (
        <div className="absolute -top-2.5 right-4">{cornerLabel}</div>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
