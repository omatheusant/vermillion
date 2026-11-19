import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { GothicShell } from "@/components/vermillion/gothic-shell";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { LINEAGE_LABELS, DISCIPLINE_LABELS } from "@/lib/v5-labels";
import { getPublicCharacterBySlug } from "@/lib/public-gallery";

const NAV_ITEMS = [
  { label: "Os Condenados", href: "/personagens" },
  { label: "O Códice", href: "/codice" },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicCharacterBySlug(slug);
  if (!result) return { title: "Personagem não encontrado" };

  const { character } = result;
  return {
    title: character.name,
    description: character.concept ?? "Um personagem da crônica Vermillion.",
    openGraph: {
      title: `${character.name} — Vermillion`,
      description: character.concept ?? "Um personagem da crônica Vermillion.",
    },
  };
}

export default async function PersonagemPublicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublicCharacterBySlug(slug);
  if (!result) notFound();

  const { character, clan, owner, portraitUrl } = result;
  const lineageLabel = character.lineage === "clan" ? (clan?.name ?? character.clan_id) : LINEAGE_LABELS[character.lineage];

  return (
    <GothicShell navItems={NAV_ITEMS}>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <VelvetCard ornate className="p-8">
          {portraitUrl ? (
            <div
              aria-hidden="true"
              className="float-right ml-6 aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-sm border border-border/60 sm:w-40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada e efêmera, não compensa next/image */}
              <img src={portraitUrl} alt="" className="size-full object-cover" />
            </div>
          ) : null}
          <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">{lineageLabel}</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{character.name}</h1>
          {owner?.username ? (
            <Link href={`/u/${owner.username}`} className="mt-1 inline-block text-sm text-ink-muted hover:text-foreground">
              por @{owner.username}
            </Link>
          ) : null}

          <LoreDivider className="my-8" />

          <div className="space-y-4">
            <Field label="Conceito" value={character.concept} />
            <Field label="Nome social" value={character.social_name} />
            <Field label="Idade aparente" value={character.apparent_age?.toString()} />
            <Field label="Nacionalidade" value={character.nationality} />
            <Field label="Ocupação mortal" value={character.occupation} />
            <Field label="Ambição" value={character.ambition} />
            <Field label="Desejo" value={character.desire} />
            <Field label="Aparência" value={character.appearance} />
            <Field label="Personalidade" value={character.personality} />
          </div>

          {clan ? (
            <div className="mt-8 border-t border-border/50 pt-6">
              <h2 className="font-display text-lg text-foreground">{clan.name}</h2>
              {clan.disciplines ? (
                <p className="mt-1 text-xs text-ink-muted">
                  {(clan.disciplines as string[]).map((d) => DISCIPLINE_LABELS[d] ?? d).join(" · ")}
                </p>
              ) : null}
              {clan.bane_summary ? <p className="mt-2 text-sm text-ink-muted">{clan.bane_summary}</p> : null}
            </div>
          ) : null}
        </VelvetCard>
      </div>
    </GothicShell>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      <p className="mt-1 text-foreground">{value}</p>
    </div>
  );
}
