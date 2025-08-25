"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideArrowUpRight, LucideHandCoins } from "lucide-react";
import React, { useState } from "react";
import { CoinSelect } from "./custom/CoinSelect";

const ExchangeCard = () => {
  const [coin1, setCoin1] = useState("ETH");
  const [coin2, setCoin2] = useState("BTC");

  return (
    <div className="flex-1 p-[16px] h-[300px] flex flex-col justify-between border border-grey-100 shadow-sm rounded-[12px]">
      <div className="flex items-center justify-between">
        <div className="size-[30px] rounded-[6px] border border-grey-300 shadow-sm grid place-items-center">
          <LucideHandCoins className="size-[20px] text-grey-900" />
        </div>
        <p className="flex-1 ml-[10px] text-[18px]">Transaction</p>
        <button className="size-[28px] rounded-full shadow-sm border border-grey-300 grid place-items-center">
          <LucideArrowUpRight className="size-[16px] text-grey-700" />
        </button>
      </div>

      <div className="space-y-[8px]">
        <div>
          <p className="text-grey-500">Trade</p>
          <div className="relative">
            <Input className="h-[48px] pr-[90px]" type="number" />
            <div className="absolute top-1/2 -translate-y-1/2 right-[6px]">
              <CoinSelect value={coin1} onChange={setCoin1} />
            </div>
          </div>
        </div>
        <div>
          <p className="text-grey-500">Received</p>
          <div className="relative">
            <Input className="h-[48px] pr-[90px]" type="number" />
            <div className="absolute top-1/2 -translate-y-1/2 right-[6px]">
              <CoinSelect value={coin2} onChange={setCoin2} />
            </div>
          </div>
        </div>
      </div>

      <Button className="h-[44px]">Trade Now</Button>
    </div>
  );
};

export default ExchangeCard;
