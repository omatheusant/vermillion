"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { DISCIPLINE_LABELS } from "@/lib/v5-labels";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface ClanOption {
  id: string;
  name: string;
  bane_summary: string | null;
  strengths_summary?: string | null;
  disciplines: string[];
}

export type LineageChoice = { lineage: "clan"; clanId: string } | { lineage: "caitiff" } | { lineage: "thin_blood" };

interface CarouselCard {
  key: string;
  name: string;
  disciplines: string[];
  summary: string;
  bane: string;
  choice: LineageChoice;
}

/**
 * 13 clãs + Caitiff + Sangue-Ralo num carrossel só — master doc etapa 2
 * ("Incluir 13 clãs e regras de Caitiff/Sangue-Ralo"). Substitui o grid
 * estático: cada linhagem aparece em destaque (1 por vez), com foto-
 * placeholder 3:4 (mesma proporção do retrato do personagem), nome,
 * Disciplinas e um resumo curto — só o que o jogador precisa para decidir,
 * nunca o flavor_text longo (esse fica reservado ao Códice).
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
  const reducedMotion = useReducedMotion();
  const headingId = useId();

  const cards = useMemo<CarouselCard[]>(
    () => [
      ...clans.map((clan) => ({
        key: `clan-${clan.id}`,
        name: clan.name,
        disciplines: clan.disciplines,
        summary: clan.strengths_summary ?? "",
        bane: clan.bane_summary ?? "",
        choice: { lineage: "clan" as const, clanId: clan.id },
      })),
      {
        key: "caitiff",
        name: "Caitiff",
        disciplines: [],
        summary: "Linhagem sem clã fixo — escolhe Disciplinas livremente, sem a tríade de um clã.",
        bane: "Sem fraqueza de clã, mas sofre mais desconfiança e menos Status entre os vampiros estabelecidos.",
        choice: { lineage: "caitiff" as const },
      },
      {
        key: "thin_blood",
        name: "Sangue-Ralo",
        disciplines: [],
        summary: "Sangue diluído, mais próximo da vida — usa Alquimia de Sangue-Ralo em vez de Disciplinas de clã.",
        bane: "Poderes vampíricos instáveis e dependentes de contexto (ADR 0004).",
        choice: { lineage: "thin_blood" as const },
      },
    ],
    [clans],
  );

  const initialIndex = Math.max(
    0,
    cards.findIndex((card) => {
      if (!value) return false;
      if (value.lineage === "clan") return card.choice.lineage === "clan" && card.choice.clanId === value.clanId;
      return card.choice.lineage === value.lineage;
    }),
  );
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const card = cards[index];
  const isSelected =
    value !== null &&
    (card.choice.lineage === "clan" && value.lineage === "clan"
      ? card.choice.clanId === value.clanId
      : card.choice.lineage === value.lineage);

  function goTo(nextIndex: number, dir: number) {
    if (disabled) return;
    setDirection(dir);
    setIndex((nextIndex + cards.length) % cards.length);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") goTo(index + 1, 1);
    if (e.key === "ArrowLeft") goTo(index - 1, -1);
  }

  const transition = { duration: reducedMotion ? 0 : 0.22, ease: "easeOut" as const };

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-none"
    >
      <p id={headingId} className="sr-only">
        Escolha de clã ou linhagem — {index + 1} de {cards.length}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => goTo(index - 1, -1)}
          aria-label="Linhagem anterior"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-ornament-gold hover:text-ornament-gold disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={card.key}
              custom={direction}
              drag={disabled ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) goTo(index + 1, 1);
                else if (info.offset.x > 80) goTo(index - 1, -1);
              }}
              initial={{ opacity: 0, x: direction >= 0 ? 48 : -48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -48 : 48 }}
              transition={transition}
            >
              <button type="button" disabled={disabled} onClick={() => onChange(card.choice)} className="block w-full text-left">
                <VelvetCard
                  ornate={isSelected}
                  className={cn("transition-colors", isSelected ? "border-ornament-gold" : "hover:border-ornament-gold/50")}
                >
                  <div className="flex flex-col gap-4 sm:h-64 sm:flex-row">
                    <div
                      aria-hidden="true"
                      className="aspect-[3/4] w-full shrink-0 overflow-hidden rounded-sm border border-border/60 bg-gradient-to-b from-surface-wine to-background sm:h-full sm:w-36"
                    >
                      <div className="flex size-full items-center justify-center font-display text-3xl text-ink-muted">
                        {card.name.charAt(0)}
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-xl text-foreground">{card.name}</h3>
                        {isSelected ? (
                          <span className="flex shrink-0 items-center gap-1 font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ornament-gold">
                            <Check className="size-3.5" aria-hidden="true" /> Selecionado
                          </span>
                        ) : null}
                      </div>
                      {card.disciplines.length > 0 ? (
                        <p className="mt-1 font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">
                          {card.disciplines.map((d) => DISCIPLINE_LABELS[d] ?? d).join(" · ")}
                        </p>
                      ) : null}
                      {card.summary ? (
                        <p className="mt-3 overflow-y-auto text-sm text-foreground">{card.summary}</p>
                      ) : null}
                      {card.bane ? (
                        <p className="mt-2 overflow-y-auto text-xs text-ink-muted">
                          <span className="text-accent-crimson-bright">Fraqueza: </span>
                          {card.bane}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </VelvetCard>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => goTo(index + 1, 1)}
          aria-label="Próxima linhagem"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-ornament-gold hover:text-ornament-gold disabled:opacity-40"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        {cards.map((c, i) => (
          <button
            key={c.key}
            type="button"
            disabled={disabled}
            onClick={() => goTo(i, i > index ? 1 : -1)}
            aria-label={`Ir para ${c.name}`}
            aria-current={i === index}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              i === index ? "bg-ornament-gold" : "bg-border hover:bg-ornament-gold/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
