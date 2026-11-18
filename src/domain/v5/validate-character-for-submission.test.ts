import { describe, it, expect } from "vitest";
import { validateCharacterForSubmission, type CharacterForSubmission } from "./validate-character-for-submission";
import { SKILL_IDS } from "./types";

function fullAttributes() {
  return [
    { attributeId: "strength" as const, value: 2 },
    { attributeId: "dexterity" as const, value: 3 },
    { attributeId: "stamina" as const, value: 2 },
    { attributeId: "charisma" as const, value: 3 },
    { attributeId: "manipulation" as const, value: 1 },
    { attributeId: "composure" as const, value: 2 },
    { attributeId: "intelligence" as const, value: 4 },
    { attributeId: "wits" as const, value: 2 },
    { attributeId: "resolve" as const, value: 3 },
  ];
}

function generalistSkills() {
  const ids = [...SKILL_IDS];
  return [
    { skillId: ids[0], value: 3 },
    ...ids.slice(1, 9).map((skillId) => ({ skillId, value: 2 })),
    ...ids.slice(9, 19).map((skillId) => ({ skillId, value: 1 })),
  ];
}

function baseCharacter(): CharacterForSubmission {
  return {
    name: "Lucrécia Valmont",
    concept: "Curadora de galeria obcecada pela beleza que não envelhece",
    lineage: "clan",
    clanDisciplineIds: ["celerity", "presence", "auspex"],
    attributes: fullAttributes(),
    skillPreset: "generalist",
    skills: generalistSkills(),
    disciplines: [
      { disciplineId: "celerity", value: 2, source: "clan" },
      { disciplineId: "presence", value: 1, source: "clan" },
    ],
    merits: [{ dots: 4, source: "base_budget" }],
    flaws: [{ dots: 2, source: "base_budget" }],
    convictions: [{ id: "c1", label: "A beleza merece ser preservada" }],
    touchstones: [{ convictionId: "c1", name: "A última galeria do avô" }],
  };
}

describe("validateCharacterForSubmission", () => {
  it("personagem de clã completo e correto não tem pendências", () => {
    const result = validateCharacterForSubmission(baseCharacter());
    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("acusa nome vazio como pendência da etapa 1", () => {
    const result = validateCharacterForSubmission({ ...baseCharacter(), name: "" });
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.step === 1 && i.field === "name")).toBe(true);
  });

  it("fluxo Caitiff: Disciplinas livres, sem tríade de clã", () => {
    const character: CharacterForSubmission = {
      ...baseCharacter(),
      lineage: "caitiff",
      clanDisciplineIds: undefined,
      disciplines: [
        { disciplineId: "oblivion", value: 2, source: "caitiff" },
        { disciplineId: "dominate", value: 1, source: "caitiff" },
      ],
    };
    const result = validateCharacterForSubmission(character);
    expect(result.valid).toBe(true);
  });

  it("fluxo Sangue-Ralo: sem Disciplinas de clã, com nível de Alquimia e nota", () => {
    const character: CharacterForSubmission = {
      ...baseCharacter(),
      lineage: "thin_blood",
      clanDisciplineIds: undefined,
      disciplines: [],
      thinBloodAlchemy: { level: 1, note: "Aprendeu a primeira fórmula com um mentor.", maxLevel: 3 },
    };
    const result = validateCharacterForSubmission(character);
    expect(result.valid).toBe(true);
  });

  it("fluxo Sangue-Ralo sem nota narrativa fica pendente", () => {
    const character: CharacterForSubmission = {
      ...baseCharacter(),
      lineage: "thin_blood",
      clanDisciplineIds: undefined,
      disciplines: [],
      thinBloodAlchemy: { level: 1, note: "", maxLevel: 3 },
    };
    const result = validateCharacterForSubmission(character);
    expect(result.valid).toBe(false);
  });
});
