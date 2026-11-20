"use client";

import { useMemo, useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { Button } from "@/components/ui/button";
import { DotsInput } from "@/components/vermillion/dots-input";
import { fieldInputClassName } from "@/components/vermillion/form-field";
import { LoreTooltip } from "@/components/vermillion/lore-tooltip";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveAdvantagesStepAction } from "@/lib/wizard-actions";
import { validateAdvantages, MERIT_BUDGET, FLAW_BUDGET } from "@/domain/v5";
import { ADVANTAGES_BUDGET_COPY, SOURCE_DOCUMENT } from "@/lib/v5-copy";

export interface AdvantageCatalogItem {
  id: string;
  kind: "merit" | "flaw" | "background";
  name: string;
  dots_min: number;
  dots_max: number;
  summary: string | null;
  lineage_restriction: string | null;
  source_document?: string | null;
  source_page?: string | null;
}

export interface AdvantagePickDraft {
  refId: string | null;
  customLabel: string;
  dots: number;
}

/**
 * Vantagens/Defeitos que o corebook permite escolher mais de uma vez,
 * cada ocorrência representando um detalhe narrativo diferente (ex.:
 * Maldição Folclórica contra prata e, à parte, contra água benta) —
 * docs/V5_RULES_MATRIX.md §10 / seed de reference_advantages. Todo outro
 * item do catálogo só pode ser escolhido uma vez por ficha.
 */
const REPEATABLE_ADVANTAGE_NAMES = new Set(["Maldição Folclórica", "Bloqueio Folclórico"]);

function dotsLabel(item: AdvantageCatalogItem) {
  if (item.dots_min === item.dots_max) return `${item.dots_min} ponto${item.dots_min === 1 ? "" : "s"}`;
  return `${item.dots_min}–${item.dots_max} pontos`;
}

