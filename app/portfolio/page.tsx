"use client";

import React, { useMemo, useState } from "react";
import { LucideSearch, LucideWallet } from "lucide-react";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetPortfolio } from "../lib/query";
import { useRouter } from "next/navigation";
import { useRemoveFromPortfolio } from "../lib/mutations";
import useUser from "../hooks/useUser";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { AssetCell } from "../components/AssetCell";
import { Delta } from "../components/Delta";
import { EmptyState, SignInGate } from "../components/States";
import { PortfolioType } from "@/types";
import { formatPrice, formatQuantity, formatUsd } from "../utils";
import { cn } from "@/lib/utils";

const Portfolio = () => {
  const router = useRouter();
  const { data: user } = useUser();
  const userId = user?._id;
  const { assets, isLoading } = useGetPortfolio();
  const { mutate: removeFromPortfolio } = useRemoveFromPortfolio();

  const [searchValue, setSearchValue] = useState("");

  const totals = useMemo(() => {
    const value = assets.reduce((acc, a) => acc + (a.value || 0), 0);
    const cost = assets.reduce((acc, a) => acc + (a.prevValue || 0), 0);
    const pnl = value - cost;

    return { value, cost, pnl, pct: cost > 0 ? (pnl / cost) * 100 : 0 };
  }, [assets]);

  const columns: ColumnDef<PortfolioType>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Asset",
        cell: ({ row }) => (
          <AssetCell
            image={row.original.image}
            name={row.original.name}
            symbol={row.original.symbol}
          />
        ),
      },
      {
        accessorKey: "holdings",
        header: "Holdings",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="font-mono text-base tabular-nums text-ink">
            {formatQuantity(row.original.holdings)}
            <span className="ml-1 uppercase text-ink-subtle">
              {row.original.symbol}
            </span>
          </span>
        ),
      },
      {
        accessorKey: "cost",
        header: "Avg. cost",
        meta: { align: "right", className: "hidden sm:table-cell" },
        cell: ({ row }) => (
          <span className="font-mono text-base tabular-nums text-ink-muted">
            {formatPrice(row.original.cost)}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="font-mono text-base tabular-nums text-ink">
            {formatPrice(row.original.price)}
          </span>
        ),
      },
      {
        accessorKey: "value",
        header: "Value",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="font-mono text-base tabular-nums text-ink">
            {formatUsd(row.original.value)}
          </span>
        ),
      },
      {
        id: "pnl",
        header: "Profit / loss",
        meta: { align: "right" },
        cell: ({ row }) => {
          const profit = (row.original.value || 0) - (row.original.prevValue || 0);
          const pct = row.original.prevValue
            ? (profit / row.original.prevValue) * 100
            : 0;

          return (
            <div className="flex flex-col items-end gap-0.5">
              <span
                className={cn(
                  "font-mono text-base tabular-nums",
                  profit >= 0 ? "text-pos" : "text-neg"
                )}
              >
                {profit >= 0 ? "+" : "−"}
                {formatUsd(Math.abs(profit)).slice(1)}
              </span>
              <Delta value={pct} plain className="text-xs" />
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        meta: { align: "right" },
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              removeFromPortfolio(row.original.coinId);
            }}
            className="text-ink-subtle hover:text-neg"
          >
            Remove
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const filteredData = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return assets;

    return assets.filter(
      (asset) =>
        asset.name?.toLowerCase().includes(query) ||
        asset.symbol?.toLowerCase().includes(query)
    );
  }, [assets, searchValue]);

  const summary = [
    { label: "Total value", value: formatUsd(totals.value) },
    { label: "Cost basis", value: formatUsd(totals.cost) },
    {
      label: "Unrealised P/L",
      value: `${totals.pnl >= 0 ? "+" : "−"}${formatUsd(
        Math.abs(totals.pnl)
      ).slice(1)}`,
      tone: totals.pnl >= 0 ? "pos" : "neg",
      trail: <Delta value={totals.pct} />,
    },
    { label: "Positions", value: String(assets.length) },
  ] as const;

  return (
    <>
      <PageHeader
        title="Portfolio"
        caption={userId ? "Your holdings, marked to market" : undefined}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 vsm:p-6">
        {!userId ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-line bg-surface">
            <SignInGate label="Your portfolio is private to your account." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 rounded-xl border border-line bg-surface lg:grid-cols-4">
              {summary.map((item, i) => (
                <div
                  key={item.label}
                  className={cn(
                    "p-4",
                    i < 2 && "border-b border-line lg:border-b-0",
                    i % 2 === 1 && "border-l border-line",
                    i === 2 && "lg:border-l"
                  )}
                >
                  <p className="text-2xs font-medium uppercase tracking-wider text-ink-subtle">
                    {item.label}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p
                      className={cn(
                        "font-mono text-xl font-medium tabular-nums tracking-[-0.01em]",
                        "tone" in item && item.tone === "pos" && "text-pos",
                        "tone" in item && item.tone === "neg" && "text-neg",
                        !("tone" in item) && "text-ink"
                      )}
                    >
                      {item.value}
                    </p>
                    {"trail" in item ? item.trail : null}
                  </div>
                </div>
              ))}
            </div>

            {!isLoading && assets.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-xl border border-line bg-surface">
                <EmptyState
                  icon={LucideWallet}
                  title="Your portfolio is empty"
                  description="Add a position from the markets table and CoinVista will track its value and profit for you."
                  action={
                    <Button asChild size="sm">
                      <Link href="/markets">Browse markets</Link>
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <SearchInput
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full vsm:w-[260px]"
                  placeholder="Search your holdings"
                  icon={<LucideSearch className="size-3.5" />}
                  aria-label="Search holdings"
                />

                <DataTable
                  data={filteredData}
                  columns={columns}
                  handleRowClick={(id) => router.push(`/markets/${id}`)}
                  isLoading={isLoading}
                  skeletonRows={5}
                  placeholder="No holdings match that search"
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Portfolio;
