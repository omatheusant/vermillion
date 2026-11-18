import type { ValidationIssue } from "./types";

export const DEFAULT_HUMANITY = 7;

export interface ConvictionInput {
  id: string;
  label: string;
}

export interface TouchstoneInput {
  convictionId: string | null;
  name: string;
}

/**
 * Humanidade e crenças — master doc etapa 7: 1 a 3 Convicções, cada
 * uma vinculada a exatamente 1 Pilar (Touchstone) mortal.
 */
export function validateConvictions(convictions: ConvictionInput[], touchstones: TouchstoneInput[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (convictions.length < 1 || convictions.length > 3) {
    issues.push({ step: 7, field: "convictions", message: "Escolha de 1 a 3 Convicções." });
  }

  for (const conviction of convictions) {
    if (conviction.label.trim().length === 0) {
      issues.push({ step: 7, field: "convictions", message: "Toda Convicção precisa de um texto." });
    }
    const linked = touchstones.filter((t) => t.convictionId === conviction.id);
    if (linked.length !== 1) {
      issues.push({
        step: 7,
        field: "touchstones",
        message: `A Convicção "${conviction.label || conviction.id}" precisa de exatamente 1 Pilar vinculado.`,
      });
    }
  }

  return issues;
}
