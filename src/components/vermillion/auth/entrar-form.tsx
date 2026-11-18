"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { signInAction, type AuthActionState } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

export function EntrarForm({ redirecionarPara }: { redirecionarPara?: string }) {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirecionarPara" value={redirecionarPara ?? ""} />

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

      <FormField label="Senha" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
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
        {isPending ? "Entrando..." : "Entrar na noite"}
      </Button>

      <div className="flex justify-between text-xs text-ink-muted">
        <Link href="/recuperar-senha" className="hover:text-foreground">
          Esqueci minha senha
        </Link>
        <Link href="/cadastro" className="hover:text-foreground">
          Criar conta
        </Link>
      </div>
    </form>
  );
}
