"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { DotsInput } from "@/components/vermillion/dots-input";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveDisciplinesStepAction } from "@/lib/wizard-actions";
import { validateDisciplines, validateThinBloodAlchemy, type CharacterLineage, type DisciplineId } from "@/domain/v5";
import { DISCIPLINE_LABELS } from "@/lib/v5-labels";

export interface PowerOption {
  id: string;
  discipline_id: string;
  level: number;
  name: string;
  summary: string | null;
  verification_status: "verified_from_source" | "requires_reference";
}

export function WizardStepDisciplines({
  characterId,
  initialVersion,
  lineage,
  clanDisciplineIds,
  powers,
  initialPicks,
  initialAlchemy,
}: {
  characterId: string;
  initialVersion: number;
  lineage: CharacterLineage;
  clanDisciplineIds: DisciplineId[];
  powers: PowerOption[];
  initialPicks: { disciplineId: DisciplineId; value: number }[];
  initialAlchemy: { level: number; note: string };
}) {
  const [version, setVersion] = useState(initialVersion);
  const [primaryId, setPrimaryId] = useState<DisciplineId | null>(
    initialPicks.find((p) => p.value === 2)?.disciplineId ?? null,
  );
  const [secondaryId, setSecondaryId] = useState<DisciplineId | null>(
    initialPicks.find((p) => p.value === 1)?.disciplineId ?? null,
  );
  const [alchemyLevel, setAlchemyLevel] = useState(initialAlchemy.level);
  const [alchemyNote, setAlchemyNote] = useState(initialAlchemy.note);

  const availableDisciplines: DisciplineId[] =
    lineage === "clan"
      ? clanDisciplineIds
      : (Object.keys(DISCIPLINE_LABELS).filter((id) => id !== "thin_blood_alchemy") as DisciplineId[]);

  const picks = useMemo(() => {
    const result: { disciplineId: DisciplineId; value: number }[] = [];
    if (primaryId) result.push({ disciplineId: primaryId, value: 2 });
    if (secondaryId) result.push({ disciplineId: secondaryId, value: 1 });
    return result;
  }, [primaryId, secondaryId]);

  const source = lineage === "clan" ? "clan" : lineage === "caitiff" ? "caitiff" : "clan";
  const disciplinePicks = picks.map((p) => ({ ...p, source: source as "clan" | "caitiff" }));

  const issues = useMemo(
    () =>
      lineage === "thin_blood"
        ? validateThinBloodAlchemy(alchemyLevel, alchemyNote, 3)
        : validateDisciplines(lineage, disciplinePicks, { clanDisciplineIds }),
    [lineage, disciplinePicks, alchemyLevel, alchemyNote, clanDisciplineIds],
  );

  function selectPrimary(disciplineId: DisciplineId) {
    if (disciplineId === secondaryId) setSecondaryId(null);
    setPrimaryId((prev) => (prev === disciplineId ? null : disciplineId));
  }

  function selectSecondary(disciplineId: DisciplineId) {
    if (disciplineId === primaryId) return;
    setSecondaryId((prev) => (prev === disciplineId ? null : disciplineId));
  }

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={5}
      canContinue={issues.length === 0}
      form={
        <div>
          <h1 className="font-display text-2xl text-foreground">Disciplinas e poderes</h1>

          {lineage === "thin_blood" ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-ink-muted">
                Sangue-Ralo usa Alquimia de Sangue-Ralo em vez de Disciplinas de clã (ADR 0004) — fórmulas
                específicas chegam depois, concedidas pelo narrador.
              </p>
              <DotsInput label="Nível de Alquimia" value={alchemyLevel} min={0} max={3} onChange={setAlchemyLevel} />
              <FormField label="Nota narrativa" htmlFor="alchemyNote">
                <textarea
                  id="alchemyNote"
                  value={alchemyNote}
                  onChange={(e) => setAlchemyNote(e.target.value)}
                  rows={3}
                  className={`${fieldInputClassName} resize-none`}
                  placeholder="Ex.: aprendeu a primeira fórmula com um mentor nas sombras."
                />
              </FormField>
            </div>
          ) : (
            <>
              <p className="mt-1 text-sm text-ink-muted">
                Escolha duas Disciplinas{lineage === "clan" ? " do seu clã" : ""}: uma Disciplina principal (recebe
                2 pontos) e uma secundária (recebe 1 ponto). Selecione cada uma na lista correspondente — não dá
                para repetir a mesma Disciplina nas duas colunas.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">
                    Disciplina principal (2 pontos)
                  </h3>
                  <div className="mt-2 space-y-1.5">
                    {availableDisciplines.map((disciplineId) => {
                      const isSelected = primaryId === disciplineId;
                      const isBlocked = !isSelected && secondaryId === disciplineId;
                      return (
                        <button
                          key={disciplineId}
                          type="button"
                          disabled={isBlocked}
                          onClick={() => selectPrimary(disciplineId)}
                          aria-pressed={isSelected}
                          className={`flex w-full items-center justify-between rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "border-ornament-gold bg-surface-wine text-foreground"
                              : isBlocked
                                ? "cursor-not-allowed border-border/50 text-ink-muted/50"
                                : "border-border text-foreground hover:border-ornament-gold/50"
                          }`}
                        >
                          {DISCIPLINE_LABELS[disciplineId]}
                          {isSelected ? <Check className="size-3.5 text-ornament-gold" aria-hidden="true" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">
                    Disciplina secundária (1 ponto)
                  </h3>
                  <div className="mt-2 space-y-1.5">
                    {availableDisciplines.map((disciplineId) => {
                      const isSelected = secondaryId === disciplineId;
                      const isBlocked = !isSelected && primaryId === disciplineId;
                      return (
                        <button
                          key={disciplineId}
                          type="button"
                          disabled={isBlocked}
                          onClick={() => selectSecondary(disciplineId)}
                          aria-pressed={isSelected}
                          className={`flex w-full items-center justify-between rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "border-ornament-gold bg-surface-wine text-foreground"
                              : isBlocked
                                ? "cursor-not-allowed border-border/50 text-ink-muted/50"
                                : "border-border text-foreground hover:border-ornament-gold/50"
                          }`}
                        >
                          {DISCIPLINE_LABELS[disciplineId]}
                          {isSelected ? <Check className="size-3.5 text-ornament-gold" aria-hidden="true" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {picks.map((pick) => {
                  const options = powers.filter((p) => p.discipline_id === pick.disciplineId && p.level <= pick.value);
                  if (options.length === 0) return null;
                  return (
                    <div key={pick.disciplineId}>
                      <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">
                        Poderes de {DISCIPLINE_LABELS[pick.disciplineId]}
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {options.map((power) => (
                          <li
                            key={power.id}
                            className={`rounded-sm border p-2 text-sm ${
                              power.verification_status === "verified_from_source"
                                ? "border-border"
                                : "border-border/50 opacity-60"
                            }`}
                          >
                            <p className="text-foreground">
                              Nv.{power.level} — {power.name}
                              {power.verification_status === "requires_reference" ? (
                                <span className="ml-2 font-badge text-[0.6rem] uppercase text-accent-crimson-bright">
                                  requer referência do narrador
                                </span>
                              ) : null}
                            </p>
                            {power.summary ? <p className="mt-1 text-xs text-ink-muted">{power.summary}</p> : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {issues.length > 0 ? <p className="mt-4 text-xs text-accent-crimson-bright">{issues[0].message}</p> : null}
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Disciplinas</p>
          {lineage === "thin_blood" ? (
            <p className="mt-2 text-sm text-foreground">Alquimia de Sangue-Ralo {alchemyLevel}</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {picks.map((p) => (
                <li key={p.disciplineId} className="flex justify-between">
                  <span className="text-ink-muted">{DISCIPLINE_LABELS[p.disciplineId]}</span>
                  <span className="text-foreground">{p.value}</span>
                </li>
              ))}
            </ul>
          )}
        </VelvetCard>
      }
      onSave={async () => {
        const result = await saveDisciplinesStepAction(
          characterId,
          version,
          lineage,
          disciplinePicks,
          lineage === "clan" ? clanDisciplineIds : undefined,
          lineage === "thin_blood" ? { level: alchemyLevel, note: alchemyNote, maxLevel: 3 } : null,
        );
        if (result.version) setVersion(result.version);
        return result;
      }}
    />
  );
}
