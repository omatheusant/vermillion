import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { GothicShell } from "@/components/vermillion/gothic-shell";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { LINEAGE_LABELS } from "@/lib/v5-labels";
import { getPublicProfile } from "@/lib/public-gallery";

const NAV_ITEMS = [
  { label: "Os Condenados", href: "/personagens" },
  { label: "O Códice", href: "/codice" },
];

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const result = await getPublicProfile(username);
  if (!result) return { title: "Perfil não encontrado" };
  return { title: `@${result.profile.username}` };
}

/**
 * Perfil público — só apelido, avatar, bio e personagens já
 * publicados. Nunca email, IDs internos ou qualquer dado privado
 * (master doc §"Perfil `/u/[username]`").
 */
export default async function PerfilPublicoPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await getPublicProfile(username);
  if (!result) notFound();

  const { profile, characters } = result;

  return (
    <GothicShell navItems={NAV_ITEMS}>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">Perfil</p>
        <h1 className="mt-2 font-display text-4xl text-foreground">{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm text-ink-muted">@{profile.username}</p>
        {profile.bio ? <p className="mt-4 max-w-xl text-sm text-ink-muted">{profile.bio}</p> : null}

        <LoreDivider className="my-8" />

        <h2 className="font-display text-xl text-foreground">Personagens publicados</h2>
        {characters.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">Nenhum personagem público ainda.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {characters.map((character) => (
              <Link key={character.id} href={`/personagens/${character.slug}`} className="block">
                <VelvetCard className="hover-lift-glow h-full">
                  <h3 className="font-display text-lg text-foreground">{character.name}</h3>
                  <p className="mt-0.5 font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">
                    {character.lineage === "clan" ? character.clanName : LINEAGE_LABELS[character.lineage]}
                  </p>
                  {character.concept ? <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{character.concept}</p> : null}
                </VelvetCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </GothicShell>
  );
}
