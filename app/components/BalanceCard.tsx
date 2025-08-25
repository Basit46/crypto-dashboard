import { Button } from "@/components/ui/button";
import {
  LucideArrowUpRight,
  LucideBanknoteArrowDown,
  LucideBanknoteArrowUp,
  LucideWallet2,
} from "lucide-react";
import React from "react";

const BalanceCard = () => {
  return (
    <div className="flex flex-col justify-between flex-1 p-[16px] h-[220px] border border-grey-100 shadow-sm rounded-[12px]">
      <div className="flex items-center justify-between">
        <div className="size-[30px] rounded-[6px] border border-grey-300 shadow-sm grid place-items-center">
          <LucideWallet2 className="size-[20px] text-grey-900" />
        </div>
        <p className="flex-1 ml-[10px] text-[18px]">My Balance</p>
        <button className="size-[28px] rounded-full shadow-sm border border-grey-300 grid place-items-center">
          <LucideArrowUpRight className="size-[16px] text-grey-700" />
        </button>
      </div>

      <p className="text-grey-900 font-semibold text-[32px]">$401,934</p>

      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center">
          <p className="text-grey-400 leading-none">Total Profit</p>
          <p className="font-semibold">+$2,787.90</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-grey-400 leading-none">Avg. Growing</p>
          <p className="font-semibold">+14.63%</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-grey-400 leading-none">Best Token</p>
          <p className="font-semibold">Ethereum</p>
        </div>
      </div>

      <div className="flex gap-[12px]">
        <Button className="w-full h-[40px]">
          <LucideBanknoteArrowDown />
          <p>Top Up</p>
        </Button>
        <Button variant="outline" className="w-full h-[40px]">
          <LucideBanknoteArrowUp />
          <p>Withdraw</p>
        </Button>
      </div>
    </div>
  );
};

export default BalanceCard;
