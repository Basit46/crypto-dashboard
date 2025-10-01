"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { LucideArrowUpRight, LucideStar, LucideWarehouse } from "lucide-react";
import React, { useMemo, useState } from "react";
import DataTable from "./DataTable";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AssetType } from "@/types";
import { useRouter } from "next/navigation";
import { useGetAllCoins, useGetWatchlist } from "../lib/query";

const MarketOverview = () => {
  const router = useRouter();
  const { data, isLoading } = useGetAllCoins();
  const coins = data?.slice(0, 4);
  const { data: watchlist } = useGetWatchlist();

  const [searchValue, setSearchValue] = useState("");

  const columns: ColumnDef<AssetType>[] = [
    {
      accessorKey: "name",
      header: "Asset",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Image src={row.original.image} width={28} height={28} alt="coin" />
          <div>
            <div className="flex gap-2 items-center">
              <p className="text-grey-700 leading-none">{row.original.name}</p>
              {watchlist?.includes(row.original.id) && (
                <LucideStar
                  className="size-[10px] text-[gold]"
                  fill="currentColor"
                />
              )}
            </div>
            <p className="text-grey-700 font-medium uppercase">
              {row.original.symbol}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "current_price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-grey-700">
          ${row.original.current_price?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "fully_diluted_valuation",
      header: "FDV",
      cell: ({ row }) => (
        <span className="text-grey-700">
          ${row.original.fully_diluted_valuation?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "total_volume",
      header: "Volume",
      cell: ({ row }) => (
        <span className="text-grey-700 text-center">
          ${row.original.total_volume?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "price_change_percentage_24h",
      header: "Change",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.price_change_percentage_24h > 0
              ? "secondary"
              : "destructive"
          }
        >
          {row.original.price_change_percentage_24h?.toFixed(2)}%
        </Badge>
      ),
    },
  ];

  const handleRowClick = (id: string) => {
    router.push(`/markets/${id}`);
  };

  const filteredData = useMemo(() => {
    if (!coins) return [];

    return coins.filter((asset: AssetType) =>
      asset.name.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
  }, [coins, searchValue]);

  return (
    <div className="w-[70%] h-[300px] flex flex-col gap-[20px] border border-grey-100 shadow-sm rounded-[12px] p-[16px]">
      <div className="flex items-center justify-between">
        <div className="size-[30px] rounded-[6px] border border-grey-300 shadow-sm grid place-items-center">
          <LucideWarehouse className="size-[20px] text-grey-900" />
        </div>
        <p className="flex-1 ml-[10px] text-[18px]">Market Overview</p>

        <div className="flex gap-3 items-center">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-[300px]"
            placeholder="Search asset..."
          />
          <button
            onClick={() => router.push("/markets")}
            className="size-[28px] rounded-full shadow-sm border border-grey-300 grid place-items-center"
          >
            <LucideArrowUpRight className="size-[16px] text-grey-700" />
          </button>
        </div>
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <DataTable
          data={filteredData}
          columns={columns}
          handleRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default MarketOverview;
