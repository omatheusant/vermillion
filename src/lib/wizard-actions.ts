"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/characters";
import { getSubmissionIssues } from "@/lib/wizard";
import { mapRpcError } from "@/lib/rpc-error";
import {
  validateAttributes,
  validateSkills,
  validateDisciplines,
  validateThinBloodAlchemy,
  validateAdvantages,
  validateConvictions,
  type AttributeDots,
  type SkillDots,
  type SkillPreset,
  type DisciplinePick,
  type AdvantagePick,
  type CharacterLineage,
  type DisciplineId,
  type ValidationIssue,
} from "@/domain/v5";

export interface StepActionState {
  error?: string;
  version?: number;
}

export async function saveIdentityStepAction(
  characterId: string,
  expectedVersion: number,
  input: {
    name: string;
    socialName: string;
    apparentAge: number | null;
    nationality: string;
    occupation: string;
    concept: string;
    ambition: string;
    desire: string;
  },
): Promise<StepActionState> {
  if (input.name.trim().length === 0) return { error: "Nome completo é obrigatório." };
  if (input.concept.trim().length === 0) return { error: "Conceito é obrigatório." };

  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("save_character_identity", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_name: input.name.trim(),
    p_social_name: input.socialName || undefined,
    p_apparent_age: input.apparentAge ?? undefined,
    p_nationality: input.nationality || undefined,
    p_occupation: input.occupation || undefined,
    p_concept: input.concept.trim(),
    p_ambition: input.ambition || undefined,
    p_desire: input.desire || undefined,
  });

  if (error) return { error: mapRpcError(error) };
  revalidatePath(`/app/personagens/${characterId}`);
  return { version: data?.version };
}

export type Sect = "camarilla" | "anarch" | "sabbat" | "ashirra" | "independent";

export async function saveLineageStepAction(
  characterId: string,
  expectedVersion: number,
  input: {
    lineage: CharacterLineage;
    clanId: string | null;
    sireName: string;
    embraceDate: string | null;
    sect: Sect | null;
  },
): Promise<StepActionState> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("save_character_lineage", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_lineage: input.lineage,
    p_clan_id: input.clanId ?? undefined,
    p_sire_name: input.sireName || undefined,
    p_embrace_date: input.embraceDate ?? undefined,
    p_sect: input.sect ?? undefined,
  });

  if (error) return { error: mapRpcError(error) };
  return { version: data?.version };
}

export async function saveAttributesStepAction(
  characterId: string,
  expectedVersion: number,
  attributes: AttributeDots[],
): Promise<StepActionState> {
  const issues = validateAttributes(attributes);
  if (issues.length > 0) return { error: issues[0].message };

  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("save_character_attributes", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_attributes: attributes.map((a) => ({ attribute_id: a.attributeId, value: a.value })),
  });

  if (error) return { error: mapRpcError(error) };
  return { version: data?.version };
}

export async function saveSkillsStepAction(
  characterId: string,
  expectedVersion: number,
  preset: SkillPreset,
  skills: SkillDots[],
  specializations: { skillId: string; label: string; isFree: boolean }[],
): Promise<StepActionState> {
  const issues = validateSkills(preset, skills);
  if (issues.length > 0) return { error: issues[0].message };

  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("save_character_skills", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_skill_preset: preset,
    p_skills: skills.map((s) => ({ skill_id: s.skillId, value: s.value })),
    p_specializations: specializations.map((s) => ({ skill_id: s.skillId, label: s.label, is_free: s.isFree })),
  });

  if (error) return { error: mapRpcError(error) };
  return { version: data?.version };
}

export async function saveDisciplinesStepAction(
  characterId: string,
  expectedVersion: number,
  lineage: CharacterLineage,
  picks: DisciplinePick[],
  clanDisciplineIds: DisciplineId[] | undefined,
  thinBloodAlchemy: { level: number; note: string; maxLevel: number } | null,
): Promise<StepActionState> {
  if (lineage === "thin_blood") {
    const alchemy = thinBloodAlchemy ?? { level: 0, note: "", maxLevel: 0 };
    const issues = validateThinBloodAlchemy(alchemy.level, alchemy.note, alchemy.maxLevel);
    if (issues.length > 0) return { error: issues[0].message };
  } else {
    const issues = validateDisciplines(lineage, picks, { clanDisciplineIds });
    if (issues.length > 0) return { error: issues[0].message };
  }

  const rows =
    lineage === "thin_blood" && thinBloodAlchemy && thinBloodAlchemy.level > 0
      ? [{ discipline_id: "thin_blood_alchemy", value: thinBloodAlchemy.level, source: "thin_blood", notes: thinBloodAlchemy.note }]
      : picks.map((p) => ({ discipline_id: p.disciplineId, value: p.value, source: p.source, notes: null }));

  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("save_character_disciplines", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_disciplines: rows,
  });

  if (error) return { error: mapRpcError(error) };
  return { version: data?.version };
}

