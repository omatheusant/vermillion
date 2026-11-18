"use client";

import { useMemo, useState } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { DotsInput } from "@/components/vermillion/dots-input";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveAttributesStepAction } from "@/lib/wizard-actions";
import { ATTRIBUTE_IDS, ATTRIBUTE_CATEGORY, validateAttributes, type AttributeId } from "@/domain/v5";
import { ATTRIBUTE_LABELS } from "@/lib/v5-labels";

const CATEGORY_LABELS = { physical: "Físicos", social: "Sociais", mental: "Mentais" } as const;

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

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={3}
      canContinue={issues.length === 0}
      form={
        <div>
          <h1 className="font-display text-2xl text-foreground">Atributos</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Distribua exatamente: 1 atributo com 4 pontos, 3 com 3, 4 com 2 e 1 com 1.
          </p>

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
            Saúde: <span className="text-foreground">{values.stamina + 3}</span> · Força de Vontade:{" "}
            <span className="text-foreground">{values.composure + values.resolve}</span>
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
