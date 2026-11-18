import Link from "next/link";
import { GothicShell } from "@/components/vermillion/gothic-shell";
import { SignOutButton } from "@/components/vermillion/auth/sign-out-button";
import { CharacterSheet } from "@/components/vermillion/character-sheet";
import { ReviewActionsPanel } from "@/components/vermillion/review-actions-panel";
import { GrantPowerForm } from "@/components/vermillion/grant-power-form";
import { requireCouncilStaff, getCharacterForReview, getReviewHistory } from "@/lib/council";
import {
  getCharacterDetails,
  getCharacterAttributes,
  getCharacterSkills,
  getCharacterDisciplines,
  getCharacterAdvantages,
  getCharacterHumanity,
} from "@/lib/wizard";

const NAV_ITEMS = [
  { label: "O Conselho", href: "/app/conselho" },
  { label: "Dashboard", href: "/app" },
];

export default async function ConselhoReviewPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const { supabase } = await requireCouncilStaff();

  const { character, ownerUsername, clanName } = await getCharacterForReview(supabase, characterId);
  const [details, attributes, { skills, specializations }, disciplines, { merits, flaws }, { convictions, touchstones, tracks }, reviewEvents] =
    await Promise.all([
      getCharacterDetails(supabase, characterId),
      getCharacterAttributes(supabase, characterId),
      getCharacterSkills(supabase, characterId),
      getCharacterDisciplines(supabase, characterId),
      getCharacterAdvantages(supabase, characterId),
      getCharacterHumanity(supabase, characterId),
      getReviewHistory(supabase, characterId),
    ]);

  return (
    <GothicShell navItems={NAV_ITEMS} actions={<SignOutButton />}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/app/conselho" className="text-xs text-ink-muted hover:text-foreground">
          ← Voltar para a fila
        </Link>
        <p className="mt-2 text-xs text-ink-muted">Enviado por {ownerUsername}</p>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <CharacterSheet
            data={{
              character,
              clanName,
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
            }}
          />

          <div className="space-y-6">
            <ReviewActionsPanel characterId={character.id} status={character.status} history={reviewEvents} />
            <GrantPowerForm characterId={character.id} disabled={!["submitted", "changes_requested"].includes(character.status)} />
          </div>
        </div>
      </div>
    </GothicShell>
  );
}
