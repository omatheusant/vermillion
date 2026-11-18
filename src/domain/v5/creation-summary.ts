import { calculateHealth, calculateWillpower } from "./derived-tracks";
import { DEFAULT_HUMANITY } from "./validate-humanity";
import type { AdvantagePick, AttributeDots, CharacterLineage, DisciplinePick, SkillDots } from "./types";

export interface CreationSummaryInput {
  lineage: CharacterLineage;
  clanName: string | null;
  attributes: AttributeDots[];
  skills: SkillDots[];
  disciplines: DisciplinePick[];
  thinBloodAlchemyLevel?: number;
  merits: AdvantagePick[];
  flaws: AdvantagePick[];
}

export interface CreationSummary {
  lineage: CharacterLineage;
  clanName: string | null;
  health: number;
  willpower: number;
  humanity: number;
  attributePointsSpent: number;
  skillPointsSpent: number;
  meritPointsSpent: number;
  flawPointsSpent: number;
  disciplines: DisciplinePick[];
  thinBloodAlchemyLevel: number;
}

/** Agrega os números derivados do personagem para a prévia do dossiê (etapa 9). */
export function getCreationSummary(input: CreationSummaryInput): CreationSummary {
  return {
    lineage: input.lineage,
    clanName: input.clanName,
    health: calculateHealth(input.attributes),
    willpower: calculateWillpower(input.attributes),
    humanity: DEFAULT_HUMANITY,
    attributePointsSpent: input.attributes.reduce((sum, a) => sum + a.value, 0),
    skillPointsSpent: input.skills.reduce((sum, s) => sum + s.value, 0),
    meritPointsSpent: input.merits.filter((m) => m.source === "base_budget").reduce((sum, m) => sum + m.dots, 0),
    flawPointsSpent: input.flaws.filter((f) => f.source === "base_budget").reduce((sum, f) => sum + f.dots, 0),
    disciplines: input.disciplines,
    thinBloodAlchemyLevel: input.thinBloodAlchemyLevel ?? 0,
  };
}
