"use client";

import { useState } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveStoryStepAction } from "@/lib/wizard-actions";

export interface StoryInitial {
  appearance: string;
  personality: string;
  humanHistory: string;
  embraceAccount: string;
  afterEmbrace: string;
  havenNotes: string;
  relationships: string;
  possessions: string;
  privateNotes: string;
}

const AREA_CLASS = `${fieldInputClassName} resize-none`;

export function WizardStepStory({
  characterId,
  initialVersion,
  initial,
}: {
  characterId: string;
  initialVersion: number;
  initial: StoryInitial;
}) {
  const [version, setVersion] = useState(initialVersion);
  const [values, setValues] = useState(initial);

  function set<K extends keyof StoryInitial>(key: K, value: StoryInitial[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={8}
      form={
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-2xl text-foreground">História, aparência e informações</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Campos públicos (visíveis se o personagem for publicado) e privados (nunca aparecem fora da sua ficha).
            </p>
          </div>

          <div>
            <h2 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">Públicos</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Aparência" htmlFor="appearance">
                <textarea
                  id="appearance"
                  rows={4}
                  value={values.appearance}
                  onChange={(e) => set("appearance", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
              <FormField label="Personalidade" htmlFor="personality">
                <textarea
                  id="personality"
                  rows={4}
                  value={values.personality}
                  onChange={(e) => set("personality", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
            </div>
          </div>

          <div>
            <h2 className="font-badge text-xs uppercase tracking-[0.1em] text-accent-crimson-bright">
              Privados — nunca aparecem fora da sua ficha
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="História humana" htmlFor="humanHistory">
                <textarea
                  id="humanHistory"
                  rows={4}
                  value={values.humanHistory}
                  onChange={(e) => set("humanHistory", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
              <FormField label="Relato do Abraço" htmlFor="embraceAccount">
                <textarea
                  id="embraceAccount"
                  rows={4}
                  value={values.embraceAccount}
                  onChange={(e) => set("embraceAccount", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
              <FormField label="Vida após o Abraço" htmlFor="afterEmbrace">
                <textarea
                  id="afterEmbrace"
                  rows={4}
                  value={values.afterEmbrace}
                  onChange={(e) => set("afterEmbrace", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
              <FormField label="Refúgio" htmlFor="havenNotes">
                <textarea
                  id="havenNotes"
                  rows={4}
                  value={values.havenNotes}
                  onChange={(e) => set("havenNotes", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
              <FormField label="Relações" htmlFor="relationships">
                <textarea
                  id="relationships"
                  rows={4}
                  value={values.relationships}
                  onChange={(e) => set("relationships", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
              <FormField label="Pertences e inventário" htmlFor="possessions">
                <textarea
                  id="possessions"
                  rows={4}
                  value={values.possessions}
                  onChange={(e) => set("possessions", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Notas privadas / segredos" htmlFor="privateNotes">
                <textarea
                  id="privateNotes"
                  rows={4}
                  value={values.privateNotes}
                  onChange={(e) => set("privateNotes", e.target.value)}
                  className={AREA_CLASS}
                />
              </FormField>
            </div>
          </div>
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Aparência</p>
          <p className="mt-2 text-sm text-ink-muted">{values.appearance || "Ainda não escrita."}</p>
        </VelvetCard>
      }
      onSave={async () => {
        const result = await saveStoryStepAction(characterId, version, values);
        if (result.version) setVersion(result.version);
        return result;
      }}
    />
  );
}
