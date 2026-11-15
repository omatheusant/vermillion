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
      <TooltipContent className="max-w-64 text-left">
        <p>{summary}</p>
        {sourceDocument ? (
          <p className="mt-1 text-[0.7rem] text-ink-muted">
            Fonte: {sourceDocument}
            {sourcePage ? `, p. ${sourcePage}` : ""}
          </p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}
