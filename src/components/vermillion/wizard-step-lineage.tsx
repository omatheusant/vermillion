"use client";

import { useState } from "react";
import { ClanSelector, type ClanOption, type LineageChoice } from "@/components/vermillion/clan-selector";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveLineageStepAction, type Sect } from "@/lib/wizard-actions";

const SECTS: { value: Sect; label: string }[] = [
  { value: "camarilla", label: "Camarilla" },
  { value: "anarch", label: "Anarquistas" },
  { value: "sabbat", label: "Sabá" },
  { value: "ashirra", label: "Ashirra" },
  { value: "independent", label: "Independente" },
];

export function WizardStepLineage({
  characterId,
  initialVersion,
  clans,
  hasSavedDisciplines,
  initial,
}: {
  characterId: string;
  initialVersion: number;
  clans: ClanOption[];
  hasSavedDisciplines: boolean;
  initial: {
    lineage: LineageChoice | null;
    sireName: string;
    embraceDate: string;
    sect: Sect | null;
  };
}) {
  const [version, setVersion] = useState(initialVersion);
  const [lineage, setLineage] = useState<LineageChoice | null>(initial.lineage);
  const [sireName, setSireName] = useState(initial.sireName);
  const [embraceDate, setEmbraceDate] = useState(initial.embraceDate);
  const [sect, setSect] = useState<Sect | null>(initial.sect);
  const [confirmingChange, setConfirmingChange] = useState<LineageChoice | null>(null);

  const selectedClan = lineage?.lineage === "clan" ? clans.find((c) => c.id === lineage.clanId) : undefined;

  function handleLineageChange(choice: LineageChoice) {
    const isDifferentLineage =
      lineage?.lineage !== choice.lineage || (choice.lineage === "clan" && lineage.lineage === "clan" && lineage.clanId !== choice.clanId);

    if (isDifferentLineage && hasSavedDisciplines) {
      setConfirmingChange(choice);
      return;
    }
    setLineage(choice);
  }

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={2}
      form={
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-2xl text-foreground">Linhagem e sociedade</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Quem te abraçou — e a que sangue você pertence agora.
            </p>
          </div>

          {confirmingChange ? (
            <VelvetCard className="border-accent-crimson-bright/50">
              <p className="text-sm text-foreground">
                Trocar de linhagem/clã vai apagar as Disciplinas já escolhidas na Etapa 5 (sua história e textos
                livres continuam intactos). Confirmar a troca?
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  className="rounded-sm bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                  onClick={() => {
                    setLineage(confirmingChange);
                    setConfirmingChange(null);
                  }}
                >
                  Confirmar troca
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-border px-3 py-1.5 text-xs text-ink-muted"
                  onClick={() => setConfirmingChange(null)}
                >
                  Cancelar
                </button>
              </div>
            </VelvetCard>
          ) : null}

          <ClanSelector clans={clans} value={lineage} onChange={handleLineageChange} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Seita (opcional)" htmlFor="sect">
              <select
                id="sect"
                value={sect ?? ""}
                onChange={(e) => setSect((e.target.value || null) as Sect | null)}
                className={fieldInputClassName}
              >
                <option value="">Sem filiação</option>
                {SECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Data do Abraço" htmlFor="embraceDate">
              <input
                id="embraceDate"
                type="date"
                value={embraceDate}
                onChange={(e) => setEmbraceDate(e.target.value)}
                className={fieldInputClassName}
              />
            </FormField>
          </div>

          <FormField label="Senhor(a) (privado)" htmlFor="sire">
            <input
              id="sire"
              value={sireName}
              onChange={(e) => setSireName(e.target.value)}
              className={fieldInputClassName}
              placeholder="Nome do vampiro que te abraçou"
            />
          </FormField>
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Linhagem</p>
          <h2 className="mt-2 font-display text-xl text-foreground">
            {lineage?.lineage === "clan"
              ? (selectedClan?.name ?? "—")
              : lineage?.lineage === "caitiff"
                ? "Caitiff"
                : lineage?.lineage === "thin_blood"
                  ? "Sangue-Ralo"
                  : "Ainda não escolhida"}
          </h2>
          {sect ? <p className="mt-1 text-sm text-ink-muted">{SECTS.find((s) => s.value === sect)?.label}</p> : null}
        </VelvetCard>
      }
      canContinue={lineage !== null}
      onSave={async () => {
        const result = await saveLineageStepAction(characterId, version, {
          lineage: lineage?.lineage ?? "clan",
          clanId: lineage?.lineage === "clan" ? lineage.clanId : null,
          sireName,
          embraceDate: embraceDate || null,
          sect,
        });
        if (result.version) setVersion(result.version);
        return result;
      }}
    />
  );
}
