"use client";

import React, { useMemo, useState } from "react";
import UserProfile from "../components/UserProfile";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetPortfolio } from "../lib/query";
import { useRouter } from "next/navigation";
import { useRemoveFromPortfolio } from "../lib/mutations";

const Portfolio = () => {
  const router = useRouter();
  const { assets, isLoading } = useGetPortfolio();
  const { mutate: removeFromPortfolio } = useRemoveFromPortfolio();

  const [searchValue, setSearchValue] = useState("");

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Asset",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Image src={row.original.image} width={28} height={28} alt="coin" />
          <div>
            <p className="text-grey-700 leading-none">{row.original?.name}</p>
            <p className="text-grey-700 text-xs font-medium uppercase">
              {row.original?.symbol}
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
          ${row.original.price?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "holdings",
      header: "Holdings",
      cell: ({ row }) => (
        <span className="text-grey-700">
          {row.original?.holdings}{" "}
          <span className="uppercase">{row.original?.symbol}</span>
        </span>
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        return (
          <span className="text-grey-700">
            $
            {row.original?.value?.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "cost",
      header: "Cost Basis",
      cell: ({ row }) => (
        <span className="text-grey-700">${row.original?.cost}</span>
      ),
    },
    {
      accessorKey: "profit",
      header: "P/L",
      cell: ({ row }) => {
        const currentValue = row.original?.value;
        const investedValue = row.original?.prevValue;
        const profit = currentValue - investedValue;
        const profitPct = ((profit / investedValue) * 100).toFixed(2);

        return (
          <Badge variant={profit >= 0 ? "secondary" : "destructive"}>
            ${profit?.toFixed(2)} ({parseFloat(profitPct) >= 0 ? "+" : ""}
            {profitPct}%)
          </Badge>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeFromPortfolio(row.original.id);
          }}
          className="text-red-600"
        >
          Remove
        </button>
      ),
    },
  ];

  const handleRowClick = (id: string) => {
    router.push(`/markets/${id}`);
  };

  const filteredData = useMemo(() => {
    if (!assets) return [];
    return assets.filter((asset: any) =>
      asset.name?.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
  }, [assets, searchValue]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="w-full px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-grey-900">Portfolio</h1>

        <UserProfile />
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

export default Portfolio;
