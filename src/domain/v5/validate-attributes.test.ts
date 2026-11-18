import { describe, it, expect } from "vitest";
import { validateAttributes } from "./validate-attributes";
import { ATTRIBUTE_IDS } from "./types";

function makeDots(values: number[]) {
  return ATTRIBUTE_IDS.map((attributeId, i) => ({ attributeId, value: values[i] }));
}

describe("validateAttributes", () => {
  it("aceita a distribuição exata 1x4, 3x3, 4x2, 1x1", () => {
    const issues = validateAttributes(makeDots([4, 3, 3, 3, 2, 2, 2, 2, 1]));
    expect(issues).toEqual([]);
  });

  it("aceita a distribuição em qualquer ordem entre os 9 atributos", () => {
    const issues = validateAttributes(makeDots([1, 2, 2, 2, 2, 3, 3, 3, 4]));
    expect(issues).toEqual([]);
  });

  it("rejeita dois atributos com 4 pontos", () => {
    const issues = validateAttributes(makeDots([4, 4, 3, 3, 2, 2, 2, 1, 1]));
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejeita distribuição toda igual (sem variação)", () => {
    const issues = validateAttributes(makeDots([3, 3, 3, 3, 3, 3, 3, 3, 3]));
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejeita atributo faltando", () => {
    const dots = makeDots([4, 3, 3, 3, 2, 2, 2, 2, 1]).slice(0, 8);
    const issues = validateAttributes(dots);
    expect(issues.some((i) => i.message.includes("não foi preenchido"))).toBe(true);
  });

  it("rejeita valor fora de 1..5", () => {
    const issues = validateAttributes(makeDots([6, 3, 3, 3, 2, 2, 2, 2, 1]));
    expect(issues.some((i) => i.message.includes("entre 1 e 5"))).toBe(true);
  });
});
