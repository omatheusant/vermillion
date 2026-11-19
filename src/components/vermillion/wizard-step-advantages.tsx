"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { Button } from "@/components/ui/button";
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
}

export interface AdvantagePickDraft {
  refId: string | null;
  customLabel: string;
  dots: number;
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

  const meritPicks = useMemo(() => merits.map((m) => ({ dots: m.dots, source: "base_budget" as const })), [merits]);
  const flawPicks = useMemo(() => flaws.map((f) => ({ dots: f.dots, source: "base_budget" as const })), [flaws]);
  const issues = useMemo(() => validateAdvantages(meritPicks, flawPicks), [meritPicks, flawPicks]);

  const meritSpend = merits.reduce((sum, m) => sum + m.dots, 0);
  const flawSpend = flaws.reduce((sum, f) => sum + f.dots, 0);

  const availableCatalog = catalog.filter((c) => !c.lineage_restriction || c.lineage_restriction === lineage);
  const meritCatalog = availableCatalog.filter((c) => c.kind === "merit" || c.kind === "background");
  const flawCatalog = availableCatalog.filter((c) => c.kind === "flaw");

  function renderList(
    items: AdvantagePickDraft[],
    setItems: typeof setMerits,
    catalogOptions: AdvantageCatalogItem[],
  ) {
    return (
      <div className="space-y-2">
        {items.map((item, index) => {
          const catalogItem = catalogOptions.find((c) => c.id === item.refId);
          return (
            <div key={index} className="flex items-center gap-2">
              <select
                value={item.refId ?? "custom"}
                onChange={(e) => {
                  const refId = e.target.value === "custom" ? null : e.target.value;
                  const found = catalogOptions.find((c) => c.id === refId);
                  setItems((prev) =>
                    prev.map((it, i) => (i === index ? { ...it, refId, dots: found?.dots_min ?? it.dots } : it)),
                  );
                }}
                className="flex-1 rounded-sm border border-border bg-background px-2 py-1.5 text-sm text-foreground"
              >
                <option value="custom">Personalizado...</option>
                {catalogOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {item.refId === null ? (
                <input
                  value={item.customLabel}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, customLabel: e.target.value } : it)))
                  }
                  placeholder="Nome"
                  className="w-32 rounded-sm border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                />
              ) : null}
              <input
                type="number"
                min={catalogItem?.dots_min ?? 1}
                max={catalogItem?.dots_max ?? 5}
                value={item.dots}
                onChange={(e) =>
                  setItems((prev) => prev.map((it, i) => (i === index ? { ...it, dots: Number(e.target.value) } : it)))
                }
                className="w-16 rounded-sm border border-border bg-background px-2 py-1.5 text-sm text-foreground"
              />
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                className="text-ink-muted hover:text-accent-crimson-bright"
                aria-label="Remover"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, { refId: null, customLabel: "", dots: 1 }])}
        >
          <Plus className="size-3.5" /> Adicionar
        </Button>
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
            <div className="mt-2">{renderList(merits, setMerits, meritCatalog)}</div>
          </div>

          <div className="mt-6">
            <h2 className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">
              Defeitos ({flawSpend}/{FLAW_BUDGET})
            </h2>
            <div className="mt-2">{renderList(flaws, setFlaws, flawCatalog)}</div>
          </div>

          {issues.length > 0 ? <p className="mt-4 text-xs text-accent-crimson-bright">{issues[0].message}</p> : null}
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Vantagens/Defeitos</p>
          <p className="mt-2 text-sm text-ink-muted">
            {meritSpend}/{MERIT_BUDGET} vantagens · {flawSpend}/{FLAW_BUDGET} defeitos
          </p>
        </VelvetCard>
      }
      onSave={async () => {
        const result = await saveAdvantagesStepAction(
          characterId,
          version,
          merits.map((m) => ({
            kind: "merit" as const,
            refId: m.refId,
            customLabel: m.refId ? null : m.customLabel,
            dots: m.dots,
            source: "base_budget" as const,
          })),
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
