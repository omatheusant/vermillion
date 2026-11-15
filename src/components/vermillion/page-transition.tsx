"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Fade + leve deslocamento vertical na entrada de seção/página.
 * Duração dentro da janela 180–420ms definida em docs/DESIGN_SYSTEM.md §5.
 */
export function PageTransition({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
