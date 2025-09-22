"use client";

import React, { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import UserProfile from "../components/UserProfile";
import Image from "next/image";
import { LucideEllipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUser from "../hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import { AssetType } from "@/types";
import { useRouter } from "next/navigation";

const Watchlist = () => {
  const { data } = useUser();
  const userId = data?._id;
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const { data: watchlist = [] } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/watchlist?userId=${userId}`);
      return res.data.watchlist;
    },
  });

  const { data: assets = [], isLoading } = useQuery<AssetType[]>({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axiosCoingeckoApi("/coins/markets?vs_currency=usd");
      return res.data;
    },
  });

  const watchlistAssets =
    assets?.filter((item) => watchlist?.includes(item.id)) || [];

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
            <DropdownMenuItem>Remove</DropdownMenuItem>
            <DropdownMenuItem>Add to portfolio</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

        <div className="flex items-center gap-[20px]">
          <SearchBar />
          <UserProfile />
        </div>
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
