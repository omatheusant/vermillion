"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { Button } from "@/components/ui/button";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { WizardStepFrame } from "@/components/vermillion/wizard-step-frame";
import { saveHumanityStepAction } from "@/lib/wizard-actions";
import { validateConvictions, DEFAULT_HUMANITY } from "@/domain/v5";

export interface ConvictionDraft {
  clientId: string;
  label: string;
}

export interface TouchstoneDraft {
  convictionClientId: string;
  name: string;
  bond: string;
  meaning: string;
  status: string;
  isPrivate: boolean;
}

export function WizardStepHumanity({
  characterId,
  initialVersion,
  initialConvictions,
  initialTouchstones,
}: {
  characterId: string;
  initialVersion: number;
  initialConvictions: ConvictionDraft[];
  initialTouchstones: TouchstoneDraft[];
}) {
  const [version, setVersion] = useState(initialVersion);
  const [convictions, setConvictions] = useState<ConvictionDraft[]>(initialConvictions);
  const [touchstones, setTouchstones] = useState<TouchstoneDraft[]>(initialTouchstones);

  const issues = useMemo(
    () =>
      validateConvictions(
        convictions.map((c) => ({ id: c.clientId, label: c.label })),
        touchstones.map((t) => ({ convictionId: t.convictionClientId, name: t.name })),
      ),
    [convictions, touchstones],
  );

  function addConviction() {
    const clientId = crypto.randomUUID();
    setConvictions((prev) => [...prev, { clientId, label: "" }]);
    setTouchstones((prev) => [
      ...prev,
      { convictionClientId: clientId, name: "", bond: "", meaning: "", status: "", isPrivate: true },
    ]);
  }

  function removeConviction(clientId: string) {
    setConvictions((prev) => prev.filter((c) => c.clientId !== clientId));
    setTouchstones((prev) => prev.filter((t) => t.convictionClientId !== clientId));
  }

  return (
    <WizardStepFrame
      characterId={characterId}
      currentStep={7}
      canContinue={issues.length === 0}
      form={
        <div>
          <h1 className="font-display text-2xl text-foreground">Humanidade e crenças</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Humanidade inicial {DEFAULT_HUMANITY}. Escolha de 1 a 3 Convicções, cada uma vinculada a 1 Pilar mortal.
          </p>

          <div className="mt-6 space-y-6">
            {convictions.map((conviction, index) => {
              const touchstone = touchstones.find((t) => t.convictionClientId === conviction.clientId);
              return (
                <VelvetCard key={conviction.clientId}>
                  <div className="flex items-start justify-between gap-2">
                    <FormField label={`Convicção ${index + 1}`} htmlFor={`conviction-${conviction.clientId}`}>
                      <input
                        id={`conviction-${conviction.clientId}`}
                        value={conviction.label}
                        onChange={(e) =>
                          setConvictions((prev) =>
                            prev.map((c) => (c.clientId === conviction.clientId ? { ...c, label: e.target.value } : c)),
                          )
                        }
                        className={fieldInputClassName}
                      />
                    </FormField>
                    <button
                      type="button"
                      onClick={() => removeConviction(conviction.clientId)}
                      className="mt-6 text-ink-muted hover:text-accent-crimson-bright"
                      aria-label="Remover Convicção"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {touchstone ? (
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormField label="Pilar (nome)" htmlFor={`touchstone-name-${conviction.clientId}`}>
                        <input
                          id={`touchstone-name-${conviction.clientId}`}
                          value={touchstone.name}
                          onChange={(e) =>
                            setTouchstones((prev) =>
                              prev.map((t) =>
                                t.convictionClientId === conviction.clientId ? { ...t, name: e.target.value } : t,
                              ),
                            )
                          }
                          className={fieldInputClassName}
                        />
                      </FormField>
                      <FormField label="Vínculo" htmlFor={`touchstone-bond-${conviction.clientId}`}>
                        <input
                          id={`touchstone-bond-${conviction.clientId}`}
                          value={touchstone.bond}
                          onChange={(e) =>
                            setTouchstones((prev) =>
                              prev.map((t) =>
                                t.convictionClientId === conviction.clientId ? { ...t, bond: e.target.value } : t,
                              ),
                            )
                          }
                          className={fieldInputClassName}
                        />
                      </FormField>
                    </div>
                  ) : null}
                </VelvetCard>
              );
            })}
          </div>

          {convictions.length < 3 ? (
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addConviction}>
              <Plus className="size-3.5" /> Adicionar Convicção
            </Button>
          ) : null}

          {issues.length > 0 ? <p className="mt-4 text-xs text-accent-crimson-bright">{issues[0].message}</p> : null}
        </div>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">Humanidade</p>
          <p className="mt-2 font-display text-3xl text-foreground">{DEFAULT_HUMANITY}</p>
          <ul className="mt-4 space-y-1 text-sm text-ink-muted">
            {convictions.map((c) => (
              <li key={c.clientId}>{c.label || "Convicção sem texto"}</li>
            ))}
          </ul>
        </VelvetCard>
      }
      onSave={async () => {
        const result = await saveHumanityStepAction(
          characterId,
          version,
          convictions.map((c, i) => ({ clientId: c.clientId, label: c.label, position: i })),
          touchstones,
        );
        if (result.version) setVersion(result.version);
        return result;
      }}
    />
  );
}
