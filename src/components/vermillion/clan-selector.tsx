"use client";

import { cn } from "@/lib/utils";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { DISCIPLINE_LABELS } from "@/lib/v5-labels";

export interface ClanOption {
  id: string;
  name: string;
  bane_summary: string | null;
  disciplines: string[];
}

export type LineageChoice = { lineage: "clan"; clanId: string } | { lineage: "caitiff" } | { lineage: "thin_blood" };

/**
 * 13 clãs + Caitiff + Sangue-Ralo — master doc etapa 2 ("Incluir 13
 * clãs e regras de Caitiff/Sangue-Ralo"). Caitiff/Sangue-Ralo não têm
 * linha em reference_clans (são characters.lineage, não clã — Fase A).
 */
export function ClanSelector({
  clans,
  value,
  onChange,
  disabled,
}: {
  clans: ClanOption[];
  value: LineageChoice | null;
  onChange: (choice: LineageChoice) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {clans.map((clan) => {
        const selected = value?.lineage === "clan" && value.clanId === clan.id;
        return (
          <button
            key={clan.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange({ lineage: "clan", clanId: clan.id })}
            className="text-left"
          >
            <VelvetCard
              className={cn("h-full transition-colors", selected ? "border-ornament-gold" : "hover:border-ornament-gold/50")}
            >
              <h3 className="font-display text-lg text-foreground">{clan.name}</h3>
              <p className="mt-1 font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">
                {clan.disciplines.map((d) => DISCIPLINE_LABELS[d] ?? d).join(" · ")}
              </p>
              {clan.bane_summary ? <p className="mt-2 line-clamp-2 text-xs text-ink-muted">{clan.bane_summary}</p> : null}
            </VelvetCard>
          </button>
        );
      })}

      <button type="button" disabled={disabled} onClick={() => onChange({ lineage: "caitiff" })} className="text-left">
        <VelvetCard
          className={cn(
            "h-full transition-colors",
            value?.lineage === "caitiff" ? "border-ornament-gold" : "hover:border-ornament-gold/50",
          )}
        >
          <h3 className="font-display text-lg text-foreground">Caitiff</h3>
          <p className="mt-1 font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">Sem clã</p>
          <p className="mt-2 text-xs text-ink-muted">
            Linhagem sem clã fixo — escolhe Disciplinas livremente, sem a tríade de um clã.
          </p>
        </VelvetCard>
      </button>

      <button type="button" disabled={disabled} onClick={() => onChange({ lineage: "thin_blood" })} className="text-left">
        <VelvetCard
          className={cn(
            "h-full transition-colors",
            value?.lineage === "thin_blood" ? "border-ornament-gold" : "hover:border-ornament-gold/50",
          )}
        >
          <h3 className="font-display text-lg text-foreground">Sangue-Ralo</h3>
          <p className="mt-1 font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">
            Alquimia de Sangue-Ralo
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            Fluxo especial — usa Alquimia de Sangue-Ralo em vez de Disciplinas de clã (ADR 0004).
          </p>
        </VelvetCard>
      </button>
    </div>
  );
}