export async function saveAdvantagesStepAction(
  characterId: string,
  expectedVersion: number,
  merits: (AdvantagePick & { kind: "merit" | "background"; refId: string | null; customLabel: string | null })[],
  flaws: (AdvantagePick & { refId: string | null; customLabel: string | null })[],
): Promise<StepActionState> {
  const issues = validateAdvantages(merits, flaws);
  if (issues.length > 0) return { error: issues[0].message };

  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("save_character_advantages", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_merits: merits.map((m) => ({ kind: m.kind, ref_id: m.refId ?? "", custom_label: m.customLabel ?? "", dots: m.dots, source: m.source })),
    p_flaws: flaws.map((f) => ({ ref_id: f.refId ?? "", custom_label: f.customLabel ?? "", dots: f.dots, source: f.source })),
  });

  if (error) return { error: mapRpcError(error) };
  return { version: data?.version };
}

export async function saveHumanityStepAction(
  characterId: string,
  expectedVersion: number,
  convictions: { clientId: string; label: string; position: number }[],
  touchstones: { convictionClientId: string; name: string; bond: string; meaning: string; status: string; isPrivate: boolean }[],
): Promise<StepActionState> {
  const issues = validateConvictions(
    convictions.map((c) => ({ id: c.clientId, label: c.label })),
    touchstones.map((t) => ({ convictionId: t.convictionClientId, name: t.name })),
  );
  if (issues.length > 0) return { error: issues[0].message };

  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("save_character_humanity", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_convictions: convictions.map((c) => ({ client_id: c.clientId, label: c.label, position: c.position })),
    p_touchstones: touchstones.map((t) => ({
      conviction_client_id: t.convictionClientId,
      name: t.name,
      bond: t.bond,
      meaning: t.meaning,
      status: t.status,
      is_private: t.isPrivate,
    })),
  });

  if (error) return { error: mapRpcError(error) };
  return { version: data?.version };
}

export async function saveStoryStepAction(
  characterId: string,
  expectedVersion: number,
  input: {
    appearance: string;
    personality: string;
    humanHistory: string;
    embraceAccount: string;
    afterEmbrace: string;
    havenNotes: string;
    relationships: string;
    possessions: string;
    privateNotes: string;
  },
): Promise<StepActionState> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("save_character_story", {
    p_character_id: characterId,
    p_expected_version: expectedVersion,
    p_appearance: input.appearance || undefined,
    p_personality: input.personality || undefined,
    p_human_history: input.humanHistory || undefined,
    p_embrace_account: input.embraceAccount || undefined,
    p_after_embrace: input.afterEmbrace || undefined,
    p_haven_notes: input.havenNotes || undefined,
    p_relationships: input.relationships || undefined,
    p_possessions: input.possessions || undefined,
    p_private_notes: input.privateNotes || undefined,
  });

  if (error) return { error: mapRpcError(error) };
  return { version: data?.version };
}

export interface SubmitForReviewState {
  issues: ValidationIssue[];
  error?: string;
  submitted?: boolean;
}

/**
 * Revalida tudo no servidor (defesa em profundidade, ADR 0007) antes de
 * chamar submit_character_for_review — o client já mostra a mesma
 * checklist, mas o servidor nunca confia só nisso.
 */
export async function submitForReviewAction(characterId: string): Promise<SubmitForReviewState> {
  const { supabase } = await requireUser();

  const result = await getSubmissionIssues(supabase, characterId);
  if (!result.valid) {
    return { issues: result.issues };
  }

  const { error } = await supabase.rpc("submit_character_for_review", { p_character_id: characterId });
  if (error) return { issues: [], error: error.message };

  revalidatePath(`/app/personagens/${characterId}`);
  revalidatePath("/app/personagens");
  return { issues: [], submitted: true };
}
