"use client";

import { Button } from "@/components/ui/button";
import { LucideArrowUpRight, LucideBookImage } from "lucide-react";
import Image from "next/image";
import React from "react";

const CollectiblesOverview = () => {
  return (
    <div className="w-[70%] h-[300px] flex flex-col gap-[20px] border border-grey-100 shadow-sm rounded-[12px] p-[16px]">
      <div className="flex items-center justify-between">
        <div className="size-[30px] rounded-[6px] border border-grey-300 shadow-sm grid place-items-center">
          <LucideBookImage className="size-[20px] text-grey-900" />
        </div>
        <p className="flex-1 ml-[10px] text-[18px]">Discover NFTs</p>

        <button className="size-[28px] rounded-full shadow-sm border border-grey-300 grid place-items-center">
          <LucideArrowUpRight className="size-[16px] text-grey-700" />
        </button>
      </div>

      <div className="w-full flex-1 overflow-x-auto flex gap-[20px]">
        {Array.from({ length: 4 }).map((item, i) => (
          <div
            key={i}
            className="shrink-0 w-[200px] h-full flex flex-col hover:bg-grey-100 p-[6px] duration-300 rounded-[14px]"
          >
            <div className="relative w-full h-[50%] rounded-[12px] overflow-hidden">
              <Image
                src="/pudgy.png"
                fill
                priority
                className="object-cover"
                alt="collectible"
              />
            </div>
            <div className="pt-[4px] flex-1 flex flex-col">
              <p className="text-grey-900 font-semibold">Pudgy Penguins</p>
              <p className="text-[14px] text-grey-500">By Pudgy labs</p>
              <div className="mt-auto flex items-center justify-between">
                <p>$2000</p>
                <Button className="h-[32px]">Buy</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectiblesOverview;
