export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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
