"use client";

import React, { useMemo, useState } from "react";
import { LucideMoreHorizontal, LucideSearch } from "lucide-react";
import { SearchInput } from "@/components/ui/input";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { AssetType } from "@/types";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAddToWatchlist,
  useRemoveFromPortfolio,
  useRemoveFromWatchlist,
} from "../lib/mutations";
import { useGetAllCoins, useGetPortfolio, useGetWatchlist } from "../lib/query";
import { useGlobalStore } from "../store/globalStore";
import useUser from "../hooks/useUser";
import PageHeader from "../components/PageHeader";
import { AssetCell } from "../components/AssetCell";
import { Delta } from "../components/Delta";
import { Sparkline } from "../components/Sparkline";
import { formatCompact, formatPrice } from "../utils";

type SortKey = "market_cap" | "price_change_percentage_24h" | "total_volume";

const sorts: { key: SortKey; label: string }[] = [
  { key: "market_cap", label: "Market cap" },
  { key: "total_volume", label: "Volume" },
  { key: "price_change_percentage_24h", label: "Movers" },
];

const Markets = () => {
  const router = useRouter();
  const { setIsAddToPortfolioOpen, setAddToPortfolioId } = useGlobalStore();
  const { data: user } = useUser();
  const userId = user?._id;
  const { data: coins = [], isLoading } = useGetAllCoins();
  const { data: watchlist } = useGetWatchlist();
  const { assets: portfolio } = useGetPortfolio();
  const { mutate: addToWatchlist } = useAddToWatchlist();
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist();
  const { mutate: removeFromPortfolio } = useRemoveFromPortfolio();

  const [searchValue, setSearchValue] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");

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
            watched={watchlist?.includes(row.original.id)}
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
        accessorKey: "price_change_percentage_1h_in_currency",
        header: "1h",
        meta: { align: "right", className: "hidden lg:table-cell" },
        cell: ({ row }) => (
          <Delta
            value={row.original.price_change_percentage_1h_in_currency}
            plain
          />
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
        accessorKey: "market_cap",
        header: "Market cap",
        meta: { align: "right", className: "hidden sm:table-cell" },
        cell: ({ row }) => (
          <span className="font-mono text-base tabular-nums text-ink-muted">
            {formatCompact(row.original.market_cap)}
          </span>
        ),
      },
      {
        accessorKey: "total_volume",
        header: "Volume 24h",
        meta: { align: "right", className: "hidden md:table-cell" },
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
        cell: ({ row }) => {
          const onWatchlist = watchlist?.includes(row.original.id);
          const inPortfolio = portfolio.some(
            (item) => item.coinId === row.original.id
          );

          return (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex justify-end"
            >
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Actions for ${row.original.name}`}
                  className="grid size-7 place-items-center rounded-md border border-line text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink"
                >
                  <LucideMoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>{row.original.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleRowClick(row.original.id)}
                  >
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!userId}
                    className="cursor-pointer"
                    onClick={() =>
                      onWatchlist
                        ? removeFromWatchlist(row.original.id)
                        : addToWatchlist(row.original.id)
                    }
                  >
                    {onWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!userId}
                    className="cursor-pointer"
                    onClick={() => {
                      if (inPortfolio) {
                        removeFromPortfolio(row.original.id);
                      } else {
                        setAddToPortfolioId(row.original.id);
                        setIsAddToPortfolioOpen(true);
                      }
                    }}
                  >
                    {inPortfolio ? "Remove from portfolio" : "Add to portfolio"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [watchlist, portfolio, userId]
  );

  const filteredData = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    const matched = query
      ? coins.filter(
          (asset: AssetType) =>
            asset.name.toLowerCase().includes(query) ||
            asset.symbol.toLowerCase().includes(query)
        )
      : [...coins];

    return matched.sort(
      (a, b) => (b[sortKey] ?? -Infinity) - (a[sortKey] ?? -Infinity)
    );
  }, [coins, searchValue, sortKey]);

  return (
    <>
      <PageHeader
        title="Markets"
        caption={
          isLoading ? "Loading assets…" : `${coins.length} assets tracked`
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 vsm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="segmented" role="group" aria-label="Sort assets by">
            {sorts.map((sort) => (
              <button
                key={sort.key}
                type="button"
                onClick={() => setSortKey(sort.key)}
                data-active={sortKey === sort.key}
              >
                {sort.label}
              </button>
            ))}
          </div>

          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full vsm:w-[260px]"
            placeholder="Search by name or ticker"
            icon={<LucideSearch className="size-3.5" />}
            aria-label="Search assets"
          />
        </div>

        <DataTable
          data={filteredData}
          columns={columns}
          handleRowClick={handleRowClick}
          isLoading={isLoading}
          skeletonRows={12}
          placeholder="No assets match that search"
        />
      </div>
    </>
  );
};

export default Markets;
