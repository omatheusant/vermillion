import type { ReactNode } from "react";

/**
 * Label + controle + erro inline, com aria-describedby — reaproveitado
 * pelos formulários de autenticação e do wizard (requisito de
 * acessibilidade: erro sempre junto ao campo, nunca só por cor).
 */
export function FormField({
  label,
  htmlFor,
  error,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  help?: ReactNode;
  children: ReactNode;
}) {
  const errorId = `${htmlFor}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 font-badge text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
        {label}
        {help}
      </label>
      {children}
      {error ? (
        <span id={errorId} role="alert" className="block text-xs text-accent-crimson-bright">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export const fieldInputClassName =
  "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold disabled:cursor-not-allowed disabled:opacity-60";
