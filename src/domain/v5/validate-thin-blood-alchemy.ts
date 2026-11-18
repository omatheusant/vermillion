import type { ValidationIssue } from "./types";

/**
 * Fluxo especial de Sangue-Ralo — ADR 0004: só nível de Alquimia +
 * nota narrativa livre na criação. Fórmulas específicas não são
 * selecionáveis no MVP (concedidas depois via xp_ledger pelo narrador).
 */
export function validateThinBloodAlchemy(level: number, note: string, maxLevel: number): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!Number.isInteger(level) || level < 0 || level > maxLevel) {
    issues.push({
      step: 5,
      field: "thin_blood_alchemy_level",
      message: `Nível de Alquimia de Sangue-Ralo deve ser um inteiro entre 0 e ${maxLevel} (orçamento da crônica).`,
    });
  }

  if (level > 0 && note.trim().length === 0) {
    issues.push({
      step: 5,
      field: "thin_blood_alchemy_note",
      message: "Descreva brevemente como o personagem aprendeu Alquimia de Sangue-Ralo.",
    });
  }

  return issues;
}
