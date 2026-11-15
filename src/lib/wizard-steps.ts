import type { WizardStepInfo } from "@/components/vermillion/wizard-stepper";

/**
 * As 10 etapas do wizard O Abraço (0–9), conforme docs/UX_FLOW.md §3.
 * `pendingCount` é calculado em runtime a partir da validação de domínio
 * (Fase D) — aqui só o rótulo é fixo.
 */
export const WIZARD_STEP_TITLES = [
  "Introdução",
  "Identidade e conceito",
  "Linhagem e sociedade",
  "Atributos",
  "Perícias",
  "Disciplinas e poderes",
  "Vantagens e Defeitos",
  "Humanidade e crenças",
  "História e aparência",
  "Revisão e envio",
] as const;

export function getWizardSteps(pendingByStep: Partial<Record<number, number>> = {}): WizardStepInfo[] {
  return WIZARD_STEP_TITLES.map((title, index) => ({
    index,
    title,
    pendingCount: pendingByStep[index],
  }));
}
