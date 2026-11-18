"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/characters";

export interface PublishActionState {
  error?: string;
  success?: boolean;
}

export async function publishCharacterAction(characterId: string): Promise<PublishActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("publish_character", { p_character_id: characterId });
  if (error) return { error: error.message };

  revalidatePath(`/app/personagens/${characterId}`);
  revalidatePath("/app/personagens");
  revalidatePath("/personagens");
  return { success: true };
}

export async function archiveCharacterAction(characterId: string): Promise<PublishActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("archive_character", { p_character_id: characterId });
  if (error) return { error: error.message };

  revalidatePath(`/app/personagens/${characterId}`);
  revalidatePath("/app/personagens");
  revalidatePath("/personagens");
  return { success: true };
}

export async function exportCharacterJsonAction(characterId: string): Promise<{ json?: string; error?: string }> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("export_character_json", { p_character_id: characterId });
  if (error || !data) return { error: error?.message ?? "Não foi possível gerar a exportação." };

  return { json: JSON.stringify(data, null, 2) };
}
