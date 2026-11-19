"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/characters";
import { detectImageType, generateRandomFileName, MAX_AVATAR_BYTES, MAX_PORTRAIT_BYTES } from "@/lib/media";
import { mapRpcError } from "@/lib/rpc-error";
import type { StepActionState } from "@/lib/wizard-actions";

export interface UploadAvatarState {
  error?: string;
  success?: boolean;
}

export async function uploadAvatarAction(
  _prevState: UploadAvatarState,
  formData: FormData,
): Promise<UploadAvatarState> {
  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecione uma imagem." };
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return { error: "Imagem muito grande (máximo 5MB)." };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const detected = detectImageType(buffer);

  if (!detected) {
    return { error: "Formato de imagem não suportado. Use JPEG, PNG ou WEBP." };
  }

  const { supabase, user } = await requireUser();
  const storagePath = `${user.id}/${generateRandomFileName(detected.extension)}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, buffer, { contentType: detected.mime, upsert: false });

  if (uploadError) {
    return { error: "Falha ao enviar a imagem. Tente novamente." };
  }

  const { data: asset, error: insertError } = await supabase
    .from("media_assets")
    .insert({ owner_id: user.id, storage_path: storagePath, mime_type: detected.mime, kind: "avatar" })
    .select("id")
    .single();

  if (insertError || !asset) {
    await supabase.storage.from("media").remove([storagePath]);
    return { error: "Falha ao registrar a imagem. Tente novamente." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_media_id: asset.id })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Imagem enviada, mas não foi possível atualizar seu perfil." };
  }

  revalidatePath("/app");
  return { success: true };
}

/**
 * Upload de retrato de personagem — o recorte 3:4 (src/lib/image-crop.ts)
 * já aconteceu no client antes de chegar aqui; mesmo assim valida o MIME
 * real do arquivo recebido (nunca confia no client, docs/LEGAL.md §4).
 * ADR 0007: media_assets + character_details são escritos juntos pela RPC
 * save_character_portrait, nunca em duas chamadas sequenciais daqui.
 */
export async function uploadCharacterPortraitAction(
  characterId: string,
  expectedVersion: number,
  formData: FormData,
): Promise<StepActionState> {
  const file = formData.get("portrait");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecione uma imagem." };
  }

  if (file.size > MAX_PORTRAIT_BYTES) {
    return { error: "Imagem muito grande (máximo 8MB)." };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const detected = detectImageType(buffer);

  if (!detected) {
    return { error: "Formato de imagem não suportado. Use JPEG, PNG ou WEBP." };
  }

  const { supabase, user } = await requireUser();
  const storagePath = `${user.id}/${generateRandomFileName(detected.extension)}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, buffer, { contentType: detected.mime, upsert: false });

  if (uploadError) {
    return { error: "Falha ao enviar a imagem. Tente novamente." };
  }

  const { data, error } = await supabase.rpc("save_character_portrait", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_storage_path: storagePath,
    p_mime_type: detected.mime,
  });

  if (error) {
    await supabase.storage.from("media").remove([storagePath]);
    return { error: mapRpcError(error) };
  }

  revalidatePath(`/app/personagens/${characterId}`);
  revalidatePath(`/app/personagens/${characterId}/editar/8`);
  revalidatePath("/app/personagens");
  return { version: data?.version };
}
