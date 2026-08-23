"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetGlobalMarket } from "../lib/query";
import { formatCompact } from "../utils";
import { Delta } from "./Delta";
import { cn } from "@/lib/utils";

/**
 * The market-wide numbers that frame everything else on the dashboard. Kept as
 * a flat strip of hairline-separated tiles rather than four floating cards —
 * they are one reading, not four.
 */
const MarketStats = () => {
  const { data, isLoading } = useGetGlobalMarket();

  const tiles = [
    {
      label: "Total market cap",
      value: formatCompact(data?.total_market_cap?.usd),
      trail: <Delta value={data?.market_cap_change_percentage_24h_usd} />,
    },
    {
      label: "24h volume",
      value: formatCompact(data?.total_volume?.usd),
    },
    {
      label: "BTC dominance",
      value:
        data?.market_cap_percentage?.btc != null
          ? `${data.market_cap_percentage.btc.toFixed(1)}%`
          : "—",
      trail:
        data?.market_cap_percentage?.eth != null ? (
          <span className="font-mono text-xs tabular-nums text-ink-subtle">
            ETH {data.market_cap_percentage.eth.toFixed(1)}%
          </span>
        ) : null,
    },
    {
      label: "Tracked assets",
      value: data?.active_cryptocurrencies?.toLocaleString("en-US") ?? "—",
      trail: data?.markets ? (
        <span className="font-mono text-xs tabular-nums text-ink-subtle">
          {data.markets.toLocaleString("en-US")} markets
        </span>
      ) : null,
    },
  ];

  return (
    <div className="grid grid-cols-2 rounded-xl border border-line bg-surface lg:grid-cols-4">
      {tiles.map((tile, i) => (
        <div
          key={tile.label}
          className={cn(
            "p-4",
            // Two columns below lg, four above — the seams move with the grid.
            i < 2 && "border-b border-line lg:border-b-0",
            i % 2 === 1 && "border-l border-line",
            i === 2 && "lg:border-l lg:border-line"
          )}
        >
          <p className="text-2xs font-medium uppercase tracking-wider text-ink-subtle">
            {tile.label}
          </p>
          {isLoading ? (
            <Skeleton className="mt-2 h-6 w-24" />
          ) : (
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-mono text-xl font-medium tabular-nums tracking-[-0.01em] text-ink">
                {tile.value}
              </p>
              {tile.trail}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MarketStats;
