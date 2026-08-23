"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LucideArrowUpRight, LucideSearch } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AssetType } from "@/types";
import { useRouter } from "next/navigation";
import { useGetAllCoins, useGetWatchlist } from "../lib/query";
import DataTable from "./DataTable";
import { AssetCell } from "./AssetCell";
import { Delta } from "./Delta";
import { Sparkline } from "./Sparkline";
import { formatCompact, formatPrice } from "../utils";

const MarketOverview = () => {
  const router = useRouter();
  const { data = [], isLoading } = useGetAllCoins();
  const { data: watchlist } = useGetWatchlist();

  const [searchValue, setSearchValue] = useState("");

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
        accessorKey: "price_change_percentage_24h",
        header: "24h",
        meta: { align: "right" },
        cell: ({ row }) => (
          <Delta value={row.original.price_change_percentage_24h} plain />
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
        id: "trend",
        header: "7d",
        meta: { align: "right", className: "hidden md:table-cell" },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Sparkline
              data={row.original.sparkline_in_7d?.price}
              positive={
                (row.original.price_change_percentage_7d_in_currency ?? 0) >= 0
              }
              width={80}
              height={26}
            />
          </div>
        ),
      },
    ],
    [watchlist]
  );

  const filteredData = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const coins = data.slice(0, 8);

    if (!query) return coins;

    // Searching reaches past the visible slice — otherwise it only filters the
    // eight rows already on screen, which is not what a search box promises.
    return data
      .filter(
        (asset: AssetType) =>
          asset.name.toLowerCase().includes(query) ||
          asset.symbol.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [data, searchValue]);

  return (
    <Card className="h-full overflow-hidden">
      <div className="flex min-h-[52px] shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2">
        <h2 className="text-base font-semibold text-ink">Market overview</h2>

        <div className="flex items-center gap-2">
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-[180px] lg:w-[220px]"
            placeholder="Search assets"
            icon={<LucideSearch className="size-3.5" />}
            aria-label="Search assets"
          />
          <Link
            href="/markets"
            className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium text-ink-muted transition-colors hover:text-ink"
          >
            All markets
            <LucideArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <DataTable
          data={filteredData}
          columns={columns}
          handleRowClick={(id) => router.push(`/markets/${id}`)}
          isLoading={isLoading}
          skeletonRows={6}
          placeholder={
            searchValue.trim()
              ? "No assets match that search"
              : "Market data is unavailable right now"
          }
          className="rounded-none border-0"
        />
      </div>
    </Card>
  );
};

export default MarketOverview;
