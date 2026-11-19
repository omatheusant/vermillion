import type { AdvantagePick, ValidationIssue } from "./types";

/**
 * Orçamento de Vantagens/Defeitos na criação — docs/V5_RULES_MATRIX.md
 * §4: 7 pontos de Vantagens (Méritos/Antecedentes), 2 de Defeitos.
 * Vantagens/Defeitos do Tipo de Predador (source='predator_type') não
 * consomem esse orçamento — master doc, etapa 6.
 */
export const MERIT_BUDGET = 7;
export const FLAW_BUDGET = 2;

export function validateAdvantages(merits: AdvantagePick[], flaws: AdvantagePick[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const meritSpend = merits
    .filter((m) => m.source === "base_budget")
    .reduce((sum, m) => sum + m.dots, 0);
  const flawSpend = flaws
    .filter((f) => f.source === "base_budget")
    .reduce((sum, f) => sum + f.dots, 0);

  if (meritSpend > MERIT_BUDGET) {
    issues.push({
      step: 6,
      field: "merits",
      message: `Orçamento de Vantagens excedido: ${meritSpend}/${MERIT_BUDGET} pontos.`,
    });
  }

  if (flawSpend > FLAW_BUDGET) {
    issues.push({
      step: 6,
      field: "flaws",
      message: `Orçamento de Defeitos excedido: ${flawSpend}/${FLAW_BUDGET} pontos.`,
    });
  }

  // Méritos/Defeitos de Sangue-Ralo (reference_advantages.lineage_restriction
  // = 'thin_blood') não têm custo em pontos no corebook (dots_min=dots_max=0
  // no catálogo) — por isso 0 é um valor aceitável aqui. O <input min=...> da
  // UI usa o dots_min do item do catálogo para impedir 0 em itens comuns.
  for (const pick of [...merits, ...flaws]) {
    if (pick.dots < 0 || pick.dots > 5) {
      issues.push({ step: 6, field: "advantages", message: "Cada Vantagem/Defeito vale entre 1 e 5 pontos." });
    }
  }

  return issues;
}
