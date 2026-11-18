import type { DisciplineSource } from "./types";

/**
 * Custo de XP por compra — docs/V5_RULES_MATRIX.md §5 (parâmetro de
 * briefing). Toda compra é lançada em xp_ledger e sujeita a aprovação
 * do narrador — esta função só calcula o custo, nunca debita nada.
 */
export type XpPurchaseKind =
  | "attribute"
  | "skill"
  | "specialization"
  | "discipline"
  | "blood_potency";

export interface XpPurchaseContext {
  newLevel: number;
  disciplineSource?: DisciplineSource;
}

export function calculateXpCost(kind: XpPurchaseKind, context: XpPurchaseContext): number {
  const { newLevel, disciplineSource } = context;

  switch (kind) {
    case "attribute":
      return newLevel * 5;
    case "skill":
      return newLevel * 3;
    case "specialization":
      return 3;
    case "blood_potency":
      return newLevel * 10;
    case "discipline": {
      if (disciplineSource === "caitiff") return newLevel * 6;
      if (disciplineSource === "out_of_clan") return newLevel * 7;
      return newLevel * 5; // 'clan' (padrão)
    }
    default:
      throw new Error(`Tipo de compra de XP desconhecido: ${kind satisfies never}`);
  }
}
