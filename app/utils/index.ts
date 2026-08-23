export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return date.toLocaleString("en-US", options);
}

export function formatNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    const mil = (value / 1_000_000).toFixed(2);
    return `${value > 0 ? "+" : ""}${mil}M`;
  }

  return `${value > 0 ? "+" : ""}${value}`;
}

/**
 * Prices span nine orders of magnitude in this dataset, so the number of
 * decimals has to follow the magnitude — $67,412.90 and $0.00003184 both need
 * to read precisely.
 */
export function formatPrice(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";

  const abs = Math.abs(value);
  const decimals = abs === 0 ? 2 : abs >= 1 ? 2 : abs >= 0.01 ? 4 : 8;

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** Money that only needs two decimals — balances, cost basis, P/L. */
export function formatUsd(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Market caps and volumes, shortened so table columns stay scannable. */
export function formatCompact(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";

  const abs = Math.abs(value);
  const units: [number, string][] = [
    [1e12, "T"],
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];

  for (const [size, suffix] of units) {
    if (abs >= size) {
      return `$${(value / size).toFixed(2)}${suffix}`;
    }
  }

  return `$${value.toFixed(2)}`;
}

export function formatPercent(value?: number | null, digits = 2): string {
  if (value == null || Number.isNaN(value)) return "—";

  const magnitude = Math.abs(value);
  // "+0.00%" and "−0.00%" both claim a direction the number does not have.
  const sign = magnitude < 0.5 / 10 ** digits ? "" : value > 0 ? "+" : "−";

  return `${sign}${magnitude.toFixed(digits)}%`;
}

export function formatQuantity(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}
