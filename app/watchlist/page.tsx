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
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

type AssetType = {
  logo: string;
  name: string;
  symbol: string;
  FDV: string;
  price: number;
  volume: string;
  change: number;
  chart: any[];
};

const Watchlist = () => {
  const [searchValue, setSearchValue] = useState("");

  const assets: AssetType[] = [
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
    {
      logo: "",
      name: "Ethereum",
      symbol: "ETH",
      FDV: "1.886B",
      price: 1029.9,
      volume: "9.20B",
      change: -2.17,
      chart: [
        {
          name: "Page A",
          value: 2400,
        },
        {
          name: "Page B",
          value: 2210,
        },
        {
          name: "Page C",
          value: 2290,
        },
        {
          name: "Page D",
          value: 2000,
        },
        {
          name: "Page E",
          value: 2181,
        },
        {
          name: "Page F",
          value: 2500,
        },
        {
          name: "Page G",
          value: 2100,
        },
      ],
    },
  ];

  const columns: ColumnDef<AssetType>[] = [
    {
      accessorKey: "name",
      header: "Assets",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Image src="/eth.png" width={28} height={28} alt="coin" />
          <div>
            <p className="text-grey-700 leading-none">{row.original.name}</p>
            <p className="text-grey-700 font-medium">{row.original.symbol}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-grey-700">${row.original.price}</span>
      ),
    },
    {
      accessorKey: "FDV",
      header: "FDV",
      cell: ({ row }) => (
        <span className="text-grey-700">${row.original.FDV}</span>
      ),
    },
    {
      accessorKey: "volume",
      header: "Volume",
      cell: ({ row }) => (
        <span className="text-grey-700 text-center">{row.original.volume}</span>
      ),
    },
    {
      accessorKey: "change",
      header: "Change",
      cell: ({ row }) => (
        <Badge variant={row.original.change > 0 ? "secondary" : "destructive"}>
          {row.original.change}%
        </Badge>
      ),
    },
    {
      accessorKey: "chart",
      header: "Last 7 days",
      cell: ({ row }) => (
        <LineChart width={100} height={30} data={row.original.chart}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--red-600)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      ),
    },
    {
      accessorKey: "",
      header: "Action",
      cell: ({ row }) => (
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
      <div className="w-full px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-grey-900">Watchlist</h1>

        <div className="flex items-center gap-[20px]">
          <SearchBar />

          <UserProfile />
        </div>
      </div>

      <div className="flex-1 w-full px-[30px] py-[20px] overflow-y-auto">
        <div className="">
          <div className="mb-[16px] flex items-center justify-between">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-[300px]"
              placeholder="Search asset..."
            />

            <Button>Add to Watchlist</Button>
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

export default Watchlist;
