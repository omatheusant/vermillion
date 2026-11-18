"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { DotsInput } from "@/components/vermillion/dots-input";
import { Button } from "@/components/ui/button";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveSkillsStepAction } from "@/lib/wizard-actions";
import { SKILL_IDS, validateSkills, type SkillId, type SkillPreset } from "@/domain/v5";
import { SKILL_LABELS } from "@/lib/v5-labels";

const CATEGORY_SKILLS = {
  physical: SKILL_IDS.slice(0, 9),
  social: SKILL_IDS.slice(9, 18),
  mental: SKILL_IDS.slice(18, 27),
} as const;

const PRESETS: { value: SkillPreset; label: string; description: string }[] = [
  { value: "generalist", label: "Generalista", description: "1×3, 8×2, 10×1" },
  { value: "balanced", label: "Equilibrado", description: "3×3, 5×2, 7×1" },
  { value: "specialist", label: "Especialista", description: "1×4, 3×3, 3×2, 3×1" },
];

export interface SpecializationDraft {
  skillId: SkillId;
  label: string;
  isFree: boolean;
}

export function WizardStepSkills({
  characterId,
  initialVersion,
  initialPreset,
  initial,
  initialSpecializations,
}: {
  characterId: string;
  initialVersion: number;
  initialPreset: SkillPreset;
  initial: Record<SkillId, number>;
  initialSpecializations: SpecializationDraft[];
}) {
  const [version, setVersion] = useState(initialVersion);
  const [preset, setPreset] = useState<SkillPreset>(initialPreset);
  const [values, setValues] = useState<Record<SkillId, number>>(initial);
  const [specializations, setSpecializations] = useState<SpecializationDraft[]>(initialSpecializations);

  const dots = useMemo(() => SKILL_IDS.map((skillId) => ({ skillId, value: values[skillId] })), [values]);
  const issues = useMemo(() => validateSkills(preset, dots), [preset, dots]);

  function changePreset(next: SkillPreset) {
    setPreset(next);
    setValues(Object.fromEntries(SKILL_IDS.map((id) => [id, 0])) as Record<SkillId, number>);
  }

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={4}
      canContinue={issues.length === 0}
      form={
        <div>
          <h1 className="font-display text-2xl text-foreground">Perícias e especializações</h1>
          <p className="mt-1 text-sm text-ink-muted">Escolha um preset — eles não se somam entre si.</p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => changePreset(p.value)}
                className={`rounded-sm border px-3 py-2 text-left transition-colors ${
                  preset === p.value ? "border-ornament-gold bg-surface-wine" : "border-border hover:border-ornament-gold/50"
                }`}
              >
                <span className="block font-badge text-xs uppercase tracking-[0.1em] text-foreground">{p.label}</span>
                <span className="block text-xs text-ink-muted">{p.description}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-6">
            {(["physical", "social", "mental"] as const).map((category) => (
              <div key={category}>
                <h2 className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">
                  {category === "physical" ? "Físicas" : category === "social" ? "Sociais" : "Mentais"}
                </h2>
                <div className="mt-3 space-y-2">
                  {CATEGORY_SKILLS[category].map((skillId) => (
                    <DotsInput
                      key={skillId}
                      label={SKILL_LABELS[skillId]}
                      value={values[skillId]}
                      min={0}
                      max={preset === "specialist" ? 4 : 3}
                      onChange={(value) => setValues((prev) => ({ ...prev, [skillId]: value }))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="font-badge text-xs uppercase tracking-[0.12em] text-ink-muted">Especializações</h2>
            <p className="mt-1 text-xs text-ink-muted">Pelo menos uma especialização é gratuita na criação.</p>
            <div className="mt-3 space-y-2">
              {specializations.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={spec.skillId}
                    onChange={(e) =>
                      setSpecializations((prev) =>
                        prev.map((s, i) => (i === index ? { ...s, skillId: e.target.value as SkillId } : s)),
                      )
                    }
                    className="rounded-sm border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                  >
                    {SKILL_IDS.map((id) => (
                      <option key={id} value={id}>
                        {SKILL_LABELS[id]}
                      </option>
                    ))}
                  </select>
                  <input
                    value={spec.label}
                    onChange={(e) =>
                      setSpecializations((prev) => prev.map((s, i) => (i === index ? { ...s, label: e.target.value } : s)))
                    }
                    placeholder="Ex.: Combate corpo a corpo"
                    className="flex-1 rounded-sm border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setSpecializations((prev) => prev.filter((_, i) => i !== index))}
                    className="text-ink-muted hover:text-accent-crimson-bright"
                    aria-label="Remover especialização"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSpecializations((prev) => [
                    ...prev,
                    { skillId: "academics", label: "", isFree: prev.length === 0 },
                  ])
                }
              >
                <Plus className="size-3.5" /> Adicionar especialização
              </Button>
            </div>
          </div>

          {issues.length > 0 ? <p className="mt-4 text-xs text-accent-crimson-bright">{issues[0].message}</p> : null}
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Perícias</p>
          <ul className="mt-3 space-y-1 text-sm">
            {SKILL_IDS.filter((id) => values[id] > 0).map((id) => (
              <li key={id} className="flex justify-between">
                <span className="text-ink-muted">{SKILL_LABELS[id]}</span>
                <span className="text-foreground">{values[id]}</span>
              </li>
            ))}
          </ul>
        </VelvetCard>
      }
      onSave={async () => {
        const result = await saveSkillsStepAction(
          characterId,
          version,
          preset,
          dots,
          specializations.filter((s) => s.label.trim().length > 0),
        );
        if (result.version) setVersion(result.version);
        return result;
      }}
    />
  );
}
