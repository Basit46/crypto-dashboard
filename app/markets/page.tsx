"use client";

import React, { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import UserProfile from "../components/UserProfile";
import Image from "next/image";
import { LucideArrowUpRight, LucideEllipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
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

const Markets = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axiosCoingeckoApi("/coins/markets?vs_currency=usd");
      return res.data;
    },
  });

  const columns: ColumnDef<AssetType>[] = [
    {
      accessorKey: "name",
      header: "Assets",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Image src={row.original.image} width={28} height={28} alt="coin" />
          <div>
            <p className="text-grey-700 leading-none">{row.original.name}</p>
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
      accessorKey: "market_cap",
      header: "Market cap",
      cell: ({ row }) => (
        <span className="text-grey-700">
          ${row.original.market_cap?.toLocaleString()}
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
      accessorKey: "high_24h",
      header: "24h High",
      cell: ({ row }) => (
        <span className="text-grey-700 text-center">
          ${row.original.high_24h?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "low_24h",
      header: "24h Low",
      cell: ({ row }) => (
        <span className="text-grey-700 text-center">
          ${row.original.low_24h?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "price_change_percentage_24h",
      header: "Change (24h)",
      cell: ({ row }) => (
        <Badge
          variant={
            !row.original.price_change_percentage_24h.toString().includes("-")
              ? "secondary"
              : "destructive"
          }
        >
          {row.original.price_change_percentage_24h?.toFixed(2)}%
        </Badge>
      ),
    },
    {
      accessorKey: "",
      header: "Action",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
            <div className="w-fit px-[6px] py-[2px] border border-grey-300 rounded-[6px]">
              <LucideEllipsis className="size-[16px] text-grey-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{row.original.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleRowClick(row.original.id)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Add to watchlist
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Add to portfolio
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleRowClick = (id: string) => {
    router.push(`/markets/${id}`);
  };

  const filteredData = useMemo(() => {
    if (!assets) return [];

    return assets.filter((asset: AssetType) =>
      asset.name.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
  }, [assets, searchValue]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-grey-900">
          Market Overview
        </h1>

        <div className="flex items-center gap-[20px]">
          <SearchBar />

          <UserProfile />
        </div>
      </div>

      <div className="flex-1 w-full px-[30px] py-[20px] overflow-y-auto">
        <div>
          <div>
            <h1 className="text-[24px] text-grey-800">Most Traded Assets</h1>
            <div className="mt-[12px] flex gap-[20px]">
              {assets.slice(0, 5).map((asset: AssetType) => {
                const isUp = asset?.price_change_percentage_24h > 0;
                return (
                  <div
                    key={asset?.id}
                    className="w-full p-[16px] border border-grey-100 h-[150px] flex flex-col justify-between shadow-sm rounded-[12px]"
                  >
                    <div className="flex items-center justify-between">
                      <Image
                        src={asset?.image}
                        width={30}
                        height={30}
                        alt={asset?.name}
                      />
                      <p className="flex-1 mx-[6px]">
                        {asset?.name}{" "}
                        <span className="uppercase">({asset?.symbol})</span>
                      </p>
                      <button
                        onClick={() => router.push(`/markets/${asset.id}`)}
                        className="size-[28px] rounded-full shadow-sm border border-grey-300 grid place-items-center"
                      >
                        <LucideArrowUpRight className="size-[16px] text-grey-700" />
                      </button>
                    </div>

                    <p className="text-grey-900 font-semibold text-[32px]">
                      ${asset?.current_price}
                    </p>

                    <div className="flex items-center gap-[8px]">
                      <Badge variant={isUp ? "secondary" : "destructive"}>
                        {asset?.price_change_percentage_24h?.toFixed(2)}%
                      </Badge>
                      <p className="text-[12px] text-grey-500">
                        {isUp ? "gain" : "loss"} for ETH
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-[24px]">
            <h1 className="text-[24px] text-grey-800">Asset Market</h1>

            <div className="mt-[20px] mb-[16px] flex items-center justify-between">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-[300px]"
                placeholder="Search asset..."
              />
            </div>

            <div className="scrollbar-hide flex-1 overflow-y-auto">
              {!isLoading && (
                <DataTable
                  data={filteredData}
                  columns={columns}
                  handleRowClick={handleRowClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
