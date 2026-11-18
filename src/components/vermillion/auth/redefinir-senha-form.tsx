"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { updatePasswordAction, type AuthActionState } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

export function RedefinirSenhaForm() {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Nova senha" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={fieldInputClassName}
        />
      </FormField>

      <FormField label="Confirmar nova senha" htmlFor="confirmPassword">
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={fieldInputClassName}
        />
      </FormField>

      {state.error ? (
        <p role="alert" className="text-sm text-accent-crimson-bright">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
