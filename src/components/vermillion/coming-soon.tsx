import { LoreDivider } from "@/components/vermillion/lore-divider";

/**
 * Placeholder temático para rotas ainda não implementadas — nunca o 404
 * genérico do Next.js, para manter a experiência coerente mesmo onde o
 * produto ainda está incompleto (ver docs/IMPLEMENTATION_PLAN.md para a
 * fase que entrega cada rota).
 */
export function ComingSoon({
  eyebrow,
  title,
  description,
  phase,
}: {
  eyebrow: string;
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl text-foreground">{title}</h1>
      <LoreDivider className="my-8" />
      <p className="text-sm text-ink-muted">{description}</p>
      <p className="mt-4 text-xs text-ink-muted">
        Chega em: <span className="text-foreground">{phase}</span>
      </p>
    </div>
  );
}
