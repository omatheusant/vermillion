import "server-only";
import type { createClient } from "@/lib/supabase/server";

/**
 * URL assinada (60s) do retrato de um personagem, ou null se não houver.
 * Funciona tanto para o dono/staff quanto para visitantes anônimos de
 * personagens published+public — a policy de Storage
 * (media_storage_select_portrait, migration 20261119100002) é quem decide
 * se este client tem permissão para ler o arquivo; aqui só montamos a URL.
 */
export async function getCharacterPortraitSignedUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  characterId: string,
): Promise<string | null> {
  const { data: details } = await supabase
    .from("character_details")
    .select("portrait_media_id")
    .eq("character_id", characterId)
    .maybeSingle();

  if (!details?.portrait_media_id) return null;

  const { data: asset } = await supabase
    .from("media_assets")
    .select("storage_path")
    .eq("id", details.portrait_media_id)
    .maybeSingle();

  if (!asset?.storage_path) return null;

  const { data: signed } = await supabase.storage.from("media").createSignedUrl(asset.storage_path, 60);
  return signed?.signedUrl ?? null;
}

/**
 * Mesma URL assinada, mas em lote para uma lista de personagens (roster,
 * galeria pública) — evita N+1 óbvio quando há mais de um id.
 */
export async function getCharacterPortraitSignedUrls(
  supabase: Awaited<ReturnType<typeof createClient>>,
  characterIds: string[],
): Promise<Map<string, string>> {
  if (characterIds.length === 0) return new Map();

  const { data: detailsRows } = await supabase
    .from("character_details")
    .select("character_id, portrait_media_id")
    .in("character_id", characterIds)
    .not("portrait_media_id", "is", null);

  const mediaIds = (detailsRows ?? [])
    .map((row) => row.portrait_media_id)
    .filter((id): id is string => !!id);

  if (mediaIds.length === 0) return new Map();

  const { data: assets } = await supabase.from("media_assets").select("id, storage_path").in("id", mediaIds);

  const storagePathByMediaId = new Map((assets ?? []).map((a) => [a.id, a.storage_path]));

  const result = new Map<string, string>();
  await Promise.all(
    (detailsRows ?? []).map(async (row) => {
      if (!row.portrait_media_id) return;
      const storagePath = storagePathByMediaId.get(row.portrait_media_id);
      if (!storagePath) return;
      const { data: signed } = await supabase.storage.from("media").createSignedUrl(storagePath, 60);
      if (signed?.signedUrl) result.set(row.character_id, signed.signedUrl);
    }),
  );
  return result;
}
