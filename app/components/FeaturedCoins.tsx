"use client";

import { Badge } from "@/components/ui/badge";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import { AssetType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { LucideArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const FeaturedCoins = () => {
  const router = useRouter();

  const { data = [], isLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axiosCoingeckoApi("/coins/markets?vs_currency=usd");
      return res.data;
    },
  });

  const assets = data.slice(0, 3);

  return (
    <div className="w-[70%] h-[220px] flex flex-col justify-between gap-[20px]">
      <h1 className="text-[24px] text-grey-800">Market leaders</h1>

      <div className="flex-1 flex gap-3">
        {assets.map((asset: AssetType) => {
          const isUp = asset?.price_change_percentage_24h > 0;

          return (
            <div
              key={asset?.id}
              className="w-full p-[16px] border border-grey-100 h-full flex flex-col justify-between shadow-sm rounded-[12px]"
            >
              <div className="flex items-center justify-between">
                <Image
                  src={asset.image}
                  width={30}
                  height={30}
                  alt={asset.name}
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
                ${asset?.current_price?.toLocaleString()}
              </p>

              <div className="flex items-center gap-[8px]">
                <Badge variant={isUp ? "secondary" : "destructive"}>
                  {asset?.price_change_percentage_24h}%
                </Badge>
                <p className="text-[12px] text-grey-500">
                  {isUp ? "gain" : "loss"} for{" "}
                  <span className="uppercase">{asset?.symbol}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCoins;
