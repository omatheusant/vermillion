import type { AttributeDots } from "./types";

/** Saúde = Vigor (stamina) + 3 — docs/V5_RULES_MATRIX.md §4. */
export function calculateHealth(attributes: AttributeDots[]): number {
  const stamina = attributes.find((a) => a.attributeId === "stamina")?.value ?? 0;
  return stamina + 3;
}

/** Força de Vontade = Compostura (composure) + Determinação (resolve). */
export function calculateWillpower(attributes: AttributeDots[]): number {
  const composure = attributes.find((a) => a.attributeId === "composure")?.value ?? 0;
  const resolve = attributes.find((a) => a.attributeId === "resolve")?.value ?? 0;
  return composure + resolve;
}
