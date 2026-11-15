import { GothicShell } from "@/components/vermillion/gothic-shell";
import { DemoBanner } from "@/components/vermillion/demo-banner";
import { CharacterRoster } from "@/components/vermillion/character-roster";
import { DEMO_CHARACTERS } from "@/lib/fixtures/demo-characters";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/app" },
  { label: "O Códice", href: "/codice" },
  { label: "Os Condenados", href: "/personagens" },
];

export default function MeuGrimorioPage() {
  return (
    <GothicShell navItems={NAV_ITEMS}>
      <DemoBanner />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-8 flex flex-col gap-2">
          <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
            Meu Grimório
          </p>
          <h1 className="font-display text-3xl text-foreground md:text-4xl">
            Até três nomes, sempre à mão.
          </h1>
          <p className="max-w-xl text-sm text-ink-muted">
            Rascunhos, fichas em avaliação e personagens aprovados — tudo o
            que você ainda não arquivou.
          </p>
        </header>
        <CharacterRoster characters={DEMO_CHARACTERS} />
      </div>
    </GothicShell>
  );
}
