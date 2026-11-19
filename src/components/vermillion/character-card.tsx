import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/vermillion/status-badge";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import type { CharacterSummary } from "@/types/character";
import { resumeStep } from "@/lib/wizard-steps";

const LINEAGE_LABEL: Record<CharacterSummary["lineage"], string> = {
  clan: "",
  caitiff: "Caitiff",
  thin_blood: "Sangue-Ralo",
};

export function CharacterCard({ character }: { character: CharacterSummary }) {
  const lineageLabel =
    character.lineage === "clan" ? character.clanName : LINEAGE_LABEL[character.lineage];

  const isEditable = character.status === "draft" || character.status === "changes_requested";
  const href = isEditable
    ? `/app/personagens/${character.id}/editar/${resumeStep(character.creationStep)}`
    : `/app/personagens/${character.id}`;

  return (
    <Link href={href} className="block">
      <VelvetCard
        className="hover-lift-glow h-full"
        cornerLabel={<StatusBadge status={character.status} />}
      >
        <div className="flex flex-col gap-4">
          <div
            aria-hidden="true"
            className="flex h-28 items-center justify-center overflow-hidden rounded-sm border border-border/60 bg-gradient-to-b from-surface-wine to-background font-display text-3xl text-ink-muted"
          >
            {character.portraitUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- URL assinada e efêmera, não compensa next/image
              <img src={character.portraitUrl} alt="" className="size-full object-cover" />
            ) : (
              character.name.charAt(0)
            )}
          </div>

          <div>
            <h3 className="font-display text-xl leading-tight text-foreground">
              {character.name}
            </h3>
            <p className="mt-0.5 font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">
              {lineageLabel}
              {character.apparentAge ? ` · ${character.apparentAge} anos aparentes` : ""}
            </p>
          </div>

          <p className="line-clamp-2 text-sm text-ink-muted">{character.concept}</p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Progresso da ficha</span>
              <span>{character.completion}%</span>
            </div>
            <Progress
              value={character.completion}
              aria-label={`Progresso da ficha: ${character.completion}%`}
              className="h-1.5"
            />
          </div>
        </div>
      </VelvetCard>
    </Link>
  );
}
