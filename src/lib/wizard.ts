import "server-only";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/characters";
import {
  validateCharacterForSubmission,
  type AttributeDots,
  type SkillDots,
  type SkillPreset,
  type DisciplineId,
  type DisciplinePick,
  type AdvantagePick,
} from "@/domain/v5";

/** Carrega o personagem (e confirma posse) ou dispara 404 temático. */
export async function getOwnedCharacterOrNotFound(characterId: string) {
  const { supabase, user } = await requireUser();
  const { data: character, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", characterId)
    .maybeSingle();

  if (error || !character || character.owner_id !== user.id) {
    notFound();
  }

  return { supabase, user, character };
}

export async function getCharacterDetails(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const { data } = await supabase.from("character_details").select("*").eq("character_id", characterId).maybeSingle();
  return data;
}

export async function getClanCatalog(supabase: Awaited<ReturnType<typeof requireUser>>["supabase"]) {
  const { data } = await supabase
    .from("reference_clans")
    .select("id, name, flavor_text, strengths_summary, bane_summary, disciplines, typical_affiliations")
    .order("name");
  return data ?? [];
}

export async function getDisciplineCatalog(supabase: Awaited<ReturnType<typeof requireUser>>["supabase"]) {
  const { data } = await supabase.from("reference_disciplines").select("id, name, clans").order("name");
  return data ?? [];
}

export async function getPowersForDisciplines(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  disciplineIds: string[],
) {
  if (disciplineIds.length === 0) return [];
  const { data } = await supabase
    .from("reference_powers")
    .select("id, discipline_id, level, name, summary, amalgam, prerequisites, verification_status")
    .in("discipline_id", disciplineIds)
    .order("level");
  return data ?? [];
}

export async function getAdvantageCatalog(supabase: Awaited<ReturnType<typeof requireUser>>["supabase"]) {
  const { data } = await supabase
    .from("reference_advantages")
    .select("id, kind, name, dots_min, dots_max, summary, lineage_restriction")
    .order("name");
  return data ?? [];
}

export async function getCharacterAttributes(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const { data } = await supabase.from("character_attributes").select("*").eq("character_id", characterId);
  return data ?? [];
}

export async function getCharacterSkills(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const [{ data: skills }, { data: specializations }] = await Promise.all([
    supabase.from("character_skills").select("*").eq("character_id", characterId),
    supabase.from("character_specializations").select("*").eq("character_id", characterId),
  ]);
  return { skills: skills ?? [], specializations: specializations ?? [] };
}

export async function getCharacterDisciplines(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const { data } = await supabase.from("character_disciplines").select("*").eq("character_id", characterId);
  return data ?? [];
}

export async function getCharacterAdvantages(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const [{ data: merits }, { data: flaws }] = await Promise.all([
    supabase.from("character_advantages").select("*").eq("character_id", characterId),
    supabase.from("character_flaws").select("*").eq("character_id", characterId),
  ]);
  return { merits: merits ?? [], flaws: flaws ?? [] };
}

export async function getCharacterHumanity(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const [{ data: convictions }, { data: touchstones }, { data: tracks }] = await Promise.all([
    supabase.from("character_convictions").select("*").eq("character_id", characterId).order("position"),
    supabase.from("character_touchstones").select("*").eq("character_id", characterId),
    supabase.from("character_tracks").select("*").eq("character_id", characterId).maybeSingle(),
  ]);
  return { convictions: convictions ?? [], touchstones: touchstones ?? [], tracks };
}

/**
 * Agrega todas as tabelas do personagem e roda validateCharacterForSubmission
 * — usada tanto pela prévia de pendências da Etapa 9 quanto (de novo,
 * defesa em profundidade) pela Server Action que efetivamente submete.
 */
export async function getSubmissionIssues(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  characterId: string,
) {
  const [{ data: character }, { data: details }, { data: attributes }, { data: skills }, { data: disciplines },
    { data: merits }, { data: flaws }, { data: convictions }, { data: touchstones }] = await Promise.all([
    supabase.from("characters").select("*").eq("id", characterId).single(),
    supabase.from("character_details").select("*").eq("character_id", characterId).maybeSingle(),
    supabase.from("character_attributes").select("*").eq("character_id", characterId),
    supabase.from("character_skills").select("*").eq("character_id", characterId),
    supabase.from("character_disciplines").select("*").eq("character_id", characterId),
    supabase.from("character_advantages").select("*").eq("character_id", characterId),
    supabase.from("character_flaws").select("*").eq("character_id", characterId),
    supabase.from("character_convictions").select("*").eq("character_id", characterId),
    supabase.from("character_touchstones").select("*").eq("character_id", characterId),
  ]);

  if (!character) return { valid: false, issues: [{ step: 0, field: "character", message: "Personagem não encontrado." }] };

  let clanDisciplineIds: DisciplineId[] | undefined;
  if (character.lineage === "clan" && character.clan_id) {
    const { data: clan } = await supabase
      .from("reference_clans")
      .select("disciplines")
      .eq("id", character.clan_id)
      .maybeSingle();
    clanDisciplineIds = (clan?.disciplines ?? []) as DisciplineId[];
  }

  const thinBloodRow = (disciplines ?? []).find((d) => d.discipline_id === "thin_blood_alchemy");

  return validateCharacterForSubmission({
    name: character.name ?? "",
    concept: details?.concept ?? "",
    lineage: character.lineage,
    clanDisciplineIds,
    attributes: (attributes ?? []).map((a) => ({ attributeId: a.attribute_id as AttributeDots["attributeId"], value: a.value })),
    skillPreset: (character.skill_preset ?? "generalist") as SkillPreset,
    skills: (skills ?? []).map((s) => ({ skillId: s.skill_id as SkillDots["skillId"], value: s.value })),
    disciplines: (disciplines ?? [])
      .filter((d) => d.discipline_id !== "thin_blood_alchemy")
      .map((d) => ({ disciplineId: d.discipline_id as DisciplineId, value: d.value, source: d.source as DisciplinePick["source"] })),
    thinBloodAlchemy:
      character.lineage === "thin_blood"
        ? { level: thinBloodRow?.value ?? 0, note: thinBloodRow?.notes ?? "", maxLevel: 3 }
        : undefined,
    merits: (merits ?? []).map((m) => ({ dots: m.dots, source: m.source as AdvantagePick["source"] })),
    flaws: (flaws ?? []).map((f) => ({ dots: f.dots, source: f.source as AdvantagePick["source"] })),
    convictions: (convictions ?? []).map((c) => ({ id: c.id, label: c.label })),
    touchstones: (touchstones ?? []).map((t) => ({ convictionId: t.conviction_id, name: t.name })),
  });
}
