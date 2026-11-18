import Link from "next/link";
import { GothicShell } from "@/components/vermillion/gothic-shell";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { CharacterRoster } from "@/components/vermillion/character-roster";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { SignOutButton } from "@/components/vermillion/auth/sign-out-button";
import { AvatarUploader } from "@/components/vermillion/avatar-uploader";
import { listMyCharacters } from "@/lib/characters";
import { getMyAvatarSignedUrl } from "@/lib/profile";

const NAV_ITEMS = [
  { label: "Meu Grimório", href: "/app/personagens" },
  { label: "O Códice", href: "/codice" },
  { label: "Os Condenados", href: "/personagens" },
];

export default async function DashboardPage() {
  const [characters, avatarUrl] = await Promise.all([listMyCharacters(), getMyAvatarSignedUrl()]);
  const remainingSlots = 3 - characters.length;

  return (
    <GothicShell navItems={NAV_ITEMS} actions={<SignOutButton />}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
              Bem-vindo de volta
            </p>
            <h1 className="font-display text-3xl text-foreground md:text-4xl">
              A noite continua onde você parou.
            </h1>
          </div>
          <AvatarUploader currentUrl={avatarUrl} />
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <VelvetCard>
            <p className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">
              Slots restantes
            </p>
            <p className="mt-2 font-display text-4xl text-foreground">
              {remainingSlots} <span className="text-lg text-ink-muted">/ 3</span>
            </p>
          </VelvetCard>
          <VelvetCard>
            <p className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">
              Em avaliação
            </p>
            <p className="mt-2 font-display text-4xl text-foreground">
              {characters.filter((c) => c.status === "submitted").length}
            </p>
          </VelvetCard>
          <VelvetCard>
            <p className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">
              Novidades da crônica
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Nenhum anúncio novo do Conselho no momento.
            </p>
          </VelvetCard>
        </div>

        <LoreDivider className="my-12" />

        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-foreground">
            Seus personagens
          </h2>
          <Link
            href="/app/personagens"
            className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted hover:text-foreground"
          >
            Ver Meu Grimório →
          </Link>
        </div>
        <div className="mt-6">
          <CharacterRoster characters={characters} />
        </div>
      </div>
    </GothicShell>
  );
}
