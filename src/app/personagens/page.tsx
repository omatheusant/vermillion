import { GothicShell } from "@/components/vermillion/gothic-shell";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { PublicGalleryGrid } from "@/components/vermillion/public-gallery-grid";
import { getPublicGallery } from "@/lib/public-gallery";

const NAV_ITEMS = [
  { label: "Início", href: "/" },
  { label: "O Códice", href: "/codice" },
];

export const metadata = {
  title: "Os Condenados",
  description: "Galeria pública de personagens publicados da crônica Vermillion.",
};

export default async function GaleriaPage() {
  const characters = await getPublicGallery();

  return (
    <GothicShell navItems={NAV_ITEMS}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-8 text-center">
          <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">Galeria pública</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">Os Condenados</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
            Personagens publicados pelos próprios jogadores, aprovados pelo Conselho — só o que cada um decidiu revelar.
          </p>
        </header>
        <LoreDivider className="mb-10" />
        <PublicGalleryGrid characters={characters} />
      </div>
    </GothicShell>
  );
}
