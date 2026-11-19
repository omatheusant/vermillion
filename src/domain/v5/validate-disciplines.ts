import type { CharacterLineage, DisciplineId, DisciplinePick, ValidationIssue } from "./types";
import { DISCIPLINE_LABELS } from "@/lib/v5-labels";

/**
 * Disciplinas na criação — docs/V5_RULES_MATRIX.md §4 + master doc
 * etapa 5: clã comum escolhe duas Disciplinas DO clã (2 pontos + 1
 * ponto), terceira sem pontos na criação. Caitiff escolhe livremente
 * (ADR não fixa uma tríade — "Castoff Summary Sheet" confirma duas
 * marcas de "escolha qualquer Disciplina"). Sangue-Ralo não tem
 * Disciplina de clã — ver validateThinBloodAlchemy (ADR 0004).
 */
const CREATION_DOTS = [2, 1];

export function validateDisciplines(
  lineage: CharacterLineage,
  picks: DisciplinePick[],
  options: { clanDisciplineIds?: DisciplineId[] } = {},
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (lineage === "thin_blood") {
    if (picks.length > 0) {
      issues.push({
        step: 5,
        field: "disciplines",
        message: "Sangue-Ralo não escolhe Disciplinas de clã na criação — use Alquimia de Sangue-Ralo.",
      });
    }
    return issues;
  }

  if (picks.some((p) => p.disciplineId === "thin_blood_alchemy")) {
    issues.push({
      step: 5,
      field: "disciplines",
      message: "Alquimia de Sangue-Ralo não é uma Disciplina de clã — não pode ser escolhida aqui.",
    });
  }

  if (picks.length !== 2) {
    issues.push({ step: 5, field: "disciplines", message: "Escolha exatamente duas Disciplinas na criação." });
    return issues;
  }

  const sortedValues = [...picks.map((p) => p.value)].sort((a, b) => b - a);
  if (sortedValues[0] !== CREATION_DOTS[0] || sortedValues[1] !== CREATION_DOTS[1]) {
    issues.push({
      step: 5,
      field: "disciplines",
      message: "Uma Disciplina recebe 2 pontos e a outra recebe 1 ponto na criação.",
    });
  }

  if (new Set(picks.map((p) => p.disciplineId)).size !== picks.length) {
    issues.push({ step: 5, field: "disciplines", message: "As duas Disciplinas escolhidas devem ser diferentes." });
  }

  if (lineage === "clan") {
    const allowed = new Set(options.clanDisciplineIds ?? []);
    for (const pick of picks) {
      if (pick.source !== "clan") {
        issues.push({ step: 5, field: "disciplines", message: "Disciplinas na criação de clã usam source='clan'." });
      }
      if (!allowed.has(pick.disciplineId)) {
        issues.push({
          step: 5,
          field: pick.disciplineId,
          message: `${DISCIPLINE_LABELS[pick.disciplineId] ?? pick.disciplineId} não é uma Disciplina do clã escolhido.`,
        });
      }
    }
  }

  if (lineage === "caitiff") {
    for (const pick of picks) {
      if (pick.source !== "caitiff") {
        issues.push({ step: 5, field: "disciplines", message: "Disciplinas de Caitiff usam source='caitiff'." });
      }
    }
  }

  return issues;
}
