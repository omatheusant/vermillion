import { GothicShell } from "@/components/vermillion/gothic-shell";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { EntrarForm } from "@/components/vermillion/auth/entrar-form";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ redirecionar_para?: string; erro?: string }>;
}) {
  const { redirecionar_para, erro } = await searchParams;

  return (
    <GothicShell>
      <div className="mx-auto max-w-md px-6 py-16">
        <p className="text-center font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
          Autenticação
        </p>
        <h1 className="mt-3 text-center font-display text-3xl text-foreground">
          Entre na noite.
        </h1>
        <LoreDivider className="my-8" />

        {erro === "link_invalido" ? (
          <p className="mb-6 rounded-sm border border-accent-crimson-bright/40 bg-accent-crimson-deep/10 px-4 py-3 text-sm text-accent-crimson-bright">
            O link usado é inválido ou expirou. Solicite um novo.
          </p>
        ) : null}

        <VelvetCard>
          <EntrarForm redirecionarPara={redirecionar_para} />
        </VelvetCard>
      </div>
    </GothicShell>
  );
}
