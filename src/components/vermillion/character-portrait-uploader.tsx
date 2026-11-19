"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadCharacterPortraitAction } from "@/lib/media-actions";
import { cropAndResizeToPortrait } from "@/lib/image-crop";

/**
 * Upload de retrato do personagem — recorta/redimensiona no client para
 * 3:4 (src/lib/image-crop.ts) antes de enviar, então nunca sobe uma foto
 * fora de proporção. `version`/`onVersionChange` seguem o mesmo
 * versionamento otimista das outras etapas (ADR 0003): o upload também
 * bumpa characters.version, então o form de texto da etapa precisa saber
 * do novo valor antes de salvar de novo.
 */
export function CharacterPortraitUploader({
  characterId,
  version,
  onVersionChange,
  currentUrl,
}: {
  characterId: string;
  version: number;
  onVersionChange: (version: number) => void;
  currentUrl: string | null;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(undefined);
    setIsPending(true);

    try {
      const cropped = await cropAndResizeToPortrait(file);
      const localUrl = URL.createObjectURL(cropped);
      setPreviewUrl(localUrl);

      const formData = new FormData();
      formData.set("portrait", cropped, "retrato.jpg");

      const result = await uploadCharacterPortraitAction(characterId, version, formData);
      if (result.error) {
        setError(result.error);
        setPreviewUrl(currentUrl);
        return;
      }
      if (result.version) onVersionChange(result.version);
    } catch {
      setError("Não foi possível processar essa imagem. Tente outro arquivo.");
      setPreviewUrl(currentUrl);
    } finally {
      setIsPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div
        aria-hidden="true"
        className="aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-sm border border-border bg-surface-wine"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL assinada/efêmera ou local (blob), não compensa next/image
          <img src={previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center font-display text-2xl text-ink-muted">?</div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="portrait" className="font-badge text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
          Retrato do personagem
        </label>
        <p className="max-w-xs text-xs text-ink-muted">
          A foto é recortada automaticamente na proporção 3:4. Envie uma imagem nítida do rosto/corpo do personagem.
        </p>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            id="portrait"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isPending}
            className="text-xs text-ink-muted"
          />
          {isPending ? <Button type="button" size="sm" disabled>Enviando...</Button> : null}
        </div>
        {error ? (
          <span role="alert" className="text-xs text-accent-crimson-bright">
            {error}
          </span>
        ) : null}
      </div>
    </div>
  );
}
