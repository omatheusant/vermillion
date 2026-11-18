"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { requestPasswordResetAction, type AuthActionState } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

export function RecuperarSenhaForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, initialState);

  if (state.success) {
    return (
      <p className="rounded-sm border border-ornament-gold/40 bg-surface-wine/40 px-4 py-3 text-sm text-foreground">
        {state.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldInputClassName}
        />
      </FormField>

      {state.error ? (
        <p role="alert" className="text-sm text-accent-crimson-bright">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Enviando..." : "Enviar link de recuperação"}
      </Button>

      <p className="text-center text-xs text-ink-muted">
        <Link href="/entrar" className="hover:text-foreground">
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}
