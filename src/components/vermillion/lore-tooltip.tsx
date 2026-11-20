import { CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * "Como funciona?" — explicação autoral curta com referência de página,
 * nunca transcrição extensa do material original (LEGAL.md).
 */
export function LoreTooltip({
  summary,
  sourceDocument,
  sourcePage,
}: {
  summary: string;
  sourceDocument?: string;
  sourcePage?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Como funciona?"
          className="inline-flex size-4 items-center justify-center text-ink-muted hover:text-ornament-gold"
        >
          <CircleHelp className="size-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="flex max-w-64 flex-col items-start gap-1 whitespace-normal text-left font-sans">
        <p className="text-xs leading-relaxed">{summary}</p>
        {sourceDocument ? (
          <p className="text-[0.7rem] leading-relaxed text-ink-muted">
            Fonte: {sourceDocument}
            {sourcePage ? `, p. ${sourcePage}` : ""}
          </p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}
