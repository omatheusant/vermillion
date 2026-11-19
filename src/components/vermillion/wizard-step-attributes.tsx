"use client";

import { useMemo, useState } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { DotsInput } from "@/components/vermillion/dots-input";
import { LoreTooltip } from "@/components/vermillion/lore-tooltip";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveAttributesStepAction } from "@/lib/wizard-actions";
import { ATTRIBUTE_IDS, ATTRIBUTE_CATEGORY, validateAttributes, type AttributeId } from "@/domain/v5";
import { ATTRIBUTE_LABELS } from "@/lib/v5-labels";
import { ATTRIBUTE_COPY, WILLPOWER_COPY, SOURCE_DOCUMENT } from "@/lib/v5-copy";

const CATEGORY_LABELS = { physical: "Físicos", social: "Sociais", mental: "Mentais" } as const;

/** 1 atributo com 4 pontos, 3 com 3, 4 com 2, 1 com 1 — docs/V5_RULES_MATRIX.md §4. */
const REQUIRED_COUNT_BY_VALUE: Record<4 | 3 | 2 | 1, number> = { 4: 1, 3: 3, 2: 4, 1: 1 };

export function WizardStepAttributes({
  characterId,
  initialVersion,
  initial,
}: {
  characterId: string;
  initialVersion: number;
  initial: Record<AttributeId, number>;
}) {
  const [version, setVersion] = useState(initialVersion);
  const [values, setValues] = useState<Record<AttributeId, number>>(initial);

  const dots = useMemo(() => ATTRIBUTE_IDS.map((attributeId) => ({ attributeId, value: values[attributeId] })), [values]);
  const issues = useMemo(() => validateAttributes(dots), [dots]);

  const countByValue = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const id of ATTRIBUTE_IDS) counts[values[id]] = (counts[values[id]] ?? 0) + 1;
    return counts;
  }, [values]);

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={3}
      canContinue={issues.length === 0}
      form={
        <div>
          <h1 className="font-display text-2xl text-foreground">Atributos</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Toda ficha nova começa com 1 ponto em cada um dos 9 Atributos. Distribua mais pontos até formar
            exatamente esta pirâmide, contando os 9 juntos (não por categoria):
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {([4, 3, 2, 1] as const).map((level) => {
              const required = REQUIRED_COUNT_BY_VALUE[level];
              const current = countByValue[level] ?? 0;
              const done = current === required;
              return (
                <span
                  key={level}
                  className={`rounded-sm border px-2 py-1 font-badge text-[0.7rem] uppercase tracking-[0.08em] ${
                    done ? "border-ornament-gold text-ornament-gold" : "border-border text-ink-muted"
                  }`}
                >
                  {level} pontos: {current}/{required}
                </span>
              );
            })}
          </div>

          <div className="mt-6 space-y-6">
            {(["physical", "social", "mental"] as const).map((category) => (
              <div key={category}>
                <h2 className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">
                  {CATEGORY_LABELS[category]}
                </h2>
                <div className="mt-3 space-y-3">
                  {ATTRIBUTE_IDS.filter((id) => ATTRIBUTE_CATEGORY[id] === category).map((attributeId) => (
                    <DotsInput
                      key={attributeId}
                      label={ATTRIBUTE_LABELS[attributeId]}
                      labelAddon={
                        <LoreTooltip
                          summary={ATTRIBUTE_COPY[attributeId].summary}
                          sourceDocument={SOURCE_DOCUMENT}
                          sourcePage={ATTRIBUTE_COPY[attributeId].sourcePage}
                        />
                      }
                      value={values[attributeId]}
                      min={1}
                      max={5}
                      onChange={(value) => setValues((prev) => ({ ...prev, [attributeId]: value }))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {issues.length > 0 ? (
            <p className="mt-4 text-xs text-accent-crimson-bright">{issues[0].message}</p>
          ) : (
            <p className="mt-4 text-xs text-foreground">Distribuição válida.</p>
          )}
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Atributos</p>
          <dl className="mt-3 space-y-1.5 text-sm">
            {ATTRIBUTE_IDS.map((id) => (
              <div key={id} className="flex justify-between">
                <dt className="text-ink-muted">{ATTRIBUTE_LABELS[id]}</dt>
                <dd className="text-foreground">{values[id]}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-ink-muted">
            Saúde: <span className="text-foreground">{values.stamina + 3}</span> ·{" "}
            <span className="inline-flex items-center gap-1">
              Força de Vontade: <span className="text-foreground">{values.composure + values.resolve}</span>
              <LoreTooltip summary={WILLPOWER_COPY.summary} sourceDocument={SOURCE_DOCUMENT} sourcePage={WILLPOWER_COPY.sourcePage} />
            </span>
          </p>
        </VelvetCard>
      }
      onSave={async () => {
        const result = await saveAttributesStepAction(characterId, version, dots);
        if (result.version) setVersion(result.version);
        return result;
      }}
    />
  );
}
