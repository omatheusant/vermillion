import { describe, it, expect } from "vitest";
import { validateAdvantages } from "./validate-advantages";

describe("validateAdvantages", () => {
  it("aceita gasto dentro do orçamento (7 méritos, 2 defeitos)", () => {
    const issues = validateAdvantages(
      [{ dots: 4, source: "base_budget" }, { dots: 3, source: "base_budget" }],
      [{ dots: 2, source: "base_budget" }],
    );
    expect(issues).toEqual([]);
  });

  it("rejeita méritos acima de 7 pontos", () => {
    const issues = validateAdvantages([{ dots: 5, source: "base_budget" }, { dots: 3, source: "base_budget" }], []);
    expect(issues.some((i) => i.field === "merits")).toBe(true);
  });

  it("rejeita defeitos acima de 2 pontos", () => {
    const issues = validateAdvantages([], [{ dots: 3, source: "base_budget" }]);
    expect(issues.some((i) => i.field === "flaws")).toBe(true);
  });

  it("aceita 0 pontos (Mérito/Defeito de Sangue-Ralo, sem custo em pontos)", () => {
    const issues = validateAdvantages([{ dots: 0, source: "base_budget" }], [{ dots: 0, source: "base_budget" }]);
    expect(issues).toEqual([]);
  });

  it("rejeita pontuação negativa", () => {
    const issues = validateAdvantages([{ dots: -1, source: "base_budget" }], []);
    expect(issues.some((i) => i.field === "advantages")).toBe(true);
  });

  it("Vantagens de Tipo de Predador não consomem o orçamento base", () => {
    const issues = validateAdvantages(
      [
        { dots: 4, source: "base_budget" },
        { dots: 3, source: "base_budget" },
        { dots: 3, source: "predator_type" },
      ],
      [],
    );
    expect(issues).toEqual([]);
  });
});
