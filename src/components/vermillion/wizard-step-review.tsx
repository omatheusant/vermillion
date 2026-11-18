"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { Button } from "@/components/ui/button";
import { WizardStepper } from "@/components/vermillion/wizard-stepper";
import { getWizardSteps } from "@/lib/wizard-steps";
import { submitForReviewAction } from "@/lib/wizard-actions";
import type { ValidationIssue } from "@/domain/v5";

export function WizardStepReview({
  characterId,
  characterName,
  initialIssues,
}: {
  characterId: string;
  characterName: string;
  initialIssues: ValidationIssue[];
}) {
  const router = useRouter();
  const [issues, setIssues] = useState(initialIssues);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const pendingByStep: Partial<Record<number, number>> = {};
  for (const issue of issues) {
    pendingByStep[issue.step] = (pendingByStep[issue.step] ?? 0) + 1;
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitForReviewAction(characterId);
      if (result.error) {
        setServerError(result.error);
        return;
      }
      if (result.issues.length > 0) {
        setIssues(result.issues);
        return;
      }
      setSubmitted(true);
      router.push("/app/personagens");
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 md:hidden">
        <WizardStepper steps={getWizardSteps(pendingByStep)} currentStep={9} onStepSelect={(i) => router.push(`/app/personagens/${characterId}/editar/${i}`)} />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
        <aside className="hidden md:block">
          <WizardStepper
            steps={getWizardSteps(pendingByStep)}
            currentStep={9}
            onStepSelect={(i) => router.push(`/app/personagens/${characterId}/editar/${i}`)}
          />
        </aside>

        <div>
          <h1 className="font-display text-2xl text-foreground">Revisão e envio</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Confira o dossiê de <strong className="text-foreground">{characterName}</strong> antes de enviar para o
            Conselho.
          </p>

          {issues.length > 0 ? (
            <VelvetCard className="mt-6 border-accent-crimson-bright/50">
              <h2 className="font-display text-lg text-foreground">Pendências</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
                {issues.map((issue, i) => (
                  <li key={i}>
                    Etapa {issue.step}: {issue.message}
                  </li>
                ))}
              </ul>
            </VelvetCard>
          ) : (
            <VelvetCard className="mt-6 border-ornament-gold/50">
              <p className="text-sm text-foreground">Tudo pronto. Nenhuma pendência encontrada.</p>
            </VelvetCard>
          )}

          {serverError ? (
            <p role="alert" className="mt-4 text-sm text-accent-crimson-bright">
              {serverError}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-6">
            <Button variant="outline" type="button" onClick={() => router.push(`/app/personagens/${characterId}/editar/8`)}>
              Voltar
            </Button>
            <Button type="button" disabled={issues.length > 0 || isPending || submitted} onClick={handleSubmit}>
              {isPending ? "Enviando..." : "Enviar para aprovação"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
