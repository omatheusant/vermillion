import Link from "next/link";
import { Plus } from "lucide-react";
import { CharacterCard } from "@/components/vermillion/character-card";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import type { CharacterSummary } from "@/types/character";

const MAX_SLOTS = 3;

/**
 * Grade de até 3 personagens ativos + slot(s) vazio(s). O teto de 3 é
 * reforçado atomicamente no banco (ADR 0002) — este componente só
 * reflete o estado, nunca decide o limite.
 */
export function CharacterRoster({ characters }: { characters: CharacterSummary[] }) {
  const emptySlots = Math.max(0, MAX_SLOTS - characters.length);

  if (characters.length === 0) {
    return (
      <VelvetCard className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="font-display text-2xl text-foreground">
          Nenhum personagem ainda.
        </p>
        <p className="max-w-sm text-sm text-ink-muted">
          Toda eternidade começa com um nome. Comece o Abraço do seu primeiro
          personagem e dê os primeiros passos na crônica.
        </p>
        <Link
          href="/app/personagens/novo"
          className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 font-badge text-xs uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary/80"
        >
          <Plus className="size-4" aria-hidden="true" />
          Começar meu Abraço
        </Link>
      </VelvetCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
      {Array.from({ length: emptySlots }).map((_, index) => (
        <Link
          key={`empty-${index}`}
          href="/app/personagens/novo"
          className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border text-ink-muted transition-colors hover:border-ornament-gold/60 hover:text-ornament-gold"
        >
          <Plus className="size-6" aria-hidden="true" />
          <span className="font-badge text-xs uppercase tracking-[0.12em]">
            Novo personagem
          </span>
        </Link>
      ))}
    </div>
  );
}
