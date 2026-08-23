"use client";

import { LucideArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPortfolio } from "../lib/query";
import useUser from "../hooks/useUser";
import { formatPercent, formatUsd } from "../utils";
import { Delta } from "./Delta";
import { SignInGate } from "./States";
import { cn } from "@/lib/utils";

const BalanceCard = () => {
  const { assets, isLoading } = useGetPortfolio();
  const { data: user } = useUser();
  const userId = user?._id;

  const totalValue = assets.reduce((acc, asset) => acc + (asset.value || 0), 0);
  const totalCost = assets.reduce((acc, asset) => acc + (asset.prevValue || 0), 0);

  const changeAmount = totalValue - totalCost;
  const changePercent = totalCost > 0 ? (changeAmount / totalCost) * 100 : 0;
  const up = changeAmount >= 0;

  const best = assets.reduce<(typeof assets)[number] | null>((leader, asset) => {
    const gain = (asset.value || 0) - (asset.prevValue || 0);
    const leaderGain = leader ? (leader.value || 0) - (leader.prevValue || 0) : -Infinity;
    return gain > leaderGain ? asset : leader;
  }, null);

  const bestChangePercent =
    best && best.prevValue
      ? ((best.value - best.prevValue) / best.prevValue) * 100
      : 0;

  return (
    <Card className="justify-between overflow-hidden">
      {!userId ? (
        <>
          <div className="flex min-h-[52px] shrink-0 items-center border-b border-line px-4">
            <h2 className="text-base font-semibold text-ink">Net worth</h2>
          </div>
          <SignInGate label="Your balance is private to your account." />
        </>
      ) : (
        <>
          <div className="flex min-h-[52px] shrink-0 items-center justify-between border-b border-line px-4">
            <h2 className="text-base font-semibold text-ink">Net worth</h2>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Portfolio
              <LucideArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="flex flex-1 flex-col justify-between p-4">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-2/3" />
                <Skeleton className="mt-6 h-4 w-1/2" />
              </>
            ) : (
              <>
                <div>
                  <p className="font-mono text-3xl font-medium tabular-nums tracking-[-0.02em] text-ink">
                    {formatUsd(totalValue)}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 font-mono text-sm tabular-nums",
                      up ? "text-pos" : "text-neg"
                    )}
                  >
                    {up ? "+" : "−"}
                    {formatUsd(Math.abs(changeAmount)).slice(1)}
                    <span className="ml-1.5 text-ink-subtle">
                      ({formatPercent(changePercent)} all time)
                    </span>
                  </p>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4">
                  <div>
                    <dt className="text-2xs font-medium uppercase tracking-wider text-ink-subtle">
                      Cost basis
                    </dt>
                    <dd className="mt-0.5 font-mono text-base tabular-nums text-ink">
                      {formatUsd(totalCost)}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-2xs font-medium uppercase tracking-wider text-ink-subtle">
                      Top performer
                    </dt>
                    <dd className="mt-0.5 flex items-center gap-2">
                      <span className="truncate text-base text-ink">
                        {best?.name ?? "—"}
                      </span>
                      {best ? <Delta value={bestChangePercent} /> : null}
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default BalanceCard;
