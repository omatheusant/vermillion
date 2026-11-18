"use client";

import { useState, type ReactNode } from "react";
import { cn } from "cn";
import { WizardStepper, type WizardStepInfo } from "@/components/vermillion/wizard-stepper";
import { AutosaveIndicator, type AutosaveState } from "@/components/vermillion/autosave-indicator";

/**
 * Layout comum das etapas 1–9 do wizard O Abraço: 3 colunas em desktop
 * (etapas · formulário · prévia viva), stepper no topo + prévia em aba
 * no mobile (docs/UX_FLOW.md §3).
 *
 * `form` e `preview` são montados uma única vez cada (nunca duplicados
 * no DOM): no mobile a visibilidade alterna por classe CSS conforme a
 * aba ativa, e a partir de `lg` ambos ficam sempre visíveis. Duplicar o
 * ReactNode em dois containers quebraria `id`/`htmlFor` (acessibilidade
 * e `getByLabel` em testes) por gerar ids repetidos no documento.
 */
export function WizardShell({
  steps,
  currentStep,
  onStepSelect,
  autosaveState,
  form,
  preview,
  footer,
}: {
  steps: WizardStepInfo[];
  currentStep: number;
  onStepSelect?: (index: number) => void;
  autosaveState: AutosaveState;
  form: ReactNode;
  preview: ReactNode;
  footer: ReactNode;
}) {
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 md:hidden">
        <WizardStepper steps={steps} currentStep={currentStep} onStepSelect={onStepSelect} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr_320px]">
        <aside className="hidden md:block">
          <WizardStepper steps={steps} currentStep={currentStep} onStepSelect={onStepSelect} />
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-end">
            <AutosaveIndicator state={autosaveState} />
          </div>

          {/* Mobile: prévia vira aba ao lado do formulário */}
          <div className="mb-4 inline-flex gap-1 rounded-lg bg-muted p-[3px] lg:hidden" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === "form"}
              onClick={() => setMobileView("form")}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                mobileView === "form" ? "bg-background text-foreground shadow-sm" : "text-foreground/60"
              )}
            >
              Formulário
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === "preview"}
              onClick={() => setMobileView("preview")}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                mobileView === "preview" ? "bg-background text-foreground shadow-sm" : "text-foreground/60"
              )}
            >
              Prévia do dossiê
            </button>
          </div>

          <div className={cn("lg:block", mobileView === "form" ? "block" : "hidden")}>{form}</div>

          <div className="mt-8">{footer}</div>
        </div>

        <aside className={cn("lg:block", mobileView === "preview" ? "block" : "hidden")}>{preview}</aside>
      </div>
    </div>
  );
}
