import { Check, CloudOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type AutosaveState = "idle" | "saving" | "saved" | "error";

const CONFIG: Record<AutosaveState, { label: string; icon: typeof Check | null }> = {
  idle: { label: "", icon: null },
  saving: { label: "Salvando…", icon: Loader2 },
  saved: { label: "Salvo agora", icon: Check },
  error: { label: "Falha ao salvar — tentando novamente", icon: CloudOff },
};

/**
 * Indicador de autosave do wizard (ADR 0003). Nunca aparece como "Salvo"
 * sem uma escrita confirmada pelo servidor — este componente só reflete
 * o estado que o chamador já confirmou.
 */
export function AutosaveIndicator({ state }: { state: AutosaveState }) {
  const { label, icon: Icon } = CONFIG[state];
  if (state === "idle") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-1.5 text-xs",
        state === "error" ? "text-accent-crimson-bright" : "text-ink-muted"
      )}
    >
      {Icon ? (
        <Icon
          className={cn("size-3.5", state === "saving" && "animate-spin")}
          aria-hidden="true"
        />
      ) : null}
      {label}
    </div>
  );
}
