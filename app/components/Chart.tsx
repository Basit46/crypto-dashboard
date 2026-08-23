"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  AreaChart,
  Area,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/lib/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact, formatPrice } from "../utils";

const seriesLabel = {
  prices: "Price",
  market_caps: "Market cap",
  total_volumes: "Volume",
} as const;

type Section = keyof typeof seriesLabel;

const Chart = ({
  timeframe,
  section,
}: {
  timeframe: "7" | "30" | "365";
  section: Section;
}) => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["markets", "chart", id, timeframe],
    queryFn: async () => {
      const res = await axiosInstance(`/coins/${id}/${timeframe}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  const values: { time: number; value: number }[] =
    data?.[section]?.map((point: number[]) => ({
      time: point[0],
      value: point[1],
    })) ?? [];

  if (isLoading) {
    return <Skeleton className="size-full rounded-xl" />;
  }

  if (values.length === 0) {
    return (
      <div className="grid size-full place-items-center rounded-xl border border-line text-sm text-ink-muted">
        No chart data available
      </div>
    );
  }

  // A tight domain keeps the movement legible; auto-scaling from zero flattens
  // everything into a straight line.
  const numbers = values.map((v) => v.value);
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const pad = (max - min) * 0.12 || max * 0.05;

  const format = (value: number) =>
    section === "prices" ? formatPrice(value) : formatCompact(value);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={values} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="rgb(var(--chart-fill-from))"
              stopOpacity={0.22}
            />
            <stop
              offset="100%"
              stopColor="rgb(var(--chart-fill-to))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="rgb(var(--chart-grid))"
          strokeDasharray="0"
          vertical={false}
        />

        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          minTickGap={48}
          tick={{ fill: "rgb(var(--ink-subtle))", fontSize: 11 }}
          tickFormatter={(value: number) =>
            new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />

        <YAxis
          orientation="right"
          width={78}
          tickLine={false}
          axisLine={false}
          domain={[min - pad, max + pad]}
          tick={{ fill: "rgb(var(--ink-subtle))", fontSize: 11 }}
          tickFormatter={(value: number) =>
            section === "prices"
              ? `$${value.toLocaleString("en-US", {
                  maximumFractionDigits: value >= 1 ? 0 : 4,
                })}`
              : formatCompact(value)
          }
        />

        <Tooltip
          cursor={{
            stroke: "rgb(var(--line-strong))",
            strokeWidth: 1,
            strokeDasharray: "3 3",
          }}
          content={<CustomTooltip section={section} format={format} />}
        />

        <Area
          type="monotone"
          dataKey="value"
          fill="url(#area-fill)"
          stroke="rgb(var(--chart-line))"
          strokeWidth={1.75}
          activeDot={{
            r: 3.5,
            fill: "rgb(var(--chart-line))",
            stroke: "rgb(var(--surface))",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;

const CustomTooltip = ({
  active,
  payload,
  section,
  format,
}: {
  active?: boolean;
  payload?: { payload: { time: number; value: number } }[];
  section: Section;
  format: (value: number) => string;
}) => {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-line bg-surface px-2.5 py-2 shadow-md">
      <p className="text-2xs uppercase tracking-wider text-ink-subtle">
        {new Date(point.time).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>
      <p className="mt-0.5 font-mono text-base font-medium tabular-nums text-ink">
        {format(point.value)}
      </p>
      <p className="text-2xs text-ink-subtle">{seriesLabel[section]}</p>
    </div>
  );
};
