"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/characters";
import type { Json } from "@/lib/supabase/database.types";

export interface CouncilActionState {
  error?: string;
  success?: boolean;
}

function mapError(error: { message: string }): string {
  return error.message || "Não foi possível completar a ação.";
}

export async function approveCharacterAction(characterId: string, comment: string): Promise<CouncilActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("approve_character", {
    p_character_id: characterId,
    p_comment: comment || undefined,
  });
  if (error) return { error: mapError(error) };

  revalidatePath("/app/conselho");
  revalidatePath(`/app/personagens/${characterId}`);
  return { success: true };
}

export async function requestChangesAction(characterId: string, comment: string): Promise<CouncilActionState> {
  if (comment.trim().length === 0) {
    return { error: "Comentário é obrigatório para solicitar ajustes." };
  }

  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("request_character_changes", {
    p_character_id: characterId,
    p_comment: comment,
  });
  if (error) return { error: mapError(error) };

  revalidatePath("/app/conselho");
  revalidatePath(`/app/personagens/${characterId}`);
  return { success: true };
}

export async function grantNarratorPowerAction(
  characterId: string,
  input: { disciplineId: string; customName: string; customLevel: number; customSummary: string; sourceReference: string },
): Promise<CouncilActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("grant_narrator_power", {
    p_character_id: characterId,
    p_discipline_id: input.disciplineId,
    p_custom_name: input.customName,
    p_custom_level: input.customLevel,
    p_custom_summary: input.customSummary,
    p_source_reference: input.sourceReference,
  });
  if (error) return { error: mapError(error) };

  revalidatePath("/app/conselho");
  return { success: true };
}

export async function updateChronicleSettingsAction(
  chronicleId: string,
  settings: Record<string, unknown>,
): Promise<CouncilActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("chronicles")
    .update({ settings: settings as NonNullable<Json> })
    .eq("id", chronicleId);
  if (error) return { error: mapError(error) };

  revalidatePath("/app/conselho");
  return { success: true };
}
