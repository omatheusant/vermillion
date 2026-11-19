import { GothicShell } from "@/components/vermillion/gothic-shell";
import { SignOutButton } from "@/components/vermillion/auth/sign-out-button";
import { WizardStepIdentity } from "@/components/vermillion/wizard-step-identity";
import { WizardStepLineage } from "@/components/vermillion/wizard-step-lineage";
import { WizardStepAttributes } from "@/components/vermillion/wizard-step-attributes";
import { WizardStepSkills } from "@/components/vermillion/wizard-step-skills";
import { WizardStepDisciplines } from "@/components/vermillion/wizard-step-disciplines";
import { WizardStepAdvantages } from "@/components/vermillion/wizard-step-advantages";
import { WizardStepHumanity } from "@/components/vermillion/wizard-step-humanity";
import { WizardStepStory } from "@/components/vermillion/wizard-step-story";
import { WizardStepReview } from "@/components/vermillion/wizard-step-review";
import {
  getOwnedCharacterOrNotFound,
  getCharacterDetails,
  getClanCatalog,
  getCharacterDisciplines,
  getCharacterAttributes,
  getCharacterSkills,
  getPowersForDisciplines,
  getAdvantageCatalog,
  getCharacterAdvantages,
  getCharacterHumanity,
  getSubmissionIssues,
} from "@/lib/wizard";
import type { LineageChoice } from "@/components/vermillion/clan-selector";
import type { Sect } from "@/lib/wizard-actions";
import { ATTRIBUTE_IDS, SKILL_IDS, DISCIPLINE_IDS, type AttributeId, type SkillId, type DisciplineId } from "@/domain/v5";
import { getCharacterPortraitSignedUrl } from "@/lib/portrait";

const NAV_ITEMS = [{ label: "Meu Grimório", href: "/app/personagens" }];

