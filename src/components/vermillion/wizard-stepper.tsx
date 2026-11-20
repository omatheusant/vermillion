import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStepInfo {
  index: number;
  title: string;
  /** Número de campos obrigatórios ainda não preenchidos nesta etapa. */
  pendingCount?: number;
}

/**
 * Barra lateral (desktop) / stepper horizontal (mobile) do wizard O
 * Abraço. Navegação por teclado nativa (são <button>, não <div onClick>).
 */
export function WizardStepper({
  steps,
  currentStep,
  onStepSelect,
  className,
}: {
  steps: WizardStepInfo[];
  currentStep: number;
  onStepSelect?: (index: number) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Etapas da criação"
      className={cn(
        "flex gap-2 overflow-x-auto md:flex-col md:overflow-visible",
        className
      )}
    >
      {steps.map((step) => {
        const isCurrent = step.index === currentStep;
        const isComplete = step.index < currentStep && !step.pendingCount;
        /** A "Introdução" (índice 0) é a tela de criação do personagem, anterior
         * ao wizard — não existe rota /editar/0 para revisitá-la, então o item
         * fica só como indicador de progresso, sem navegação (evita "Esta etapa
         * não existe" ao clicar nela depois de avançar). */
        const isNavigable = step.index > 0;
        return (
          <button
            key={step.index}
            type="button"
            aria-current={isCurrent ? "step" : undefined}
            disabled={!isNavigable}
            onClick={isNavigable ? () => onStepSelect?.(step.index) : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-sm border px-3 py-2 text-left text-sm transition-colors md:shrink",
              isCurrent
                ? "border-ornament-gold/60 bg-surface-wine text-foreground"
                : "border-transparent text-ink-muted hover:border-border hover:text-foreground",
              !isNavigable && "cursor-default hover:border-transparent hover:text-ink-muted"
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border font-badge text-[0.7rem]",
                isComplete
                  ? "border-ornament-gold bg-ornament-gold/20 text-ornament-gold"
                  : isCurrent
                    ? "border-ornament-gold text-ornament-gold"
                    : "border-border text-ink-muted"
              )}
            >
              {isComplete ? <Check className="size-3.5" aria-hidden="true" /> : step.index}
            </span>
            <span className="flex flex-col">
              <span className="whitespace-nowrap">{step.title}</span>
              {step.pendingCount ? (
                <span className="text-[0.7rem] text-accent-crimson-bright">
                  {step.pendingCount} pendente{step.pendingCount > 1 ? "s" : ""}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
