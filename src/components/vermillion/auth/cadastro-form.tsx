"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormField, fieldInputClassName } from "@/components/vermillion/form-field";
import { signUpAction, type AuthActionState } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

export function CadastroForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  if (state.success) {
    return (
      <p className="rounded-sm border border-ornament-gold/40 bg-surface-wine/40 px-4 py-3 text-sm text-foreground">
        {state.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Nome de usuário" htmlFor="username">
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          pattern="[a-z0-9_-]+"
          minLength={3}
          maxLength={32}
          className={fieldInputClassName}
        />
        <p className="text-xs text-ink-muted">
          Minúsculas, números, hífen e underscore — este será seu identificador em /u/.
        </p>
      </FormField>

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
          autoComplete="new-password"
          required
          minLength={8}
          className={fieldInputClassName}
        />
      </FormField>

      <FormField label="Confirmar senha" htmlFor="confirmPassword">
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
        {isPending ? "Criando conta..." : "Criar minha conta"}
      </Button>

      <p className="text-center text-xs text-ink-muted">
        Já tem conta?{" "}
        <Link href="/entrar" className="hover:text-foreground">
          Entrar
        </Link>
      </p>
    </form>
  );
}
