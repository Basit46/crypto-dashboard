"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  LucideArrowUpRight,
  LucideEllipsis,
  LucideWarehouse,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import DataTable from "./DataTable";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AssetType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MarketOverview = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axiosCoingeckoApi("/coins/markets?vs_currency=usd");
      return res.data;
    },
  });

  const assets = data?.slice(0, 4);

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
