"use client";

/**
 * Seletor de pontos por "pontinhos" (Atributos/Perícias/Disciplinas).
 * Acessível por teclado (setas ou Home/End movem o valor, não depende
 * de clicar em círculos minúsculos — master doc, componentes de UI).
 */
export function DotsInput({
  label,
  labelAddon,
  value,
  max = 5,
  min = 0,
  onChange,
  disabled,
  blockedValues,
}: {
  label: string;
  /** Ex.: um `LoreTooltip` — fica dentro da coluna de rótulo (largura fixa), nunca afeta `aria-label`. */
  labelAddon?: React.ReactNode;
  value: number;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  /**
   * Valores de pontinho indisponíveis agora (ex.: orçamento daquele nível
   * já esgotado por outras perícias) — ficam visualmente travados, mas o
   * valor atual nunca é bloqueado (sempre pode reduzir/desmarcar).
   */
  blockedValues?: number[];
}) {
  function handleKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(Math.min(max, value + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(Math.max(min, value - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(min);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(max);
    }
  }

  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
    >
      <span className="flex w-40 shrink-0 items-center gap-1 text-sm text-foreground">
        <span className="truncate">{label}</span>
        {labelAddon}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((dot) => {
          const isBlocked = dot !== value && (blockedValues?.includes(dot) ?? false);
          const isDisabled = disabled || isBlocked;
          return (
            <button
              key={dot}
              type="button"
              tabIndex={-1}
              disabled={isDisabled}
              title={isBlocked ? "Sem orçamento disponível para este nível" : undefined}
              onClick={() => {
                if (isDisabled) return;
                onChange(dot === value ? dot - 1 : dot);
              }}
              aria-hidden="true"
              className={`size-3.5 rounded-full border transition-colors ${
                dot <= value ? "border-ornament-gold bg-ornament-gold" : "border-border bg-transparent"
              } ${isDisabled ? "cursor-not-allowed opacity-30" : "hover:border-ornament-gold/80"}`}
            />
          );
        })}
      </div>
      <span className="w-4 text-right font-badge text-xs text-ink-muted">{value}</span>
    </div>
  );
}
