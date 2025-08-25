import { Badge } from "@/components/ui/badge";
import {
  LucideArrowUpRight,
  LucideEllipsis,
  LucideWallet2,
} from "lucide-react";
import Image from "next/image";
import React from "react";

const PortfolioCard = () => {
  return (
    <div className="flex-1 p-[16px] h-[300px] flex flex-col justify-between border border-grey-100 shadow-sm rounded-[12px]">
      <div className="flex items-center justify-between">
        <div className="size-[30px] rounded-[6px] border border-grey-300 shadow-sm grid place-items-center">
          <LucideWallet2 className="size-[20px] text-grey-900" />
        </div>
        <p className="flex-1 ml-[10px] text-[18px]">My Portfolio</p>
        <button className="size-[28px] rounded-full shadow-sm border border-grey-300 grid place-items-center">
          <LucideArrowUpRight className="size-[16px] text-grey-700" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[28px] font-bold">3</p>
          <p className="text-grey-500">Total Assets</p>
        </div>

        <div className="flex items-center gap-[8px]">
          <Badge variant="secondary">+4.77%</Badge>
          <p className="text-[12px] text-grey-500">profit in last 30 days</p>
        </div>
      </div>

      <div>
        {Array.from({ length: 3 }).map((item, i) => (
          <div
            key={i}
            className="pt-[10px] pb-[10px] last:pb-0 border-b border-b-grey-100 last:border-b-transparent flex items-center justify-between gap-2"
          >
            <Image src="/btc.png" width={36} height={36} alt="coin" />
            <div className="flex-1">
              <p className="text-grey-500 text-[14px]">Bitcoin (Btc)</p>
              <div className="flex items-center gap-2">
                <p className="leading-none">$120,699.19</p>
                <Badge variant="secondary">+4.77%</Badge>
              </div>
            </div>
            <div className="px-[6px] py-[2px] border border-grey-300 rounded-[6px]">
              <LucideEllipsis className="size-[16px] text-grey-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioCard;
