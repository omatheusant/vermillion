"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/characters";
import { detectImageType, generateRandomFileName, MAX_AVATAR_BYTES } from "@/lib/media";

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
