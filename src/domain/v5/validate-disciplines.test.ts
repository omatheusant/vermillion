import { describe, it, expect } from "vitest";
import { validateDisciplines } from "./validate-disciplines";

describe("validateDisciplines", () => {
  it("aceita clã comum com 2 Disciplinas do clã (2pt + 1pt)", () => {
    const issues = validateDisciplines(
      "clan",
      [
        { disciplineId: "celerity", value: 2, source: "clan" },
        { disciplineId: "potence", value: 1, source: "clan" },
      ],
      { clanDisciplineIds: ["celerity", "potence", "presence"] },
    );
    expect(issues).toEqual([]);
  });

  it("rejeita Disciplina fora da tríade do clã", () => {
    const issues = validateDisciplines(
      "clan",
      [
        { disciplineId: "dominate", value: 2, source: "clan" },
        { disciplineId: "potence", value: 1, source: "clan" },
      ],
      { clanDisciplineIds: ["celerity", "potence", "presence"] },
    );
    expect(issues.some((i) => i.message.includes("não é uma Disciplina do clã"))).toBe(true);
  });

  it("rejeita distribuição de pontos errada (2+2 em vez de 2+1)", () => {
    const issues = validateDisciplines(
      "clan",
      [
        { disciplineId: "celerity", value: 2, source: "clan" },
        { disciplineId: "potence", value: 2, source: "clan" },
      ],
      { clanDisciplineIds: ["celerity", "potence", "presence"] },
    );
    expect(issues.some((i) => i.message.includes("2 pontos e a outra recebe 1"))).toBe(true);
  });

  it("Caitiff pode escolher qualquer Disciplina (2pt + 1pt)", () => {
    const issues = validateDisciplines("caitiff", [
      { disciplineId: "oblivion", value: 2, source: "caitiff" },
      { disciplineId: "dominate", value: 1, source: "caitiff" },
    ]);
    expect(issues).toEqual([]);
  });

  it("Sangue-Ralo não escolhe Disciplinas de clã na criação", () => {
    const issues = validateDisciplines("thin_blood", [{ disciplineId: "celerity", value: 1, source: "clan" }]);
    expect(issues.some((i) => i.message.includes("Alquimia de Sangue-Ralo"))).toBe(true);
  });

  it("rejeita escolher thin_blood_alchemy como Disciplina de clã", () => {
    const issues = validateDisciplines(
      "clan",
      [
        { disciplineId: "thin_blood_alchemy", value: 2, source: "clan" },
        { disciplineId: "potence", value: 1, source: "clan" },
      ],
      { clanDisciplineIds: ["potence"] },
    );
    expect(issues.some((i) => i.message.includes("não é uma Disciplina de clã"))).toBe(true);
  });
});
