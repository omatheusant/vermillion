/**
 * Tipos de UI compartilhados para personagem. Espelham os enums de
 * docs/DATA_MODEL.md — a fonte de verdade mecânica fica em
 * src/domain/v5 (Fase D); aqui só o necessário para renderizar UI
 * com fixtures tipadas desde a Fase B.
 */

export type CharacterStatus =
  | "draft"
  | "submitted"
  | "changes_requested"
  | "approved"
  | "published"
  | "archived";

export type CharacterLineage = "clan" | "caitiff" | "thin_blood";

export interface CharacterSummary {
  id: string;
  name: string;
  clanName: string | null;
  lineage: CharacterLineage;
  apparentAge: number | null;
  concept: string;
  status: CharacterStatus;
  /** 0–100, só para a UI de progresso do roster. */
  completion: number;
  /** Última etapa (1-9) do wizard já preenchida — usada para retomar edição em vez de sempre reabrir a etapa 1. */
  creationStep: number;
  portraitUrl?: string;
}
