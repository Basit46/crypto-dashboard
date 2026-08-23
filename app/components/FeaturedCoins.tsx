"use client";

import { AssetType } from "@/types";
import { LucideArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllCoins } from "../lib/query";
import { formatCompact, formatPrice } from "../utils";
import { Delta } from "./Delta";
import { Sparkline } from "./Sparkline";

const FeaturedCoins = () => {
  const { data = [], isLoading } = useGetAllCoins();
  const assets = data.slice(0, 3);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[164px] rounded-xl border border-line bg-surface p-4"
          >
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="mt-4 h-6 w-2/3" />
            <Skeleton className="mt-3 h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset: AssetType) => {
        const change = asset?.price_change_percentage_24h;
        // The trend line covers seven days, so it follows the seven-day move —
        // not the 24h figure shown beside it.
        const trendUp = (asset?.price_change_percentage_7d_in_currency ?? 0) >= 0;

        return (
          <Link
            key={asset?.id}
            href={`/markets/${asset?.id}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-surface-hover">
                  <Image
                    src={asset.image}
                    fill
                    sizes="32px"
                    alt=""
                    className="object-cover"
                  />
                </span>
                <span>
                  <span className="block text-base font-medium text-ink">
                    {asset?.name}
                  </span>
                  <span className="block text-xs uppercase tracking-wide text-ink-subtle">
                    {asset?.symbol}
                  </span>
                </span>
              </div>

              <LucideArrowUpRight className="size-4 shrink-0 text-ink-subtle transition-colors group-hover:text-ink" />
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-2xl font-medium tabular-nums tracking-[-0.02em] text-ink">
                  {formatPrice(asset?.current_price)}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Delta value={change} />
                  <span className="text-xs text-ink-subtle">24h</span>
                </div>
              </div>

              <Sparkline
                data={asset?.sparkline_in_7d?.price}
                positive={trendUp}
                width={84}
                height={38}
                className="shrink-0"
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
              <span className="text-ink-subtle">Market cap</span>
              <span className="font-mono tabular-nums text-ink-muted">
                {formatCompact(asset?.market_cap)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FeaturedCoins;
