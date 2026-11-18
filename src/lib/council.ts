import "server-only";
import { notFound } from "next/navigation";
import { requireUser, DEFAULT_CHRONICLE_SLUG } from "@/lib/characters";

/**
 * Papel de staff só é lido de chronicle_memberships (nunca de
 * user_metadata/client) — docs/DATA_MODEL.md §5.1. Visitante ou jogador
 * comum que tentar acessar /app/conselho cai em notFound(), igual a
 * qualquer outra rota sem autorização — nunca um aviso que confirme a
 * existência da ferramenta para quem não deveria vê-la.
 */
export async function requireCouncilStaff() {
  const { supabase, user } = await requireUser();

  const { data: chronicle } = await supabase
    .from("chronicles")
    .select("id, name, settings")
    .eq("slug", DEFAULT_CHRONICLE_SLUG)
    .maybeSingle();

  if (!chronicle) notFound();

  const { data: membership } = await supabase
    .from("chronicle_memberships")
    .select("role")
    .eq("chronicle_id", chronicle.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership || (membership.role !== "storyteller" && membership.role !== "admin")) {
    notFound();
  }

  return { supabase, user, chronicle };
}

export async function getReviewQueue(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  chronicleId: string,
) {
  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, clan_id, lineage, status, owner_id, created_at")
    .eq("chronicle_id", chronicleId)
    .in("status", ["submitted", "changes_requested"])
    .order("created_at", { ascending: true });

  if (!characters || characters.length === 0) return [];

  const ownerIds = [...new Set(characters.map((c) => c.owner_id))];
  const { data: owners } = await supabase.from("public_profiles").select("id, username").in("id", ownerIds);
  const ownerById = new Map((owners ?? []).map((o) => [o.id, o.username]));

  return characters.map((c) => ({ ...c, ownerUsername: ownerById.get(c.owner_id) ?? "desconhecido" }));
}

export async function getReviewHistory(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const { data } = await supabase
    .from("review_events")
    .select("*")
    .eq("character_id", characterId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCharacterForReview(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const { data: character } = await supabase.from("characters").select("*").eq("id", characterId).maybeSingle();
  if (!character) notFound();

  const [{ data: owner }, { data: clan }] = await Promise.all([
    supabase.from("public_profiles").select("username").eq("id", character.owner_id).maybeSingle(),
    character.clan_id
      ? supabase.from("reference_clans").select("name, disciplines").eq("id", character.clan_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return { character, ownerUsername: owner?.username ?? "desconhecido", clanName: clan?.name ?? null };
}

export async function getNarratorPowers(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const { data } = await supabase
    .from("character_powers")
    .select("*")
    .eq("character_id", characterId)
    .not("granted_by_narrator_id", "is", null);
  return data ?? [];
}
