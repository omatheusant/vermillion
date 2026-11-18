export interface XpLedgerEntry {
  id: string;
  delta: number;
  reason: string;
  category: string;
  applied_at: string | null;
  created_at: string;
}

/**
 * Lista somente-leitura do histórico de XP. A compra/gasto de XP em si
 * (fluxo de aprovação do narrador) fica para uma rodada futura — aqui
 * só exibimos o que já está em xp_ledger, nunca subtraindo nada no
 * client (docs/V5_RULES_MATRIX.md §5).
 */
export function XpLedger({ entries }: { entries: XpLedgerEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-ink-muted">Nenhum lançamento de XP ainda.</p>;
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between rounded-sm border border-border/60 px-3 py-2 text-sm">
          <div>
            <p className="text-foreground">{entry.reason}</p>
            <p className="text-xs text-ink-muted">
              {entry.category} · {new Date(entry.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <span className={entry.delta >= 0 ? "text-foreground" : "text-accent-crimson-bright"}>
            {entry.delta >= 0 ? "+" : ""}
            {entry.delta}
          </span>
        </li>
      ))}
    </ul>
  );
}
