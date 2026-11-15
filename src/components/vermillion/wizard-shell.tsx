"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WizardStepper, type WizardStepInfo } from "@/components/vermillion/wizard-stepper";
import { AutosaveIndicator, type AutosaveState } from "@/components/vermillion/autosave-indicator";

/**
 * Layout comum das etapas 1–9 do wizard O Abraço: 3 colunas em desktop
 * (etapas · formulário · prévia viva), stepper no topo + prévia em aba
 * no mobile (docs/UX_FLOW.md §3).
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
          <div className="lg:hidden">
            <Tabs defaultValue="form">
              <TabsList className="mb-4">
                <TabsTrigger value="form">Formulário</TabsTrigger>
                <TabsTrigger value="preview">Prévia do dossiê</TabsTrigger>
              </TabsList>
              <TabsContent value="form">{form}</TabsContent>
              <TabsContent value="preview">{preview}</TabsContent>
            </Tabs>
          </div>
          <div className="hidden lg:block">{form}</div>

          <div className="mt-8">{footer}</div>
        </div>

        <aside className="hidden lg:block">{preview}</aside>
      </div>
    </div>
  );
}
