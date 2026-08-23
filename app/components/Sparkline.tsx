import { useId } from "react";

/**
 * A hand-rolled SVG trend line. Recharts is far too heavy for a 24px glyph that
 * appears on every table row, and this needs no measurement pass.
 */
export function Sparkline({
  data,
  positive,
  width = 104,
  height = 30,
  className,
}: {
  data?: number[];
  positive?: boolean;
  width?: number;
  height?: number;
  className?: string;
}) {
  const id = useId();

  if (!data || data.length < 2) {
    return <div style={{ width, height }} className={className} />;
  }

  // Downsample: a week of hourly points is ~168 samples for ~104px of width.
  const step = Math.max(1, Math.ceil(data.length / 64));
  const points = data.filter((_, i) => i % step === 0);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const pad = 2;
  const usable = height - pad * 2;

  const coords = points.map((value, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = pad + (1 - (value - min) / span) * usable;
    return [x, y] as const;
  });

  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  const stroke = positive ? "rgb(var(--pos))" : "rgb(var(--neg))";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.18} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
