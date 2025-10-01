"use client";

import { Badge } from "@/components/ui/badge";
import {
  LucideArrowUpRight,
  LucideEllipsis,
  LucideWallet2,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { useGetPortfolio } from "../lib/query";
import { formatNumber } from "../utils";
import { useRouter } from "next/navigation";

const PortfolioCard = () => {
  const { assets } = useGetPortfolio();
  const router = useRouter();

  return (
    <div className="flex-1 p-[16px] h-[300px] flex flex-col gap-3 border border-grey-100 shadow-sm rounded-[12px]">
      <div className="flex items-center justify-between">
        <div className="size-[30px] rounded-[6px] border border-grey-300 shadow-sm grid place-items-center">
          <LucideWallet2 className="size-[20px] text-grey-900" />
        </div>
        <p className="flex-1 ml-[10px] text-[18px]">My Portfolio</p>

        <button
          onClick={() => router.push("/portfolio")}
          className="size-[28px] rounded-full shadow-sm border border-grey-300 grid place-items-center"
        >
          <LucideArrowUpRight className="size-[16px] text-grey-700" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-grey-500">Top Assets</p>
        </div>
      </div>

      <div>
        {assets?.slice(0, 3).map((asset, i) => {
          const currentValue = asset?.value;
          const investedValue = asset?.prevValue;
          const profit = currentValue - investedValue;
          const profitPct = ((profit / investedValue) * 100).toFixed(2);

          return (
            <div
              key={i}
              className="pt-[10px] pb-[10px] last:pb-0 border-b border-b-grey-100 last:border-b-transparent flex items-center justify-between gap-2"
            >
              <Image
                src={asset.image}
                width={36}
                height={36}
                sizes="40px"
                alt="coin"
              />
              <div className="flex-1">
                <p className="text-grey-500 text-[14px]">
                  {asset?.name} (
                  <span className="uppercase">{asset.symbol}</span>)
                </p>
                <div className="flex items-center gap-2">
                  <p className="leading-none">
                    ${asset?.value?.toLocaleString()}
                  </p>
                  <Badge
                    variant={profit >= 0 ? "secondary" : "destructive"}
                    className="w-fit min-w-fit"
                  >
                    ${profit?.toFixed(2)} ({formatNumber(parseFloat(profitPct))}
                    %)
                  </Badge>
                </div>
              </div>
              {/* <div className="px-[6px] py-[2px] border border-grey-300 rounded-[6px]">
                <LucideEllipsis className="size-[16px] text-grey-500" />
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioCard;
