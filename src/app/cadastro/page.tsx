import { GothicShell } from "@/components/vermillion/gothic-shell";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { CadastroForm } from "@/components/vermillion/auth/cadastro-form";

export default function CadastroPage() {
  return (
    <GothicShell>
      <div className="mx-auto max-w-md px-6 py-16">
        <p className="text-center font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
          Autenticação
        </p>
        <h1 className="mt-3 text-center font-display text-3xl text-foreground">
          Seu nome na eternidade.
        </h1>
        <LoreDivider className="my-8" />
        <VelvetCard>
          <CadastroForm />
        </VelvetCard>
      </div>
    </GothicShell>
  );
}
