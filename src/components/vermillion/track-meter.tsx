/**
 * Trilha de dano com superficial/agravado separados — nunca um
 * contador único (docs/DATA_MODEL.md §2, exigência do documento mestre).
 */
export function TrackMeter({
  label,
  max,
  superficial,
  aggravated,
}: {
  label: string;
  max: number;
  superficial: number;
  aggravated: number;
}) {
  const boxes = Array.from({ length: Math.max(max, 1) }, (_, i) => {
    const position = i + 1;
    if (position <= aggravated) return "aggravated";
    if (position <= aggravated + superficial) return "superficial";
    return "empty";
  });

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>{label}</span>
        <span>{max}</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        {boxes.map((state, i) => (
          <span
            key={i}
            className={`size-3.5 rounded-xs border ${
              state === "aggravated"
                ? "border-accent-crimson-bright bg-accent-crimson-bright"
                : state === "superficial"
                  ? "border-ornament-gold bg-ornament-gold/50"
                  : "border-border bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
