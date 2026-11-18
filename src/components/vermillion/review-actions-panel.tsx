"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { WaxSeal } from "@/components/vermillion/wax-seal";
import { Button } from "@/components/ui/button";
import { approveCharacterAction, requestChangesAction } from "@/lib/council-actions";
import type { Tables } from "@/lib/supabase/database.types";

const ACTION_LABELS: Record<string, string> = {
  submitted: "Enviado para avaliação",
  approved: "Aprovado",
  changes_requested: "Ajustes solicitados",
  published: "Publicado",
};

/**
 * Aprovar/devolver via RPC (ADR 0007) — nunca um update solto na
 * tabela characters. Justificativa de "pedir ajustes" é obrigatória
 * (a RPC também recusa sem ela, defesa em profundidade).
 */
export function ReviewActionsPanel({
  characterId,
  status,
  history,
}: {
  characterId: string;
  status: string;
  history: Tables<"review_events">[];
}) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [justApproved, setJustApproved] = useState(false);
  const canReview = status === "submitted";

  function handleApprove() {
    startTransition(async () => {
      const result = await approveCharacterAction(characterId, comment);
      if (result.error) {
        setError(result.error);
        return;
      }
      setJustApproved(true);
      router.refresh();
    });
  }

  function handleRequestChanges() {
    startTransition(async () => {
      const result = await requestChangesAction(characterId, comment);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <VelvetCard>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg text-foreground">Revisão</h2>
        {justApproved ? <WaxSeal size="sm" label="Aprovado" animateStamp /> : null}
      </div>

      <label className="mt-3 block">
        <span className="font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">
          Comentário {canReview ? "(obrigatório para pedir ajustes)" : ""}
        </span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          disabled={!canReview}
          className="mt-1 w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50"
        />
      </label>

      {error ? <p className="mt-2 text-sm text-accent-crimson-bright">{error}</p> : null}

      <div className="mt-3 flex gap-2">
        <Button type="button" disabled={!canReview || isPending} onClick={handleApprove}>
          Aprovar
        </Button>
        <Button type="button" variant="outline" disabled={!canReview || isPending} onClick={handleRequestChanges}>
          Pedir ajustes
        </Button>
      </div>

      {history.length > 0 ? (
        <div className="mt-6 border-t border-border/50 pt-4">
          <h3 className="font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">Histórico</h3>
          <ul className="mt-2 space-y-2 text-xs text-ink-muted">
            {history.map((event) => (
              <li key={event.id}>
                <span className="text-foreground">{ACTION_LABELS[event.action] ?? event.action}</span>
                {" — "}
                {new Date(event.created_at).toLocaleString("pt-BR")}
                {event.comment ? <p className="mt-0.5">{event.comment}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </VelvetCard>
  );
}
