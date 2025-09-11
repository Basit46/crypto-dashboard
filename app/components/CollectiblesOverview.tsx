"use client";

import { Button } from "@/components/ui/button";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import { useQuery } from "@tanstack/react-query";
import { LucideArrowUpRight, LucideBookImage } from "lucide-react";
import Image from "next/image";
import React from "react";
import Collectible from "./Collectible";

const CollectiblesOverview = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["collectibles"],
    queryFn: async () => {
      const res = await axiosCoingeckoApi("/nfts/list");
      return res.data.slice(0, 10);
    },
  });

  return (
    <div className="w-[70%] h-[300px] flex flex-col gap-[20px] border border-grey-100 shadow-sm rounded-[12px] p-[16px]">
      <div className="flex items-center justify-between">
        <div className="size-[30px] rounded-[6px] border border-grey-300 shadow-sm grid place-items-center">
          <LucideBookImage className="size-[20px] text-grey-900" />
        </div>
        <p className="flex-1 ml-[10px] text-[18px]">Discover NFTs</p>

        {/* <button className="size-[28px] rounded-full shadow-sm border border-grey-300 grid place-items-center">
          <LucideArrowUpRight className="size-[16px] text-grey-700" />
        </button> */}
      </div>

      <div className="w-full flex-1 overflow-x-auto">
        <div className="h-full flex gap-[20px]">
          {data.map((item: any, i: number) => (
            <Collectible key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectiblesOverview;
