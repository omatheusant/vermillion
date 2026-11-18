import "server-only";
import { createClient } from "@/lib/supabase/server";
import { evaluateVisibility, PUBLIC_DETAIL_FIELDS } from "@/domain/v5";

export interface PublicCharacterCard {
  id: string;
  slug: string | null;
  name: string;
  clanId: string | null;
  clanName: string | null;
  lineage: string;
  concept: string | null;
  apparentAge: number | null;
  ownerUsername: string | null;
}

/**
 * Lista de personagens publicados — lê de public_characters (view já
 * restrita a visibility='public' AND status='published' com allowlist
 * de colunas, docs/DATA_MODEL.md §5.4) e reaplica evaluateVisibility
 * explicitamente (defesa em profundidade: mesmo que a view algum dia
 * mude, nenhum campo fora de PUBLIC_DETAIL_FIELDS chega ao caller).
 */
export async function getPublicGallery(): Promise<PublicCharacterCard[]> {
  const supabase = await createClient();

  const { data: characters } = await supabase
    .from("public_characters")
    .select("*")
    .order("created_at", { ascending: false });

  if (!characters || characters.length === 0) return [];

  const [{ data: clans }, { data: owners }] = await Promise.all([
    supabase.from("reference_clans").select("id, name"),
    supabase
      .from("public_profiles")
      .select("id, username")
      .in("id", [...new Set(characters.map((c) => c.owner_id).filter((id): id is string => !!id))]),
  ]);

  const clanNameById = new Map((clans ?? []).map((c) => [c.id, c.name]));
  const usernameById = new Map((owners ?? []).map((o) => [o.id, o.username]));

  return characters.map((character) => {
    const visibility = evaluateVisibility("public", { visibility: character.visibility, status: character.status });
    const safe: Record<string, unknown> = {};
    for (const field of PUBLIC_DETAIL_FIELDS) {
      if (visibility.visibleDetailFields.includes(field)) {
        safe[field] = (character as unknown as Record<string, unknown>)[field];
      }
    }

    return {
      id: character.id,
      slug: character.slug,
      name: character.name,
      clanId: character.clan_id,
      clanName: character.clan_id ? (clanNameById.get(character.clan_id) ?? null) : null,
      lineage: character.lineage,
      concept: (safe.concept as string | null) ?? null,
      apparentAge: (safe.apparent_age as number | null) ?? null,
      ownerUsername: character.owner_id ? (usernameById.get(character.owner_id) ?? null) : null,
    };
  });
}

export async function getPublicProfile(username: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("public_profiles")
    .select("id, username, display_name, bio, avatar_media_id")
    .eq("username", username)
    .maybeSingle();

  if (!profile) return null;

  const { data: characters } = await supabase
    .from("public_characters")
    .select("id, slug, name, clan_id, lineage, concept, apparent_age")
    .eq("owner_id", profile.id);

  const clanIds = [...new Set((characters ?? []).map((c) => c.clan_id).filter((id): id is string => !!id))];
  const { data: clans } = clanIds.length > 0 ? await supabase.from("reference_clans").select("id, name").in("id", clanIds) : { data: [] };
  const clanNameById = new Map((clans ?? []).map((c) => [c.id, c.name]));

  return {
    profile,
    characters: (characters ?? []).map((c) => ({
      ...c,
      clanName: c.clan_id ? (clanNameById.get(c.clan_id) ?? null) : null,
    })),
  };
}

export async function getPublicCharacterBySlug(slug: string) {
  const supabase = await createClient();

  const { data: character } = await supabase.from("public_characters").select("*").eq("slug", slug).maybeSingle();
  if (!character) return null;

  const visibility = evaluateVisibility("public", { visibility: character.visibility, status: character.status });
  if (!visibility.canViewCharacter) return null;

  const [{ data: clan }, { data: owner }] = await Promise.all([
    character.clan_id
      ? supabase.from("reference_clans").select("name, disciplines, bane_summary").eq("id", character.clan_id).maybeSingle()
      : Promise.resolve({ data: null }),
    character.owner_id
      ? supabase.from("public_profiles").select("username, display_name").eq("id", character.owner_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return { character, clan, owner };
}
