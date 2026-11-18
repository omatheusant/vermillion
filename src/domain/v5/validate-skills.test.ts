import { describe, it, expect } from "vitest";
import { validateSkills } from "./validate-skills";
import { SKILL_IDS } from "./types";

function pick(ids: string[], value: number) {
  return ids.map((skillId) => ({ skillId: skillId as (typeof SKILL_IDS)[number], value }));
}

describe("validateSkills", () => {
  it("aceita o preset generalista (1x3, 8x2, 10x1)", () => {
    const ids = [...SKILL_IDS];
    const dots = [
      ...pick(ids.slice(0, 1), 3),
      ...pick(ids.slice(1, 9), 2),
      ...pick(ids.slice(9, 19), 1),
    ];
    const issues = validateSkills("generalist", dots);
    expect(issues).toEqual([]);
  });

  it("aceita o preset equilibrado (3x3, 5x2, 7x1)", () => {
    const ids = [...SKILL_IDS];
    const dots = [
      ...pick(ids.slice(0, 3), 3),
      ...pick(ids.slice(3, 8), 2),
      ...pick(ids.slice(8, 15), 1),
    ];
    const issues = validateSkills("balanced", dots);
    expect(issues).toEqual([]);
  });

  it("aceita o preset especialista (1x4, 3x3, 3x2, 3x1)", () => {
    const ids = [...SKILL_IDS];
    const dots = [
      ...pick(ids.slice(0, 1), 4),
      ...pick(ids.slice(1, 4), 3),
      ...pick(ids.slice(4, 7), 2),
      ...pick(ids.slice(7, 10), 1),
    ];
    const issues = validateSkills("specialist", dots);
    expect(issues).toEqual([]);
  });

  it("rejeita presets somados (generalista com um 4 extra)", () => {
    const ids = [...SKILL_IDS];
    const dots = [
      ...pick(ids.slice(0, 1), 4),
      ...pick(ids.slice(1, 2), 3),
      ...pick(ids.slice(2, 10), 2),
      ...pick(ids.slice(10, 20), 1),
    ];
    const issues = validateSkills("generalist", dots);
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejeita contagem errada no preset equilibrado", () => {
    const ids = [...SKILL_IDS];
    const dots = [...pick(ids.slice(0, 2), 3), ...pick(ids.slice(2, 7), 2), ...pick(ids.slice(7, 14), 1)];
    const issues = validateSkills("balanced", dots);
    expect(issues.some((i) => i.message.includes('exatamente 3 perícia(s) com 3'))).toBe(true);
  });

  it("rejeita perícia desconhecida", () => {
    const issues = validateSkills("generalist", [{ skillId: "nao_existe" as never, value: 2 }]);
    expect(issues.some((i) => i.message.includes("desconhecida"))).toBe(true);
  });
});
