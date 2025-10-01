"use client";

import React, { useMemo, useState } from "react";
import UserProfile from "../components/UserProfile";
import Image from "next/image";
import { LucideEllipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssetType } from "@/types";
import { useRouter } from "next/navigation";
import { useRemoveFromWatchlist } from "../lib/mutations";
import { useGetAllCoins, useGetWatchlist } from "../lib/query";

const Watchlist = () => {
  const router = useRouter();
  const { data: coins = [], isLoading } = useGetAllCoins();
  const { data: watchlist } = useGetWatchlist();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();

  const [searchValue, setSearchValue] = useState("");

  const watchlistAssets =
    coins?.filter((item: any) => watchlist?.includes(item.id)) || [];

  const handleRowClick = (id: string) => {
    router.push(`/markets/${id}`);
  };

  const columns: ColumnDef<AssetType>[] = [
    {
      accessorKey: "name",
      header: "Asset",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Image src={row.original.image} width={28} height={28} alt="coin" />
          <div>
            <p className="text-grey-700 leading-none">{row.original.name}</p>
            <p className="text-grey-700 text-xs font-medium uppercase">
              {row.original.symbol}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-grey-700">
          ${row.original.current_price.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "FDV",
      header: "FDV",
      cell: ({ row }) => (
        <span className="text-grey-700">
          ${row.original.fully_diluted_valuation?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "volume",
      header: "24h Volume",
      cell: ({ row }) => (
        <span className="text-grey-700">
          {row.original.total_volume?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "change",
      header: "24h Change",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.price_change_percentage_24h >= 0
              ? "secondary"
              : "destructive"
          }
        >
          {row.original.price_change_percentage_24h > 0 ? "+" : ""}
          {row.original.price_change_percentage_24h?.toFixed(2)}%
        </Badge>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-fit px-[6px] py-[2px] border border-grey-300 rounded-[6px]">
                <LucideEllipsis className="size-[16px] text-grey-500" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleRowClick(row.original.id)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() =>
                  removeFromWatchlistMutation.mutate(row.original.id)
                }
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    if (!watchlistAssets) return [];
    return watchlistAssets.filter((asset: AssetType) =>
      asset.name.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
  }, [watchlistAssets, searchValue]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="w-full px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-grey-900">Watchlist</h1>
        <UserProfile />
      </div>

      {/* Content */}
      <div className="flex-1 w-full px-[30px] py-[20px] overflow-y-auto">
        <div>
          <div className="mb-[16px] flex items-center justify-between">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-[300px]"
              placeholder="Search asset..."
            />
          </div>

          <div className="scrollbar-hide flex-1 overflow-y-auto">
            <DataTable
              data={filteredData}
              columns={columns}
              handleRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
