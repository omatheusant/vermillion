"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { WizardShell } from "@/components/vermillion/wizard-shell";
import { Button } from "@/components/ui/button";
import type { AutosaveState } from "@/components/vermillion/autosave-indicator";
import { getWizardSteps } from "@/lib/wizard-steps";
import type { StepActionState } from "@/lib/wizard-actions";

/**
 * Casco comum às etapas 1–9: navegação entre etapas, chamada do save
 * action com a versão esperada (ADR 0003 — recusa silenciosa nunca,
 * sempre avisa e pede recarregar em conflito), e botões Voltar/Continuar.
 */
export function WizardStepFrame({
  characterId,
  currentStep,
  pendingByStep,
  form,
  preview,
  onSave,
  canContinue = true,
  continueLabel = "Continuar",
}: {
  characterId: string;
  currentStep: number;
  pendingByStep?: Partial<Record<number, number>>;
  form: ReactNode;
  preview: ReactNode;
  onSave: () => Promise<StepActionState>;
  canContinue?: boolean;
  continueLabel?: string;
}) {
  const router = useRouter();
  const [autosaveState, setAutosaveState] = useState<AutosaveState>("idle");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function goToStep(step: number) {
    router.push(`/app/personagens/${characterId}/editar/${step}`);
  }

  async function handleSave(andContinue: boolean) {
    setAutosaveState("saving");
    setError(undefined);
    const result = await onSave();
    if (result.error) {
      setAutosaveState("error");
      setError(result.error);
      return;
    }
    setAutosaveState("saved");
    if (andContinue && currentStep < 9) {
      goToStep(currentStep + 1);
    }
  }

  return (
    <WizardShell
      steps={getWizardSteps(pendingByStep)}
      currentStep={currentStep}
      onStepSelect={goToStep}
      autosaveState={autosaveState}
      form={
        <div className="space-y-6">
          {form}
          {error ? (
            <p role="alert" className="text-sm text-accent-crimson-bright">
              {error}
            </p>
          ) : null}
        </div>
      }
      preview={preview}
      footer={
        <div className="flex items-center justify-between border-t border-border/70 pt-6">
          <Button
            variant="outline"
            type="button"
            disabled={currentStep <= 1 || isPending}
            onClick={() => startTransition(() => handleSave(false).then(() => goToStep(currentStep - 1)))}
          >
            Voltar
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={() => startTransition(() => handleSave(false))}
            >
              Salvar rascunho
            </Button>
            <Button
              type="button"
              disabled={!canContinue || isPending}
              onClick={() => startTransition(() => handleSave(true))}
            >
              {continueLabel}
            </Button>
          </div>
        </div>
      }
    />
  );
}
