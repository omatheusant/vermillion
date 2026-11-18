import { validateAttributes } from "./validate-attributes";
import { validateSkills } from "./validate-skills";
import { validateDisciplines } from "./validate-disciplines";
import { validateThinBloodAlchemy } from "./validate-thin-blood-alchemy";
import { validateAdvantages } from "./validate-advantages";
import { validateConvictions, type ConvictionInput, type TouchstoneInput } from "./validate-humanity";
import type {
  AdvantagePick,
  AttributeDots,
  CharacterLineage,
  DisciplineId,
  DisciplinePick,
  SkillDots,
  SkillPreset,
  ValidationIssue,
  ValidationResult,
} from "./types";

export interface CharacterForSubmission {
  name: string;
  concept: string;
  lineage: CharacterLineage;
  clanDisciplineIds?: DisciplineId[];
  attributes: AttributeDots[];
  skillPreset: SkillPreset;
  skills: SkillDots[];
  disciplines: DisciplinePick[];
  thinBloodAlchemy?: { level: number; note: string; maxLevel: number };
  merits: AdvantagePick[];
  flaws: AdvantagePick[];
  convictions: ConvictionInput[];
  touchstones: TouchstoneInput[];
}

/**
 * Agrega todas as validações de domínio numa única checklist de
 * pendências — usada pela etapa 9 (Revisão) para decidir se
 * "Enviar para aprovação" pode ser habilitado, e pelo servidor antes
 * de aceitar submit_character_for_review.
 */
export function validateCharacterForSubmission(character: CharacterForSubmission): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (character.name.trim().length === 0) {
    issues.push({ step: 1, field: "name", message: "Nome completo é obrigatório." });
  }
  if (character.concept.trim().length === 0) {
    issues.push({ step: 1, field: "concept", message: "Conceito é obrigatório." });
  }

  issues.push(...validateAttributes(character.attributes));
  issues.push(...validateSkills(character.skillPreset, character.skills));

  if (character.lineage === "thin_blood") {
    const alchemy = character.thinBloodAlchemy ?? { level: 0, note: "", maxLevel: 0 };
    issues.push(...validateThinBloodAlchemy(alchemy.level, alchemy.note, alchemy.maxLevel));
  } else {
    issues.push(
      ...validateDisciplines(character.lineage, character.disciplines, {
        clanDisciplineIds: character.clanDisciplineIds,
      }),
    );
  }

  issues.push(...validateAdvantages(character.merits, character.flaws));
  issues.push(...validateConvictions(character.convictions, character.touchstones));

  return { valid: issues.length === 0, issues };
}
