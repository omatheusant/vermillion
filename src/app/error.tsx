"use client";

import { LoreDivider } from "@/components/vermillion/lore-divider";

/**
 * Boundary de erro temático — nunca o overlay genérico do Next.js, para
 * manter a identidade gótica mesmo quando algo falha (ex.: limite de 3
 * slots atingido numa corrida de criação concorrente).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
        Algo interrompeu o ritual
      </p>
      <h1 className="mt-3 font-display text-3xl text-foreground">
        {error.message || "Um erro inesperado aconteceu."}
      </h1>
      <LoreDivider className="my-8 max-w-xs" />
      <button
        type="button"
        onClick={reset}
        className="rounded-sm bg-primary px-6 py-3 font-badge text-xs uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/80"
      >
        Tentar de novo
      </button>
    </div>
  );
}