export default async function EditarPersonagemPage({
  params,
}: {
  params: Promise<{ id: string; etapa: string }>;
}) {
  const { id, etapa } = await params;
  const step = Number(etapa);

  const { supabase, character } = await getOwnedCharacterOrNotFound(id);
  const details = await getCharacterDetails(supabase, id);

  let stepContent;

  if (step === 1) {
    stepContent = (
      <WizardStepIdentity
        characterId={id}
        initialVersion={character.version}
        initial={{
          name: character.name ?? "",
          socialName: details?.social_name ?? "",
          apparentAge: details?.apparent_age?.toString() ?? "",
          nationality: details?.nationality ?? "",
          occupation: details?.occupation ?? "",
          concept: details?.concept ?? "",
          ambition: details?.ambition ?? "",
          desire: details?.desire ?? "",
        }}
      />
    );
  } else if (step === 2) {
    const clans = await getClanCatalog(supabase);
    const disciplines = await getCharacterDisciplines(supabase, id);

    const lineage: LineageChoice | null =
      character.lineage === "clan" && character.clan_id
        ? { lineage: "clan", clanId: character.clan_id }
        : character.lineage === "caitiff"
          ? { lineage: "caitiff" }
          : character.lineage === "thin_blood"
            ? { lineage: "thin_blood" }
            : null;

    stepContent = (
      <WizardStepLineage
        characterId={id}
        initialVersion={character.version}
        clans={clans}
        hasSavedDisciplines={disciplines.length > 0}
        initial={{
          lineage,
          sireName: details?.sire_name ?? "",
          embraceDate: details?.embrace_date ?? "",
          sect: (character.sect as Sect | null) ?? null,
        }}
      />
    );
  } else if (step === 3) {
    const attributeRows = await getCharacterAttributes(supabase, id);
    const initial = Object.fromEntries(
      ATTRIBUTE_IDS.map((attributeId) => [
        attributeId,
        attributeRows.find((a) => a.attribute_id === attributeId)?.value ?? 1,
      ]),
    ) as Record<AttributeId, number>;

    stepContent = <WizardStepAttributes characterId={id} initialVersion={character.version} initial={initial} />;
  } else if (step === 4) {
    const { skills, specializations } = await getCharacterSkills(supabase, id);
    const initial = Object.fromEntries(
      SKILL_IDS.map((skillId) => [skillId, skills.find((s) => s.skill_id === skillId)?.value ?? 0]),
    ) as Record<SkillId, number>;

    stepContent = (
      <WizardStepSkills
        characterId={id}
        initialVersion={character.version}
        initialPreset={(character.skill_preset as "generalist" | "balanced" | "specialist") ?? "generalist"}
        initial={initial}
        initialSpecializations={specializations.map((s) => ({
          skillId: s.skill_id as SkillId,
          label: s.label,
          isFree: s.is_free,
        }))}
      />
    );
  } else if (step === 5) {
    const disciplineRows = await getCharacterDisciplines(supabase, id);
    const powers = await getPowersForDisciplines(supabase, [...DISCIPLINE_IDS]);

    let clanDisciplineIds: DisciplineId[] = [];
    if (character.lineage === "clan" && character.clan_id) {
      const { data: clan } = await supabase
        .from("reference_clans")
        .select("disciplines")
        .eq("id", character.clan_id)
        .maybeSingle();
      clanDisciplineIds = (clan?.disciplines ?? []) as DisciplineId[];
    }

    const thinBloodRow = disciplineRows.find((d) => d.discipline_id === "thin_blood_alchemy");
    const initialPicks = disciplineRows
      .filter((d) => d.discipline_id !== "thin_blood_alchemy")
      .map((d) => ({ disciplineId: d.discipline_id as DisciplineId, value: d.value }));

    stepContent = (
      <WizardStepDisciplines
        characterId={id}
        initialVersion={character.version}
        lineage={character.lineage}
        clanDisciplineIds={clanDisciplineIds}
        powers={powers.map((p) => ({ ...p, verification_status: p.verification_status }))}
        initialPicks={initialPicks}
        initialAlchemy={{ level: thinBloodRow?.value ?? 0, note: thinBloodRow?.notes ?? "" }}
      />
    );
  } else if (step === 6) {
    const catalog = await getAdvantageCatalog(supabase);
    const { merits, flaws } = await getCharacterAdvantages(supabase, id);

    stepContent = (
      <WizardStepAdvantages
        characterId={id}
        initialVersion={character.version}
        catalog={catalog}
        lineage={character.lineage}
        initialMerits={merits.map((m) => ({ refId: m.ref_id, customLabel: m.custom_label ?? "", dots: m.dots }))}
        initialFlaws={flaws.map((f) => ({ refId: f.ref_id, customLabel: f.custom_label ?? "", dots: f.dots }))}
      />
    );
  } else if (step === 7) {
    const { convictions, touchstones } = await getCharacterHumanity(supabase, id);

    stepContent = (
      <WizardStepHumanity
        characterId={id}
        initialVersion={character.version}
        initialConvictions={convictions.map((c) => ({ clientId: c.id, label: c.label }))}
        initialTouchstones={touchstones.map((t) => ({
          convictionClientId: t.conviction_id ?? "",
          name: t.name,
          bond: t.bond ?? "",
          meaning: t.meaning ?? "",
          status: t.status ?? "",
          isPrivate: t.is_private,
        }))}
      />
    );
  } else if (step === 8) {
    const portraitUrl = await getCharacterPortraitSignedUrl(supabase, id);
    stepContent = (
      <WizardStepStory
        characterId={id}
        initialVersion={character.version}
        initialPortraitUrl={portraitUrl}
        initial={{
          appearance: details?.appearance ?? "",
          personality: details?.personality ?? "",
          humanHistory: details?.human_history ?? "",
          embraceAccount: details?.embrace_account ?? "",
          afterEmbrace: details?.after_embrace ?? "",
          havenNotes: details?.haven_notes ?? "",
          relationships: details?.relationships ?? "",
          possessions: details?.possessions ?? "",
          privateNotes: details?.private_notes ?? "",
        }}
      />
    );
  } else if (step === 9) {
    const result = await getSubmissionIssues(supabase, id);
    stepContent = <WizardStepReview characterId={id} characterName={character.name} initialIssues={result.issues} />;
  } else {
    stepContent = (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">Etapa inválida</p>
        <h1 className="mt-3 font-display text-3xl text-foreground">Esta etapa não existe.</h1>
      </div>
    );
  }

  return (
    <GothicShell navItems={NAV_ITEMS} actions={<SignOutButton />}>
      {stepContent}
    </GothicShell>
  );
}
