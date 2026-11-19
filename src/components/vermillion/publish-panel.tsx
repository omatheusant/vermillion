"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { WaxSeal } from "@/components/vermillion/wax-seal";
import { Button } from "@/components/ui/button";
import { resumeStep } from "@/lib/wizard-steps";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { publishCharacterAction, exportCharacterJsonAction, archiveCharacterAction } from "@/lib/character-actions";
import { submitForReviewAction } from "@/lib/wizard-actions";

export function PublishPanel({
  characterId,
  status,
  visibility,
  slug,
  publicShareToken,
  creationStep,
}: {
  characterId: string;
  status: string;
  visibility: string;
  slug: string | null;
  publicShareToken: string | null;
  creationStep: number;
}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [justPublished, setJustPublished] = useState(false);

  function handlePublish() {
    startTransition(async () => {
      const result = await publishCharacterAction(characterId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setJustPublished(true);
      router.refresh();
    });
  }

  function handleArchive() {
    startTransition(async () => {
      const result = await archiveCharacterAction(characterId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitForReviewAction(characterId);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.issues.length > 0) {
        setError(`Pendências na ficha (etapa ${result.issues[0].step}): ${result.issues[0].message}`);
        return;
      }
      router.refresh();
    });
  }

  async function handleExport() {
    const result = await exportCharacterJsonAction(characterId);
    if (result.error || !result.json) {
      setError(result.error ?? "Falha ao exportar.");
      return;
    }
    const blob = new Blob([result.json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${characterId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <VelvetCard>
      <h2 className="font-display text-lg text-foreground">Ações</h2>

      {error ? <p className="mt-2 text-sm text-accent-crimson-bright">{error}</p> : null}

      <div className="mt-3 flex flex-col gap-2">
        {status === "draft" || status === "changes_requested" ? (
          <>
            <Button type="button" variant="outline" asChild>
              <Link href={`/app/personagens/${characterId}/editar/${resumeStep(creationStep)}`}>Continuar edição</Link>
            </Button>
            <Button type="button" disabled={isPending} onClick={handleSubmit}>
              Enviar para aprovação
            </Button>
          </>
        ) : null}

        {status === "approved" ? (
          <Button type="button" disabled={isPending} onClick={handlePublish}>
            Publicar
          </Button>
        ) : null}

        <Button type="button" variant="outline" onClick={handleExport}>
          Exportar JSON
        </Button>

        {status !== "archived" ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Arquivar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Arquivar este personagem?</DialogTitle>
                <DialogDescription>
                  É definitivo — não existe caminho de volta para rascunho ou publicado (ADR 0006). O slot fica livre
                  para um novo personagem.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="button" variant="destructive" disabled={isPending} onClick={handleArchive}>
                  Arquivar definitivamente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      {status === "published" && visibility === "public" && slug ? (
        <div className="mt-3 flex items-center gap-3">
          {justPublished ? <WaxSeal size="sm" label="Publicado" animateStamp /> : null}
          <p className="text-xs text-ink-muted">
            Público em <span className="text-foreground">/personagens/{slug}</span>
            {publicShareToken ? (
              <>
                {" "}
                · link não listado: <span className="text-foreground">{publicShareToken}</span>
              </>
            ) : null}
          </p>
        </div>
      ) : null}
    </VelvetCard>
  );
}
