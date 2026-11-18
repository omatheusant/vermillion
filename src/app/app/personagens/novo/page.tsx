import { GothicShell } from "@/components/vermillion/gothic-shell";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { SignOutButton } from "@/components/vermillion/auth/sign-out-button";
import { listMyCharacters } from "@/lib/characters";
import { startEmbraceAction } from "./actions";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/app" },
  { label: "Meu Grimório", href: "/app/personagens" },
];

export default async function NovoPersonagemPage() {
  const characters = await listMyCharacters();
  const remainingSlots = 3 - characters.length;
  const canStart = remainingSlots > 0;

  return (
    <GothicShell navItems={NAV_ITEMS} actions={<SignOutButton />}>
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">
          Etapa 0 · Introdução
        </p>
        <h1 className="mt-3 font-display text-4xl text-foreground">
          Você acaba de ser abraçado.
        </h1>
        <p className="mt-4 text-pretty text-ink-muted">
          Antes de qualquer coisa — você não escolhe seu clã, seu senhor ou
          a noite em que tudo mudou por acaso. O Abraço é um roteiro guiado:
          cada etapa explica o que está sendo decidido e por quê, com uma
          prévia viva do seu dossiê sempre visível ao lado.
        </p>

        <LoreDivider className="my-10" />

        <VelvetCard className="text-left">
          <h2 className="font-display text-xl text-foreground">
            Regras desta crônica
          </h2>
          <dl className="mt-4 space-y-2 text-sm text-ink-muted">
            <div className="flex justify-between">
              <dt>Slots disponíveis</dt>
              <dd className="text-foreground">{remainingSlots} de 3</dd>
            </div>
            <div className="flex justify-between">
              <dt>Geração / Potência de Sangue</dt>
              <dd className="text-foreground">Definidas pelo narrador</dd>
            </div>
            <div className="flex justify-between">
              <dt>Tipo de Predador</dt>
              <dd className="text-foreground">Opcional nesta etapa</dd>
            </div>
          </dl>
        </VelvetCard>

        <div className="mt-10">
          {canStart ? (
            <form action={startEmbraceAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 font-badge text-xs uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/80"
              >
                Começar meu Abraço
              </button>
            </form>
          ) : (
            <p className="text-sm text-accent-crimson-bright">
              Seus 3 slots já estão ocupados. Arquive um personagem para
              começar um novo.
            </p>
          )}
        </div>
      </div>
    </GothicShell>
  );
}
