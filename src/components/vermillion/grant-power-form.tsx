"use client";

import { useState } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { Button } from "@/components/ui/button";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { grantNarratorPowerAction } from "@/lib/council-actions";
import { DISCIPLINE_LABELS } from "@/lib/v5-labels";
import { DISCIPLINE_IDS, type DisciplineId } from "@/domain/v5";

/**
 * Concessão pontual de poder não verificado (ADR 0008) — só disponível
 * antes da aprovação, sempre com fonte/página registrada.
 */
export function GrantPowerForm({ characterId, disabled }: { characterId: string; disabled: boolean }) {
  const [disciplineId, setDisciplineId] = useState<DisciplineId>(DISCIPLINE_IDS[0]);
  const [customName, setCustomName] = useState("");
  const [customLevel, setCustomLevel] = useState(1);
  const [customSummary, setCustomSummary] = useState("");
  const [sourceReference, setSourceReference] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string>();

  async function handleSubmit() {
    setStatus("saving");
    const result = await grantNarratorPowerAction(characterId, {
      disciplineId,
      customName,
      customLevel,
      customSummary,
      sourceReference,
    });
    if (result.error) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("saved");
    setCustomName("");
    setCustomSummary("");
    setSourceReference("");
  }

  return (
    <VelvetCard>
      <h2 className="font-display text-lg text-foreground">Conceder poder não verificado</h2>
      <p className="mt-1 text-xs text-ink-muted">
        Só antes da aprovação (ADR 0008). Depois disso, progressão segue o fluxo normal de XP.
      </p>

      <div className="mt-3 space-y-3">
        <FormField label="Disciplina" htmlFor="grant-discipline">
          <select
            id="grant-discipline"
            value={disciplineId}
            disabled={disabled}
            onChange={(e) => setDisciplineId(e.target.value as DisciplineId)}
            className={fieldInputClassName}
          >
            {DISCIPLINE_IDS.map((id) => (
              <option key={id} value={id}>
                {DISCIPLINE_LABELS[id]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Nome do poder" htmlFor="grant-name">
          <input
            id="grant-name"
            value={customName}
            disabled={disabled}
            onChange={(e) => setCustomName(e.target.value)}
            className={fieldInputClassName}
          />
        </FormField>
        <FormField label="Nível" htmlFor="grant-level">
          <input
            id="grant-level"
            type="number"
            min={1}
            max={5}
            value={customLevel}
            disabled={disabled}
            onChange={(e) => setCustomLevel(Number(e.target.value))}
            className={fieldInputClassName}
          />
        </FormField>
        <FormField label="Resumo autoral" htmlFor="grant-summary">
          <textarea
            id="grant-summary"
            value={customSummary}
            disabled={disabled}
            onChange={(e) => setCustomSummary(e.target.value)}
            rows={2}
            className={`${fieldInputClassName} resize-none`}
          />
        </FormField>
        <FormField label="Fonte (livro, página)" htmlFor="grant-source">
          <input
            id="grant-source"
            value={sourceReference}
            disabled={disabled}
            onChange={(e) => setSourceReference(e.target.value)}
            placeholder="Ex.: Vampire: The Masquerade, p. 123"
            className={fieldInputClassName}
          />
        </FormField>
      </div>

      {error ? <p className="mt-2 text-sm text-accent-crimson-bright">{error}</p> : null}

      <Button type="button" className="mt-3" disabled={disabled || status === "saving"} onClick={handleSubmit}>
        {status === "saving" ? "Concedendo..." : "Conceder poder"}
      </Button>
    </VelvetCard>
  );
}
