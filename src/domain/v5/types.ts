/**
 * Tipos e catálogos fixos do ruleset V5 — docs/V5_RULES_MATRIX.md.
 * Nenhuma dependência de React/Supabase; funções puras só.
 */

export const RULESET_VERSION = "v5-vermillion-2026.1";

export const ATTRIBUTE_IDS = [
  "strength",
  "dexterity",
  "stamina",
  "charisma",
  "manipulation",
  "composure",
  "intelligence",
  "wits",
  "resolve",
] as const;
export type AttributeId = (typeof ATTRIBUTE_IDS)[number];

export const ATTRIBUTE_CATEGORY: Record<AttributeId, "physical" | "social" | "mental"> = {
  strength: "physical",
  dexterity: "physical",
  stamina: "physical",
  charisma: "social",
  manipulation: "social",
  composure: "social",
  intelligence: "mental",
  wits: "mental",
  resolve: "mental",
};

export const SKILL_IDS = [
  // físicas
  "athletics",
  "brawl",
  "craft",
  "drive",
  "firearms",
  "larceny",
  "melee",
  "stealth",
  "survival",
  // sociais
  "animal_ken",
  "etiquette",
  "insight",
  "intimidation",
  "leadership",
  "performance",
  "persuasion",
  "streetwise",
  "subterfuge",
  // mentais
  "academics",
  "awareness",
  "finance",
  "investigation",
  "medicine",
  "occult",
  "politics",
  "science",
  "technology",
] as const;
export type SkillId = (typeof SKILL_IDS)[number];

export const SKILL_PRESETS = ["generalist", "balanced", "specialist"] as const;
export type SkillPreset = (typeof SKILL_PRESETS)[number];

export const DISCIPLINE_IDS = [
  "animalism",
  "auspex",
  "blood_sorcery",
  "celerity",
  "dominate",
  "fortitude",
  "obfuscate",
  "oblivion",
  "potence",
  "presence",
  "protean",
  "thin_blood_alchemy",
] as const;
export type DisciplineId = (typeof DISCIPLINE_IDS)[number];

export type CharacterLineage = "clan" | "caitiff" | "thin_blood";
export type DisciplineSource = "clan" | "out_of_clan" | "caitiff";
export type AdvantageSource = "base_budget" | "predator_type" | "xp";

export interface AttributeDots {
  attributeId: AttributeId;
  value: number;
}

export interface SkillDots {
  skillId: SkillId;
  value: number;
}

export interface DisciplinePick {
  disciplineId: DisciplineId;
  value: number;
  source: DisciplineSource;
}

export interface AdvantagePick {
  dots: number;
  source: AdvantageSource;
}

export type CharacterVisibility = "private" | "unlisted" | "public";
export type CharacterStatus = "draft" | "submitted" | "changes_requested" | "approved" | "published" | "archived";

export interface ValidationIssue {
  step: number;
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}
