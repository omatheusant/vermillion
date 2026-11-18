import { signOutAction } from "@/lib/auth-actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-sm border border-border px-4 py-1.5 font-badge text-xs uppercase tracking-[0.12em] text-ink-muted transition-colors hover:border-ornament-gold/60 hover:text-foreground"
      >
        Sair
      </button>
    </form>
  );
}
