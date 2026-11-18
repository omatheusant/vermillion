import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Letra-capitular para a abertura de UM bloco de história/lore por
 * dossiê — nunca mais de um por tela, mesma régua de moderação do
 * `WaxSeal`/`cornerLabel` (docs/DESIGN_SYSTEM.md §4). Implementado só
 * com `::first-letter` (ver globals.css): o texto real permanece
 * intacto para leitores de tela, apenas o primeiro glifo ganha
 * destaque visual.
 */
export function DropCapLore({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("drop-cap-lore text-sm leading-relaxed text-foreground", className)}>{children}</p>;
}
