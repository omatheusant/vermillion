import { describe, it, expect } from "vitest";
import { calculateXpCost } from "./calculate-xp-cost";

describe("calculateXpCost", () => {
  it("atributo custa novo nível x5", () => {
    expect(calculateXpCost("attribute", { newLevel: 4 })).toBe(20);
  });

  it("perícia custa novo nível x3", () => {
    expect(calculateXpCost("skill", { newLevel: 3 })).toBe(9);
  });

  it("especialização custa 3 XP fixo, independente do nível", () => {
    expect(calculateXpCost("specialization", { newLevel: 1 })).toBe(3);
  });

  it("Disciplina do clã custa novo nível x5", () => {
    expect(calculateXpCost("discipline", { newLevel: 3, disciplineSource: "clan" })).toBe(15);
  });

  it("Disciplina fora do clã custa novo nível x7", () => {
    expect(calculateXpCost("discipline", { newLevel: 2, disciplineSource: "out_of_clan" })).toBe(14);
  });

  it("Disciplina de Caitiff custa novo nível x6", () => {
    expect(calculateXpCost("discipline", { newLevel: 2, disciplineSource: "caitiff" })).toBe(12);
  });

  it("Potência de Sangue custa novo nível x10", () => {
    expect(calculateXpCost("blood_potency", { newLevel: 2 })).toBe(20);
  });
});
