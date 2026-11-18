"use client";

import { useState } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { LoreTooltip } from "@/components/vermillion/lore-tooltip";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveIdentityStepAction } from "@/lib/wizard-actions";

export interface IdentityInitial {
  name: string;
  socialName: string;
  apparentAge: string;
  nationality: string;
  occupation: string;
  concept: string;
  ambition: string;
  desire: string;
}

export function WizardStepIdentity({
  characterId,
  initialVersion,
  initial,
}: {
  characterId: string;
  initialVersion: number;
  initial: IdentityInitial;
}) {
  const [version, setVersion] = useState(initialVersion);
  const [values, setValues] = useState(initial);

  function set<K extends keyof IdentityInitial>(key: K, value: IdentityInitial[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={1}
      canContinue={values.name.trim().length > 0 && values.concept.trim().length > 0}
      form={
        <div>
          <h1 className="font-display text-2xl text-foreground">Identidade e conceito</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Quem essa pessoa era antes do Abraço — e quem ela decidiu ser depois.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nome completo" htmlFor="fullName">
              <input
                id="fullName"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Nome social / apelido" htmlFor="socialName">
              <input
                id="socialName"
                value={values.socialName}
                onChange={(e) => set("socialName", e.target.value)}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Idade aparente" htmlFor="apparentAge">
              <input
                id="apparentAge"
                type="number"
                value={values.apparentAge}
                onChange={(e) => set("apparentAge", e.target.value)}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Nacionalidade" htmlFor="nationality">
              <input
                id="nationality"
                value={values.nationality}
                onChange={(e) => set("nationality", e.target.value)}
                className={fieldInputClassName}
              />
            </FormField>
            <FormField label="Ocupação mortal" htmlFor="occupation">
              <input
                id="occupation"
                value={values.occupation}
                onChange={(e) => set("occupation", e.target.value)}
                className={fieldInputClassName}
              />
            </FormField>
          </div>

          <div className="mt-4">
            <FormField
              label="Conceito"
              htmlFor="concept"
              help={<LoreTooltip summary="O conceito resume o personagem em uma frase — não precisa citar o clã." />}
            >
              <input
                id="concept"
                value={values.concept}
                onChange={(e) => set("concept", e.target.value)}
                className={fieldInputClassName}
              />
            </FormField>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Ambição" htmlFor="ambition">
              <textarea
                id="ambition"
                value={values.ambition}
                onChange={(e) => set("ambition", e.target.value)}
                rows={3}
                className={`${fieldInputClassName} resize-none`}
              />
            </FormField>
            <FormField label="Desejo" htmlFor="desire">
              <textarea
                id="desire"
                value={values.desire}
                onChange={(e) => set("desire", e.target.value)}
                rows={3}
                className={`${fieldInputClassName} resize-none`}
              />
            </FormField>
          </div>
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Prévia do dossiê</p>
          <h2 className="mt-2 font-display text-2xl text-foreground">{values.name || "Nome ainda não escrito"}</h2>
          {values.socialName ? <p className="text-sm italic text-ink-muted">&ldquo;{values.socialName}&rdquo;</p> : null}
          <p className="mt-3 text-sm text-ink-muted">{values.concept || "O conceito aparecerá aqui conforme você escreve."}</p>
        </VelvetCard>
      }
      onSave={async () => {
        const result = await saveIdentityStepAction(characterId, version, {
          name: values.name,
          socialName: values.socialName,
          apparentAge: values.apparentAge ? Number(values.apparentAge) : null,
          nationality: values.nationality,
          occupation: values.occupation,
          concept: values.concept,
          ambition: values.ambition,
          desire: values.desire,
        });
        if (result.version) setVersion(result.version);
        return result;
      }}
    />
  );
}
