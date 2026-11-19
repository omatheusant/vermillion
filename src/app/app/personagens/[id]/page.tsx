import { notFound } from "next/navigation";
import Link from "next/link";
import { GothicShell } from "@/components/vermillion/gothic-shell";
import { SignOutButton } from "@/components/vermillion/auth/sign-out-button";
import { CharacterSheet } from "@/components/vermillion/character-sheet";
import { PublishPanel } from "@/components/vermillion/publish-panel";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { requireUser } from "@/lib/characters";
import {
  getCharacterDetails,
  getCharacterAttributes,
  getCharacterSkills,
  getCharacterDisciplines,
  getCharacterAdvantages,
  getCharacterHumanity,
} from "@/lib/wizard";
import { getCharacterPortraitSignedUrl } from "@/lib/portrait";

const NAV_ITEMS = [{ label: "Meu Grimório", href: "/app/personagens" }];

export default async function FichaVivaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  const { data: character } = await supabase.from("characters").select("*").eq("id", id).maybeSingle();
  if (!character) notFound();

  const isOwner = character.owner_id === user.id;

  const [details, attributes, { skills, specializations }, disciplines, { merits, flaws }, { convictions, touchstones, tracks }, xpEntries, clan, portraitUrl] =
    await Promise.all([
      getCharacterDetails(supabase, id),
      getCharacterAttributes(supabase, id),
      getCharacterSkills(supabase, id),
      getCharacterDisciplines(supabase, id),
      getCharacterAdvantages(supabase, id),
      getCharacterHumanity(supabase, id),
      supabase.from("xp_ledger").select("*").eq("character_id", id).order("created_at", { ascending: false }).then((r) => r.data ?? []),
      character.clan_id
        ? supabase.from("reference_clans").select("name").eq("id", character.clan_id).maybeSingle().then((r) => r.data?.name ?? null)
        : Promise.resolve(null),
      getCharacterPortraitSignedUrl(supabase, id),
    ]);

  const sheet = (
    <CharacterSheet
      data={{
        character,
        clanName: clan,
        portraitUrl,
        details,
        attributes,
        skills,
        specializations,
        disciplines,
        merits,
        flaws,
        convictions,
        touchstones,
        tracks,
        xpEntries,
      }}
    />
  );

  return (
    <GothicShell navItems={NAV_ITEMS} actions={<SignOutButton />}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/app/personagens" className="text-xs text-ink-muted hover:text-foreground">
          ← Meu Grimório
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {character.status === "published" ? (
            <VelvetCard ornate className="p-8">
              {sheet}
            </VelvetCard>
          ) : (
            sheet
          )}

          {isOwner ? (
            <div className="space-y-6">
              <PublishPanel
                characterId={character.id}
                status={character.status}
                visibility={character.visibility}
                slug={character.slug}
                publicShareToken={character.public_share_token}
                creationStep={character.creation_step}
              />
            </div>
          ) : null}
        </div>
      </div>
    </GothicShell>
  );
}
