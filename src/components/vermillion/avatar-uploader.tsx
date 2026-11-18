"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadAvatarAction, type UploadAvatarState } from "@/lib/media-actions";

const initialState: UploadAvatarState = {};

export function AvatarUploader({ currentUrl }: { currentUrl: string | null }) {
  const [state, formAction, isPending] = useActionState(uploadAvatarAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex items-center gap-4">
      <div
        aria-hidden="true"
        className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-wine"
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL assinada e efêmera, não compensa next/image
          <img src={currentUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="font-display text-xl text-ink-muted">?</span>
        )}
      </div>

      <form
        ref={formRef}
        action={(formData) => {
          formAction(formData);
          formRef.current?.reset();
        }}
        className="flex flex-col gap-1.5"
      >
        <label htmlFor="avatar" className="font-badge text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
          Foto de perfil
        </label>
        <div className="flex items-center gap-2">
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="text-xs text-ink-muted"
          />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
        {state.error ? (
          <span role="alert" className="text-xs text-accent-crimson-bright">
            {state.error}
          </span>
        ) : null}
        {state.success ? <span className="text-xs text-foreground">Imagem atualizada.</span> : null}
      </form>
    </div>
  );
}
