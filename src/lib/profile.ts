import "server-only";
import { createClient } from "@/lib/supabase/server";

/** URL assinada (60s) do avatar atual do usuário logado, ou null se não houver. */
export async function getMyAvatarSignedUrl(): Promise<string | null> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_media_id")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!profile?.avatar_media_id) return null;

  const { data: asset } = await supabase
    .from("media_assets")
    .select("storage_path")
    .eq("id", profile.avatar_media_id)
    .maybeSingle();

  if (!asset?.storage_path) return null;

  const { data: signed } = await supabase.storage.from("media").createSignedUrl(asset.storage_path, 60);
  return signed?.signedUrl ?? null;
}
