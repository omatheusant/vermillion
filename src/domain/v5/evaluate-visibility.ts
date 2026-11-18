import type { CharacterStatus, CharacterVisibility } from "./types";

/**
 * Allowlist de campos públicos de character_details — espelha
 * docs/DATA_MODEL.md §2 e a view public_characters. Única fonte de
 * verdade para "o que pode aparecer fora da ficha", reaproveitada pela
 * prévia de publicação (etapa 9) e pela Ficha Viva/galeria (Fase E).
 */
export const PUBLIC_DETAIL_FIELDS = [
  "social_name",
  "apparent_age",
  "nationality",
  "occupation",
  "concept",
  "ambition",
  "desire",
  "appearance",
  "personality",
] as const;

export const PRIVATE_DETAIL_FIELDS = [
  "real_age",
  "real_name",
  "embrace_date",
  "sire_name",
  "human_history",
  "embrace_account",
  "after_embrace",
  "haven_notes",
  "relationships",
  "possessions",
  "private_notes",
] as const;

export type ViewerRole = "owner" | "staff" | "public";

export interface VisibilityResult {
  canViewCharacter: boolean;
  visibleDetailFields: readonly string[];
}

export function evaluateVisibility(
  viewerRole: ViewerRole,
  character: { visibility: CharacterVisibility; status: CharacterStatus },
): VisibilityResult {
  if (viewerRole === "owner" || viewerRole === "staff") {
    return { canViewCharacter: true, visibleDetailFields: [...PUBLIC_DETAIL_FIELDS, ...PRIVATE_DETAIL_FIELDS] };
  }

  const isPubliclyPublished = character.visibility === "public" && character.status === "published";
  if (!isPubliclyPublished) {
    return { canViewCharacter: false, visibleDetailFields: [] };
  }

  return { canViewCharacter: true, visibleDetailFields: PUBLIC_DETAIL_FIELDS };
}
