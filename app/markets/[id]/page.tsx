"use client";

import Chart from "@/app/components/Chart";
import PageHeader from "@/app/components/PageHeader";
import { Delta } from "@/app/components/Delta";
import useUser from "@/app/hooks/useUser";
import {
  useAddToWatchlist,
  useRemoveFromPortfolio,
  useRemoveFromWatchlist,
} from "@/app/lib/mutations";
import { useGetPortfolio, useGetWatchlist } from "@/app/lib/query";
import { useGlobalStore } from "@/app/store/globalStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import {
  LucideChevronLeft,
  LucideMinus,
  LucidePlus,
  LucideStar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { formatCompact, formatPrice } from "@/app/utils";
import { cn } from "@/lib/utils";

const series = [
  { key: "prices", label: "Price" },
  { key: "market_caps", label: "Market cap" },
  { key: "total_volumes", label: "Volume" },
] as const;

const timeframes = [
  { key: "7", label: "7D" },
  { key: "30", label: "1M" },
  { key: "365", label: "1Y" },
] as const;

const CoinDetails = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { setIsAddToPortfolioOpen, setAddToPortfolioId } = useGlobalStore();
  const { data: user } = useUser();
  const userId = user?._id;
  const { assets: portfolio } = useGetPortfolio();
  const { data: watchlist = [] } = useGetWatchlist();
  const { mutate: addToWatchlist } = useAddToWatchlist();
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist();
  const { mutate: removeFromPortfolio } = useRemoveFromPortfolio();

  const [section, setSection] =
    useState<(typeof series)[number]["key"]>("prices");
  const [timeframe, setTimeframe] =
    useState<(typeof timeframes)[number]["key"]>("365");

  const { data, isLoading } = useQuery({
    queryKey: ["markets", id],
    queryFn: async () => {
      const res = await axiosInstance(`/coins/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 12,
  });

  const market = data?.market_data;
  const change24h = market?.price_change_percentage_24h;
  const onWatchlist = watchlist?.includes(data?.id);
  const inPortfolio = portfolio.some((item) => item.coinId === id);

  const stats = [
    { label: "Market cap", value: formatCompact(market?.market_cap?.usd) },
    {
      label: "Fully diluted",
      value: formatCompact(market?.fully_diluted_valuation?.usd),
    },
    { label: "Volume 24h", value: formatCompact(market?.total_volume?.usd) },
    { label: "24h high", value: formatPrice(market?.high_24h?.usd) },
    { label: "24h low", value: formatPrice(market?.low_24h?.usd) },
    { label: "All-time high", value: formatPrice(market?.ath?.usd) },
    { label: "All-time low", value: formatPrice(market?.atl?.usd) },
    {
      label: "Circulating supply",
      value: market?.circulating_supply
        ? market.circulating_supply.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })
        : "—",
    },
    {
      label: "Max supply",
      value: market?.max_supply
        ? market.max_supply.toLocaleString("en-US", { maximumFractionDigits: 0 })
        : "Uncapped",
    },
  ];

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="grid size-7 shrink-0 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
            >
              <LucideChevronLeft className="size-4" />
            </button>
            <span className="truncate">{data?.name ?? "Loading…"}</span>
          </span>
        }
        caption={
          data?.symbol ? (
            <span className="uppercase tracking-wide">
              {data.symbol}
              {data?.market_cap_rank ? ` · Rank #${data.market_cap_rank}` : ""}
            </span>
          ) : undefined
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 p-4 vsm:p-6 xl:grid-cols-12">
          {/* Identity + price + actions */}
          <div className="flex flex-col gap-4 xl:col-span-4 2xl:col-span-3">
            <div className="rounded-xl border border-line bg-surface p-4">
              {isLoading ? (
                <>
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="mt-4 h-8 w-2/3" />
                  <Skeleton className="mt-3 h-4 w-1/3" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-hover">
                      {data?.image?.large ? (
                        <Image
                          src={data.image.large}
                          fill
                          sizes="40px"
                          alt=""
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-ink">
                        {data?.name}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-ink-subtle">
                        {data?.symbol}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 font-mono text-3xl font-medium tabular-nums tracking-[-0.02em] text-ink">
                    {formatPrice(market?.current_price?.usd)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Delta value={change24h} />
                    <span className="text-xs text-ink-subtle">past 24 hours</span>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <Button
                      disabled={!userId}
                      variant={inPortfolio ? "destructive" : "default"}
                      onClick={() => {
                        if (inPortfolio) {
                          removeFromPortfolio(id);
                        } else {
                          setAddToPortfolioId(id);
                          setIsAddToPortfolioOpen(true);
                        }
                      }}
                      className="w-full"
                    >
                      {inPortfolio ? (
                        <LucideMinus className="size-4" />
                      ) : (
                        <LucidePlus className="size-4" />
                      )}
                      {inPortfolio ? "Remove from portfolio" : "Add to portfolio"}
                    </Button>

                    <Button
                      disabled={!userId}
                      variant="outline"
                      onClick={() =>
                        onWatchlist
                          ? removeFromWatchlist(data.id)
                          : addToWatchlist(data.id)
                      }
                      className="w-full"
                    >
                      <LucideStar
                        className={cn("size-4", onWatchlist && "text-accent")}
                        fill={onWatchlist ? "currentColor" : "none"}
                      />
                      {onWatchlist ? "On your watchlist" : "Add to watchlist"}
                    </Button>

                    {!userId ? (
                      <p className="text-center text-xs text-ink-subtle">
                        <Link
                          href="/auth/signin"
                          className="text-accent underline-offset-4 hover:underline"
                        >
                          Sign in
                        </Link>{" "}
                        to track this asset
                      </p>
                    ) : null}
                  </div>
                </>
              )}
            </div>

            {/* Key statistics */}
            <div className="rounded-xl border border-line bg-surface">
              <div className="flex min-h-[52px] items-center border-b border-line px-4">
                <h2 className="text-base font-semibold text-ink">Key statistics</h2>
              </div>
              <dl className="divide-y divide-line">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between gap-4 px-4 py-2.5"
                  >
                    <dt className="text-sm text-ink-muted">{stat.label}</dt>
                    <dd className="font-mono text-sm tabular-nums text-ink">
                      {isLoading ? (
                        <Skeleton className="h-3.5 w-20" />
                      ) : (
                        stat.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Chart */}
          <div className="flex min-w-0 flex-col xl:col-span-8 2xl:col-span-9">
            <div className="flex min-h-[440px] flex-1 flex-col rounded-xl border border-line bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                <div className="segmented" role="group" aria-label="Chart series">
                  {series.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSection(item.key)}
                      data-active={section === item.key}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="segmented" role="group" aria-label="Timeframe">
                  {timeframes.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTimeframe(item.key)}
                      data-active={timeframe === item.key}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-[360px] flex-1 p-4 pl-1">
                <Chart timeframe={timeframe} section={section} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoinDetails;
