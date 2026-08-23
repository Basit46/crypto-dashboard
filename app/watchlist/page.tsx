"use client";

import React, { useMemo, useState } from "react";
import { LucideSearch, LucideStar } from "lucide-react";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { AssetType } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRemoveFromWatchlist } from "../lib/mutations";
import { useGetAllCoins, useGetWatchlist } from "../lib/query";
import useUser from "../hooks/useUser";
import PageHeader from "../components/PageHeader";
import { AssetCell } from "../components/AssetCell";
import { Delta } from "../components/Delta";
import { Sparkline } from "../components/Sparkline";
import { EmptyState, SignInGate } from "../components/States";
import { formatCompact, formatPrice } from "../utils";

const Watchlist = () => {
  const router = useRouter();
  const { data: user } = useUser();
  const userId = user?._id;
  const { data: coins = [], isLoading: coinsLoading } = useGetAllCoins();
  const { data: watchlist, isLoading: watchlistLoading } = useGetWatchlist();
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist();

  const [searchValue, setSearchValue] = useState("");

  const isLoading = coinsLoading || watchlistLoading;

  const watchlistAssets = useMemo(
    () => coins.filter((coin: AssetType) => watchlist?.includes(coin.id)),
    [coins, watchlist]
  );

  const handleRowClick = (id: string) => router.push(`/markets/${id}`);

  const columns: ColumnDef<AssetType>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Asset",
        cell: ({ row }) => (
          <AssetCell
            image={row.original.image}
            name={row.original.name}
            symbol={row.original.symbol}
            rank={row.original.market_cap_rank}
          />
        ),
      },
      {
        accessorKey: "current_price",
        header: "Price",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="font-mono text-base tabular-nums text-ink">
            {formatPrice(row.original.current_price)}
          </span>
        ),
      },
      {
        accessorKey: "price_change_percentage_24h",
        header: "24h",
        meta: { align: "right" },
        cell: ({ row }) => (
          <Delta value={row.original.price_change_percentage_24h} plain />
        ),
      },
      {
        accessorKey: "price_change_percentage_7d_in_currency",
        header: "7d",
        meta: { align: "right", className: "hidden lg:table-cell" },
        cell: ({ row }) => (
          <Delta
            value={row.original.price_change_percentage_7d_in_currency}
            plain
          />
        ),
      },
      {
        accessorKey: "total_volume",
        header: "Volume 24h",
        meta: { align: "right", className: "hidden sm:table-cell" },
        cell: ({ row }) => (
          <span className="font-mono text-base tabular-nums text-ink-muted">
            {formatCompact(row.original.total_volume)}
          </span>
        ),
      },
      {
        id: "trend",
        header: "Last 7 days",
        meta: { align: "right", className: "hidden md:table-cell" },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Sparkline
              data={row.original.sparkline_in_7d?.price}
              positive={
                (row.original.price_change_percentage_7d_in_currency ?? 0) >= 0
              }
              width={96}
              height={28}
            />
          </div>
        ),
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
              removeFromWatchlist(row.original.id);
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
    if (!query) return watchlistAssets;

    return watchlistAssets.filter(
      (asset: AssetType) =>
        asset.name.toLowerCase().includes(query) ||
        asset.symbol.toLowerCase().includes(query)
    );
  }, [watchlistAssets, searchValue]);

  return (
    <>
      <PageHeader
        title="Watchlist"
        caption={
          userId && !isLoading
            ? `${watchlistAssets.length} asset${
                watchlistAssets.length === 1 ? "" : "s"
              } followed`
            : undefined
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 vsm:p-6">
        {!userId ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-line bg-surface">
            <SignInGate label="Your watchlist is private to your account." />
          </div>
        ) : !isLoading && watchlistAssets.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-line bg-surface">
            <EmptyState
              icon={LucideStar}
              title="Nothing on your watchlist"
              description="Follow assets from the markets table to keep their price and momentum in one place."
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
              placeholder="Search your watchlist"
              icon={<LucideSearch className="size-3.5" />}
              aria-label="Search watchlist"
            />

            <DataTable
              data={filteredData}
              columns={columns}
              handleRowClick={handleRowClick}
              isLoading={isLoading}
              skeletonRows={5}
              placeholder="No assets match that search"
            />
          </>
        )}
      </div>
    </>
  );
};

export default Watchlist;
