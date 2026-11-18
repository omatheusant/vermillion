import { describe, it, expect } from "vitest";
import { validateThinBloodAlchemy } from "./validate-thin-blood-alchemy";

describe("validateThinBloodAlchemy (ADR 0004)", () => {
  it("aceita nível 0 sem nota", () => {
    expect(validateThinBloodAlchemy(0, "", 3)).toEqual([]);
  });

  it("aceita nível dentro do orçamento com nota narrativa", () => {
    expect(validateThinBloodAlchemy(2, "Aprendeu com um mentor nas sombras.", 3)).toEqual([]);
  });

  it("rejeita nível acima do orçamento da crônica", () => {
    const issues = validateThinBloodAlchemy(5, "nota", 3);
    expect(issues.some((i) => i.field === "thin_blood_alchemy_level")).toBe(true);
  });

  it("rejeita nível > 0 sem nota narrativa", () => {
    const issues = validateThinBloodAlchemy(1, "", 3);
    expect(issues.some((i) => i.field === "thin_blood_alchemy_note")).toBe(true);
  });

  it("rejeita nível negativo ou não inteiro", () => {
    expect(validateThinBloodAlchemy(-1, "", 3).length).toBeGreaterThan(0);
    expect(validateThinBloodAlchemy(1.5, "nota", 3).length).toBeGreaterThan(0);
  });
});
