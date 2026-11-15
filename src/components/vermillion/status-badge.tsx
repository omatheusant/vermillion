import { CheckCircle2, FilePenLine, Hourglass, Globe2, MessageSquareWarning, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CharacterStatus } from "@/types/character";

const STATUS_CONFIG: Record<
  CharacterStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  draft: {
    label: "Rascunho",
    icon: FilePenLine,
    className: "text-ink-muted border-border",
  },
  submitted: {
    label: "Em avaliação",
    icon: Hourglass,
    className: "text-ornament-gold border-ornament-gold/40",
  },
  changes_requested: {
    label: "Ajustes pedidos",
    icon: MessageSquareWarning,
    className: "text-accent-crimson-bright border-accent-crimson-bright/40",
  },
  approved: {
    label: "Aprovado",
    icon: CheckCircle2,
    className: "text-ink-ivory border-ornament-gold/60",
  },
  published: {
    label: "Publicado",
    icon: Globe2,
    className: "text-ink-ivory border-ornament-gold/60",
  },
  archived: {
    label: "Arquivado",
    icon: Archive,
    className: "text-ink-muted border-border",
  },
};

/**
 * Estado nunca é comunicado só por cor — sempre ícone + rótulo
 * (docs/DESIGN_SYSTEM.md §1, regra de foco/erro).
 */
export function StatusBadge({ status }: { status: CharacterStatus }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border bg-surface-wine/80 px-2.5 py-1 font-badge text-[0.7rem] uppercase tracking-[0.12em]",
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