export function WizardStepAdvantages({
  characterId,
  initialVersion,
  catalog,
  lineage,
  initialMerits,
  initialFlaws,
}: {
  characterId: string;
  initialVersion: number;
  catalog: AdvantageCatalogItem[];
  lineage: string;
  initialMerits: AdvantagePickDraft[];
  initialFlaws: AdvantagePickDraft[];
}) {
  const [version, setVersion] = useState(initialVersion);
  const [merits, setMerits] = useState<AdvantagePickDraft[]>(initialMerits);
  const [flaws, setFlaws] = useState<AdvantagePickDraft[]>(initialFlaws);
  const [showCustomMerit, setShowCustomMerit] = useState(false);
  const [showCustomFlaw, setShowCustomFlaw] = useState(false);

  const meritPicks = useMemo(() => merits.map((m) => ({ dots: m.dots, source: "base_budget" as const })), [merits]);
  const flawPicks = useMemo(() => flaws.map((f) => ({ dots: f.dots, source: "base_budget" as const })), [flaws]);
  const issues = useMemo(() => validateAdvantages(meritPicks, flawPicks), [meritPicks, flawPicks]);

  const meritSpend = merits.reduce((sum, m) => sum + m.dots, 0);
  const flawSpend = flaws.reduce((sum, f) => sum + f.dots, 0);

  const availableCatalog = catalog.filter((c) => !c.lineage_restriction || c.lineage_restriction === lineage);
  const meritCatalog = availableCatalog.filter((c) => c.kind === "merit" || c.kind === "background");
  const flawCatalog = availableCatalog.filter((c) => c.kind === "flaw");

  function catalogItemFor(catalogOptions: AdvantageCatalogItem[], refId: string | null) {
    return catalogOptions.find((c) => c.id === refId);
  }

  function addCatalogItem(setItems: typeof setMerits, catalogItem: AdvantageCatalogItem) {
    setItems((prev) => [...prev, { refId: catalogItem.id, customLabel: "", dots: catalogItem.dots_min }]);
  }

  function addCustomItem(setItems: typeof setMerits) {
    setItems((prev) => [...prev, { refId: null, customLabel: "", dots: 1 }]);
  }

  function renderSelected(
    items: AdvantagePickDraft[],
    setItems: typeof setMerits,
    catalogOptions: AdvantageCatalogItem[],
  ) {
    return (
      <div className="space-y-2">
        {items.map((item, index) => {
          const catalogItem = catalogItemFor(catalogOptions, item.refId);
          const isRepeatable = catalogItem ? REPEATABLE_ADVANTAGE_NAMES.has(catalogItem.name) : false;
          return (
            <VelvetCard key={index} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  {catalogItem ? (
                    <p className="font-badge text-xs uppercase tracking-[0.08em] text-foreground">{catalogItem.name}</p>
                  ) : (
                    <input
                      value={item.customLabel}
                      onChange={(e) =>
                        setItems((prev) => prev.map((it, i) => (i === index ? { ...it, customLabel: e.target.value } : it)))
                      }
                      placeholder="Nome da Vantagem/Defeito personalizado"
                      className={`${fieldInputClassName} py-1.5 text-sm`}
                    />
                  )}
                  {catalogItem?.summary ? (
                    <p className="mt-1 text-xs text-ink-muted">{catalogItem.summary}</p>
                  ) : null}
                  {catalogItem?.source_page ? (
                    <p className="mt-1 text-[0.7rem] text-ink-muted/70">
                      Fonte: {catalogItem.source_document ?? SOURCE_DOCUMENT}, p. {catalogItem.source_page}
                    </p>
                  ) : null}
                  {!catalogItem ? (
                    <p className="mt-1 text-[0.7rem] text-accent-crimson-bright/80">
                      Item personalizado — fica sujeito à revisão do narrador (não está no catálogo verificado).
                    </p>
                  ) : null}
                  {isRepeatable ? (
                    <input
                      value={item.customLabel}
                      onChange={(e) =>
                        setItems((prev) => prev.map((it, i) => (i === index ? { ...it, customLabel: e.target.value } : it)))
                      }
                      placeholder="Detalhe narrativo (ex.: luz ultravioleta)"
                      className={`${fieldInputClassName} mt-2 py-1.5 text-xs`}
                    />
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                  className="shrink-0 text-ink-muted hover:text-accent-crimson-bright"
                  aria-label="Remover"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-2">
                {catalogItem && catalogItem.dots_min === catalogItem.dots_max ? (
                  <span className="font-badge text-[0.65rem] uppercase tracking-[0.08em] text-ornament-gold">
                    {dotsLabel(catalogItem)}
                  </span>
                ) : (
                  <DotsInput
                    label="Pontos"
                    value={item.dots}
                    min={catalogItem?.dots_min ?? 1}
                    max={catalogItem?.dots_max ?? 5}
                    onChange={(value) =>
                      setItems((prev) =>
                        prev.map((it, i) =>
                          i === index ? { ...it, dots: Math.max(catalogItem?.dots_min ?? 1, value) } : it,
                        ),
                      )
                    }
                  />
                )}
              </div>
            </VelvetCard>
          );
        })}
      </div>
    );
  }

  function renderAvailable(
    items: AdvantagePickDraft[],
    setItems: typeof setMerits,
    catalogOptions: AdvantageCatalogItem[],
    showCustom: boolean,
    setShowCustom: (v: boolean) => void,
  ) {
    const selectedIds = new Set(items.map((i) => i.refId).filter((id): id is string => id !== null));
    const toOffer = catalogOptions.filter((c) => REPEATABLE_ADVANTAGE_NAMES.has(c.name) || !selectedIds.has(c.id));

    return (
      <div className="mt-3">
        <p className="font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">Catálogo disponível</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {toOffer.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => addCatalogItem(setItems, c)}
              className="flex flex-col gap-1 rounded-sm border border-border p-3 text-left transition-colors hover:border-ornament-gold/60"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm text-foreground">{c.name}</span>
                <span className="shrink-0 font-badge text-[0.6rem] uppercase tracking-[0.08em] text-ornament-gold">
                  {dotsLabel(c)}
                </span>
              </span>
              {c.summary ? <span className="text-xs text-ink-muted">{c.summary}</span> : null}
            </button>
          ))}
          {toOffer.length === 0 ? (
            <p className="text-xs text-ink-muted sm:col-span-2">
              Todas as opções disponíveis já foram escolhidas.
            </p>
          ) : null}
        </div>

        <div className="mt-3">
          {showCustom ? (
            <Button type="button" variant="outline" size="sm" onClick={() => addCustomItem(setItems)}>
              <Plus className="size-3.5" /> Adicionar personalizado
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustom(true)}
              className="text-xs text-ink-muted underline-offset-2 hover:text-foreground hover:underline"
            >
              Não achou na lista? Adicionar algo fora do catálogo.
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={6}
      canContinue={issues.length === 0}
      form={
        <div>
          <h1 className="font-display text-2xl text-foreground">Vantagens, Defeitos e Antecedentes</h1>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-muted">
            Orçamento: {MERIT_BUDGET} pontos de Vantagens, {FLAW_BUDGET} de Defeitos.
            <LoreTooltip
              summary={ADVANTAGES_BUDGET_COPY.summary}
              sourceDocument={SOURCE_DOCUMENT}
              sourcePage={ADVANTAGES_BUDGET_COPY.sourcePage}
            />
          </p>

          <div className="mt-6">
            <h2 className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">
              Vantagens ({meritSpend}/{MERIT_BUDGET})
            </h2>
            <div className="mt-2">{renderSelected(merits, setMerits, meritCatalog)}</div>
            {renderAvailable(merits, setMerits, meritCatalog, showCustomMerit, setShowCustomMerit)}
          </div>

          <div className="mt-6">
            <h2 className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">
              Defeitos ({flawSpend}/{FLAW_BUDGET})
            </h2>
            <div className="mt-2">{renderSelected(flaws, setFlaws, flawCatalog)}</div>
            {renderAvailable(flaws, setFlaws, flawCatalog, showCustomFlaw, setShowCustomFlaw)}
          </div>

          {issues.length > 0 ? <p className="mt-4 text-xs text-accent-crimson-bright">{issues[0].message}</p> : null}
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Vantagens/Defeitos</p>
          <ul className="mt-2 space-y-1 text-sm">
            {merits.map((m, i) => {
              const c = catalogItemFor(meritCatalog, m.refId);
              return (
                <li key={`m-${i}`} className="flex items-center justify-between gap-2">
                  <span className="truncate text-ink-muted">
                    <Check className="mr-1 inline size-3 text-ornament-gold" aria-hidden="true" />
                    {c?.name ?? (m.customLabel || "Personalizado")}
                  </span>
                  <span className="shrink-0 text-foreground">{m.dots}</span>
                </li>
              );
            })}
            {flaws.map((f, i) => {
              const c = catalogItemFor(flawCatalog, f.refId);
              return (
                <li key={`f-${i}`} className="flex items-center justify-between gap-2">
                  <span className="truncate text-ink-muted">
                    <Check className="mr-1 inline size-3 text-accent-crimson-bright" aria-hidden="true" />
                    {c?.name ?? (f.customLabel || "Personalizado")}
                  </span>
                  <span className="shrink-0 text-foreground">{f.dots}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-ink-muted">
            {meritSpend}/{MERIT_BUDGET} vantagens · {flawSpend}/{FLAW_BUDGET} defeitos
          </p>
        </VelvetCard>
      }
      onSave={async () => {
        const result = await saveAdvantagesStepAction(
          characterId,
          version,
          merits.map((m) => {
            const catalogItem = catalogItemFor(meritCatalog, m.refId);
            return {
              kind: catalogItem?.kind === "background" ? ("background" as const) : ("merit" as const),
              refId: m.refId,
              customLabel: m.refId ? null : m.customLabel,
              dots: m.dots,
              source: "base_budget" as const,
            };
          }),
          flaws.map((f) => ({
            refId: f.refId,
            customLabel: f.refId ? null : f.customLabel,
            dots: f.dots,
            source: "base_budget" as const,
          })),
        );
        if (result.version) setVersion(result.version);
        return result;
      }}
    />
  );
}
