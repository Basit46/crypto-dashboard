import { cn } from "@/lib/utils";
import { formatPercent } from "../utils";

/**
 * Signed change, rendered consistently everywhere it appears. `plain` is the
 * bare figure for dense contexts (tables); the default chip is for cards.
 */
export function Delta({
  value,
  className,
  plain = false,
  digits = 2,
}: {
  value?: number | null;
  className?: string;
  plain?: boolean;
  digits?: number;
}) {
  const missing = value == null || Number.isNaN(value);
  const up = !missing && value >= 0;

  if (plain) {
    return (
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          missing ? "text-ink-subtle" : up ? "text-pos" : "text-neg",
          className
        )}
      >
        {formatPercent(value, digits)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-md border px-1.5 font-mono text-xs font-medium tabular-nums",
        missing
          ? "border-line bg-surface-hover text-ink-subtle"
          : up
          ? "border-pos-border bg-pos-soft text-pos"
          : "border-neg-border bg-neg-soft text-neg",
        className
      )}
    >
      {formatPercent(value, digits)}
    </span>
  );
}
