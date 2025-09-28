"use client";

import { Button } from "@/components/ui/button";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const Collectible = ({ item }: { item: any }) => {
  const { data = {}, isLoading } = useQuery({
    queryKey: ["collectibles", item.id],
    queryFn: async () => {
      const res = await axiosCoingeckoApi(`/nfts/${item.id}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 12,
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="w-[200px] shrink-0 h-full flex flex-col hover:bg-grey-100 p-[6px] duration-300 rounded-[14px]">
      <div className="relative w-full h-[50%] rounded-[12px] overflow-hidden">
        <Image
          src={data?.image?.small_2x || "/pudgy.png"}
          fill
          priority
          className="object-cover"
          alt="collectible"
        />
      </div>
      <div className="pt-[4px] flex-1 flex flex-col">
        <p className="text-grey-900 font-semibold">{data?.name}</p>
        <p className="text-[14px] text-grey-500">{data?.symbol}</p>
        <div className="mt-auto flex items-center justify-between">
          <p>${data?.floor_price?.usd?.toLocaleString()}</p>

          <Button
            onClick={() => {
              if (data?.links?.homepage) {
                window.open(
                  data.links.homepage,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
            className="h-[32px]"
          >
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Collectible;
