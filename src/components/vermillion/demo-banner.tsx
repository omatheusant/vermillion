import { FlaskConical } from "lucide-react";

/**
 * Obrigatório em toda tela que ainda usa fixtures (Fase B, sem banco).
 * Remover só quando a tela passar a buscar dados reais (Fase C+).
 */
export function DemoBanner() {
  return (
    <div className="border-b border-ornament-gold/30 bg-surface-wine/60">
      <p className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-2 text-xs text-ink-muted">
        <FlaskConical className="size-3.5 shrink-0" aria-hidden="true" />
        Protótipo de Fase B — personagens e status abaixo são dados de
        demonstração, ainda sem conexão com o banco.
      </p>
    </div>
  );
}
