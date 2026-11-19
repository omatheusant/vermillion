import { SKILL_IDS, type SkillDots, type SkillPreset, type ValidationIssue } from "./types";
import { SKILL_LABELS } from "@/lib/v5-labels";

/**
 * Presets de Perícia — docs/V5_RULES_MATRIX.md §4. Exclusivos, não
 * somam entre si. Cada preset é a contagem exata de perícias em cada
 * nível de pontos (o resto fica em zero).
 */
export const SKILL_PRESET_BUDGET: Record<SkillPreset, { value: number; count: number }[]> = {
  generalist: [
    { value: 3, count: 1 },
    { value: 2, count: 8 },
    { value: 1, count: 10 },
  ],
  balanced: [
    { value: 3, count: 3 },
    { value: 2, count: 5 },
    { value: 1, count: 7 },
  ],
  specialist: [
    { value: 4, count: 1 },
    { value: 3, count: 3 },
    { value: 2, count: 3 },
    { value: 1, count: 3 },
  ],
};

export function validateSkills(preset: SkillPreset, dots: SkillDots[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const knownIds = new Set(SKILL_IDS as readonly string[]);
  const seen = new Set<string>();
  const countByValue = new Map<number, number>();

  for (const dot of dots) {
    if (!knownIds.has(dot.skillId)) {
      issues.push({ step: 4, field: dot.skillId, message: `Perícia desconhecida: ${dot.skillId}.` });
      continue;
    }
    if (seen.has(dot.skillId)) {
      issues.push({ step: 4, field: dot.skillId, message: `Perícia duplicada: ${SKILL_LABELS[dot.skillId as keyof typeof SKILL_LABELS] ?? dot.skillId}.` });
    }
    seen.add(dot.skillId);

    if (dot.value < 0 || dot.value > 5) {
      issues.push({ step: 4, field: dot.skillId, message: "Perícias devem ficar entre 0 e 5 pontos." });
      continue;
    }
    if (dot.value > 0) {
      countByValue.set(dot.value, (countByValue.get(dot.value) ?? 0) + 1);
    }
  }

  if (issues.length > 0) return issues;

  const budget = SKILL_PRESET_BUDGET[preset];
  for (const { value, count } of budget) {
    if ((countByValue.get(value) ?? 0) !== count) {
      issues.push({
        step: 4,
        field: "skills",
        message: `Preset "${preset}" exige exatamente ${count} perícia(s) com ${value} ponto(s).`,
      });
    }
  }

  const allowedValues = new Set(budget.map((b) => b.value));
  for (const value of countByValue.keys()) {
    if (!allowedValues.has(value)) {
      issues.push({
        step: 4,
        field: "skills",
        message: `O preset "${preset}" não permite perícias com ${value} ponto(s).`,
      });
    }
  }

  return issues;
}
