import { describe, it, expect } from "vitest";
import { calculateHealth, calculateWillpower } from "./derived-tracks";

describe("derived tracks", () => {
  it("Saúde = Vigor + 3", () => {
    expect(calculateHealth([{ attributeId: "stamina", value: 3 }])).toBe(6);
  });

  it("Força de Vontade = Compostura + Determinação", () => {
    const attrs = [
      { attributeId: "composure" as const, value: 2 },
      { attributeId: "resolve" as const, value: 4 },
    ];
    expect(calculateWillpower(attrs)).toBe(6);
  });

  it("trata atributo ausente como zero", () => {
    expect(calculateHealth([])).toBe(3);
    expect(calculateWillpower([])).toBe(0);
  });
});
