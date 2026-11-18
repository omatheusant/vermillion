import Link from "next/link";
import type { ReactNode } from "react";
import { VermillionWordmark } from "@/components/vermillion/vermillion-wordmark";

export interface GothicShellNavItem {
  label: string;
  href: string;
}

/**
 * Casco de página comum ao site: navegação discreta no topo e rodapé
 * legal obrigatório (Dark Pack) — todas as rotas usam este shell,
 * nunca um layout corporativo genérico (docs/DESIGN_SYSTEM.md).
 */
export function GothicShell({
  children,
  navItems = [],
  actions,
}: {
  children: ReactNode;
  navItems?: GothicShellNavItem[];
  actions?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <VermillionWordmark size="sm" />
          </Link>
          {navItems.length > 0 ? (
            <nav
              aria-label="Navegação principal"
              className="hidden items-center gap-8 font-sans text-sm text-ink-muted md:flex"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
          <div className="flex items-center gap-3">{actions}</div>
        </div>
      </header>

      <main className="flex-1 pt-16">{children}</main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-xs text-ink-muted">
          <p>
            Vermillion é um projeto de fã, gratuito e não afiliado nem
            endossado pela Paradox Interactive. <strong>Vampire: The
            Masquerade®</strong> é marca registrada da Paradox Interactive AB.
            Produzido sob o acordo Dark Pack.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/codice" className="hover:text-foreground">
              O Códice
            </Link>
            <Link href="/personagens" className="hover:text-foreground">
              Os Condenados
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
