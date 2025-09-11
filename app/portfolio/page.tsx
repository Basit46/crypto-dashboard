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

type AssetType = {
  logo: string;
  name: string;
  symbol: string;
  price: number; // Current price
  holdings: number; // Amount user owns
  costBasis: number; // Average buy price
};

const Portfolio = () => {
  const [searchValue, setSearchValue] = useState("");

  const assets: AssetType[] = [
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      price: 1029.9,
      holdings: 2, // 2 ETH
      costBasis: 950, // Bought at $950 avg
    },
    {
      logo: "",
      name: "Bitcoin",
      symbol: "BTC",
      price: 25439.5,
      holdings: 0.1, // 0.1 BTC
      costBasis: 30000, // Bought at $30k avg
    },
  ];

  const columns: ColumnDef<AssetType>[] = [
    {
      accessorKey: "name",
      header: "Asset",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Image src="/eth.png" width={28} height={28} alt="coin" />
          <div>
            <p className="text-grey-700 leading-none">{row.original.name}</p>
            <p className="text-grey-700 text-xs font-medium">
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
          ${row.original.price.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "holdings",
      header: "Holdings",
      cell: ({ row }) => (
        <span className="text-grey-700">
          {row.original.holdings} {row.original.symbol}
        </span>
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        const value = row.original.holdings * row.original.price;
        return (
          <span className="text-grey-700">
            ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      accessorKey: "costBasis",
      header: "Cost Basis",
      cell: ({ row }) => (
        <span className="text-grey-700">${row.original.costBasis}</span>
      ),
    },
    {
      accessorKey: "profit",
      header: "P/L",
      cell: ({ row }) => {
        const currentValue = row.original.price * row.original.holdings;
        const investedValue = row.original.costBasis * row.original.holdings;
        const profit = currentValue - investedValue;
        const profitPct = ((profit / investedValue) * 100).toFixed(2);

        return (
          <Badge variant={profit >= 0 ? "secondary" : "destructive"}>
            {profit >= 0 ? "+" : ""}${profit.toFixed(2)} ({profitPct}%)
          </Badge>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <div className="w-fit px-[6px] py-[2px] border border-grey-300 rounded-[6px]">
          <LucideEllipsis className="size-[16px] text-grey-500" />
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    if (!assets) return [];
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
  }, [assets, searchValue]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="w-full px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-grey-900">Portfolio</h1>

        <div className="flex items-center gap-[20px]">
          <SearchBar />
          <UserProfile />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full px-[30px] py-[20px] overflow-y-auto">
        <div className="">
          <div className="mb-[16px] flex items-center justify-between">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-[300px]"
              placeholder="Search asset..."
            />
            <Button>Add to Portfolio</Button>
          </div>

          <div className="scrollbar-hide flex-1 overflow-y-auto">
            <DataTable
              data={filteredData}
              columns={columns}
              handleRowClick={(id) => console.log(id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
