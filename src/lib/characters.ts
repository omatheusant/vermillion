import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CharacterLineage, CharacterStatus, CharacterSummary } from "@/types/character";

export const DEFAULT_CHRONICLE_SLUG = "vermillion";

/** Lança se não autenticado — só chamar em rotas já protegidas pelo middleware. */
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Usuário não autenticado.");
  }
  return { supabase, user: data.user };
}

export async function getDefaultChronicleId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from("chronicles")
    .select("id")
    .eq("slug", DEFAULT_CHRONICLE_SLUG)
    .single();

  if (error || !data) {
    throw new Error("Crônica padrão não encontrada.");
  }

  return data.id;
}

/**
 * creation_step / 9 como aproximação provisória de progresso — a
 * fórmula real de completude (campos obrigatórios por etapa) é regra de
 * domínio e chega em src/domain/v5 na Fase D.
 */
function estimateCompletion(creationStep: number, status: CharacterStatus): number {
  if (status === "approved" || status === "published") return 100;
  return Math.min(100, Math.round((creationStep / 9) * 100));
}

export async function listMyCharacters(): Promise<CharacterSummary[]> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("characters")
    .select(
      "id, name, lineage, status, creation_step, clan:reference_clans(name), details:character_details(concept, apparent_age)",
    )
    .eq("owner_id", user.id)
    .neq("status", "archived")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar personagens: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    clanName: row.clan?.name ?? null,
    lineage: row.lineage as CharacterLineage,
    apparentAge: row.details?.apparent_age ?? null,
    concept: row.details?.concept ?? "",
    status: row.status as CharacterStatus,
    completion: estimateCompletion(row.creation_step, row.status as CharacterStatus),
  }));
}

export async function createCharacterDraft(name: string) {
  const { supabase } = await requireUser();
  const chronicleId = await getDefaultChronicleId(supabase);

  const { data, error } = await supabase.rpc("create_character_draft", {
    p_chronicle_id: chronicleId,
    p_name: name,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
