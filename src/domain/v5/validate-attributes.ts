import { ATTRIBUTE_IDS, type AttributeDots, type ValidationIssue } from "./types";
import { ATTRIBUTE_LABELS } from "@/lib/v5-labels";

/**
 * Distribuição inicial dos 9 Atributos — docs/V5_RULES_MATRIX.md §4:
 * exatamente 1×4, 3×3, 4×2, 1×1. Nenhum atributo fora de 1..5.
 */
export const ATTRIBUTE_CREATION_BUDGET = [4, 3, 3, 3, 2, 2, 2, 2, 1] as const;

export function validateAttributes(dots: AttributeDots[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const dot of dots) {
    if (seen.has(dot.attributeId)) {
      issues.push({ step: 3, field: dot.attributeId, message: `Atributo duplicado: ${ATTRIBUTE_LABELS[dot.attributeId]}.` });
    }
    seen.add(dot.attributeId);

    if (dot.value < 1 || dot.value > 5) {
      issues.push({ step: 3, field: dot.attributeId, message: "Atributos devem ficar entre 1 e 5 pontos." });
    }
  }

  for (const attributeId of ATTRIBUTE_IDS) {
    if (!seen.has(attributeId)) {
      issues.push({ step: 3, field: attributeId, message: `Atributo ${ATTRIBUTE_LABELS[attributeId]} não foi preenchido.` });
    }
  }

  if (issues.length > 0) return issues;

  const sortedValues = [...dots.map((d) => d.value)].sort((a, b) => b - a);
  const expected = [...ATTRIBUTE_CREATION_BUDGET];

  if (sortedValues.length !== expected.length || !sortedValues.every((v, i) => v === expected[i])) {
    issues.push({
      step: 3,
      field: "attributes",
      message: "A distribuição precisa ser exatamente 1 atributo com 4, 3 com 3, 4 com 2 e 1 com 1.",
    });
  }

  return issues;
}
