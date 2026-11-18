import { describe, it, expect } from "vitest";
import { validateConvictions } from "./validate-humanity";

describe("validateConvictions", () => {
  it("aceita 1 Convicção com 1 Pilar vinculado", () => {
    const issues = validateConvictions(
      [{ id: "c1", label: "Nunca machucar inocentes" }],
      [{ convictionId: "c1", name: "Mãe" }],
    );
    expect(issues).toEqual([]);
  });

  it("aceita até 3 Convicções, cada uma com seu Pilar", () => {
    const convictions = [
      { id: "c1", label: "A" },
      { id: "c2", label: "B" },
      { id: "c3", label: "C" },
    ];
    const touchstones = convictions.map((c) => ({ convictionId: c.id, name: `Pilar de ${c.label}` }));
    expect(validateConvictions(convictions, touchstones)).toEqual([]);
  });

  it("rejeita zero Convicções", () => {
    const issues = validateConvictions([], []);
    expect(issues.some((i) => i.message.includes("1 a 3"))).toBe(true);
  });

  it("rejeita mais de 3 Convicções", () => {
    const convictions = [1, 2, 3, 4].map((n) => ({ id: `c${n}`, label: `Convicção ${n}` }));
    const touchstones = convictions.map((c) => ({ convictionId: c.id, name: "Pilar" }));
    const issues = validateConvictions(convictions, touchstones);
    expect(issues.some((i) => i.message.includes("1 a 3"))).toBe(true);
  });

  it("rejeita Convicção sem Pilar vinculado", () => {
    const issues = validateConvictions([{ id: "c1", label: "Convicção sem pilar" }], []);
    expect(issues.some((i) => i.field === "touchstones")).toBe(true);
  });
});
