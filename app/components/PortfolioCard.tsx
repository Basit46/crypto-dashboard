"use client";

import { LucideArrowUpRight, LucideWallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetPortfolio } from "../lib/query";
import useUser from "../hooks/useUser";
import { formatUsd } from "../utils";
import { Delta } from "./Delta";
import { EmptyState, SignInGate } from "./States";

const PortfolioCard = () => {
  const { assets, isLoading } = useGetPortfolio();
  const { data: user } = useUser();
  const userId = user?._id;

  const total = assets.reduce((acc, asset) => acc + (asset.value || 0), 0);

  // Largest positions first — that is the allocation question a holder asks.
  const top = [...assets].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 4);

  return (
    <Card className="overflow-hidden">
      <div className="flex min-h-[52px] shrink-0 items-center justify-between border-b border-line px-4">
        <h2 className="text-base font-semibold text-ink">Top holdings</h2>
        {userId && assets.length > 0 ? (
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
          >
            View all
            <LucideArrowUpRight className="size-3.5" />
          </Link>
        ) : null}
      </div>

      {!userId ? (
        <SignInGate label="Track what you hold across every asset." />
      ) : isLoading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-7 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      ) : top.length === 0 ? (
        <EmptyState
          icon={LucideWallet}
          title="No holdings yet"
          description="Add an asset from the markets table to start tracking its performance."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/markets">Browse markets</Link>
            </Button>
          }
        />
      ) : (
        <ul className="flex-1 divide-y divide-line">
          {top.map((asset) => {
            const profit = (asset.value || 0) - (asset.prevValue || 0);
            const profitPct = asset.prevValue
              ? (profit / asset.prevValue) * 100
              : 0;
            const share = total > 0 ? ((asset.value || 0) / total) * 100 : 0;

            return (
              <li key={asset._id}>
                <Link
                  href={`/markets/${asset.coinId}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
                >
                  <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-surface-hover">
                    {asset.image ? (
                      <Image
                        src={asset.image}
                        fill
                        sizes="28px"
                        alt=""
                        className="object-cover"
                      />
                    ) : null}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-medium text-ink">
                      {asset.name}
                    </span>
                    {/* Allocation bar: the share of net worth this position is. */}
                    <span className="mt-1 flex items-center gap-2">
                      <span className="h-1 w-full max-w-[72px] overflow-hidden rounded-full bg-surface-active">
                        <span
                          className="block h-full rounded-full bg-accent"
                          style={{ width: `${Math.min(share, 100)}%` }}
                        />
                      </span>
                      <span className="font-mono text-2xs tabular-nums text-ink-subtle">
                        {share.toFixed(1)}%
                      </span>
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-base tabular-nums text-ink">
                      {formatUsd(asset.value)}
                    </span>
                    <Delta value={profitPct} plain className="text-xs" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default PortfolioCard;
