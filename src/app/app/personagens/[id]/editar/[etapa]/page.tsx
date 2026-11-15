import { GothicShell } from "@/components/vermillion/gothic-shell";
import { DemoBanner } from "@/components/vermillion/demo-banner";
import { WizardStepIdentity } from "@/components/vermillion/wizard-step-identity";

const NAV_ITEMS = [
  { label: "Meu Grimório", href: "/app/personagens" },
];

export default async function EditarPersonagemPage({
  params,
}: {
  params: Promise<{ id: string; etapa: string }>;
}) {
  const { etapa } = await params;
  const step = Number(etapa);

  return (
    <GothicShell navItems={NAV_ITEMS}>
      <DemoBanner />
      {step === 1 ? (
        <WizardStepIdentity />
      ) : (
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
            Etapa {Number.isNaN(step) ? "?" : step}
          </p>
          <h1 className="mt-3 font-display text-3xl text-foreground">
            Ainda não implementada nesta fase.
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            A Fase B cobre o shell do wizard e a Etapa 1 como demonstração
            funcional. As demais etapas (Linhagem, Atributos, Perícias,
            Disciplinas, Vantagens, Humanidade, História, Revisão) entram na
            Fase D, com persistência real e regras de domínio — ver
            docs/IMPLEMENTATION_PLAN.md.
          </p>
        </div>
      )}
    </GothicShell>
  );
}

