"use client";

import { LucideWallet2 } from "lucide-react";
import React from "react";
import { useGetPortfolio } from "../lib/query";

const BalanceCard = () => {
  const { assets } = useGetPortfolio();

  const totalValue = assets?.reduce((acc, asset) => {
    return acc + asset.value;
  }, 0);
  const totalprevValue = assets?.reduce((acc, asset) => {
    return acc + asset.prevValue;
  }, 0);

  const changeAmount = totalValue - totalprevValue;
  const changePercent = (changeAmount / totalprevValue) * 100;

  //Get the name of the highest valued asset
  const maxValue = Math.max(...assets.map((asset) => asset.value));
  const bestAsset = assets.find((asset) => asset.value === maxValue)?.name;

  return (
    <div className="flex flex-col justify-between flex-1 p-[16px] h-[220px] border border-grey-100 shadow-sm rounded-[12px]">
      <div className="flex items-center justify-between">
        <div className="size-[30px] rounded-[6px] border border-grey-300 shadow-sm grid place-items-center">
          <LucideWallet2 className="size-[20px] text-grey-900" />
        </div>
        <p className="flex-1 ml-[10px] text-[18px]">My Balance</p>
      </div>

      <p className="text-grey-900 font-semibold text-[32px]">
        ${totalValue?.toLocaleString()}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-grey-400 leading-none">Total Profit</p>
          <p className="font-semibold">
            {changeAmount >= 0 ? "+" : "-"}$
            {changeAmount?.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            ({changePercent >= 0 ? "+" : ""}
            {changePercent?.toFixed(2)}%)
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-grey-400 leading-none">Best Token</p>
          <p className="font-semibold">{bestAsset}</p>
        </div>
      </div>

      {/* <div className="flex gap-[12px]">
        <Button className="w-full h-[40px]">
          <LucideBanknoteArrowDown />
          <p>Top Up</p>
        </Button>
        <Button variant="outline" className="w-full h-[40px]">
          <LucideBanknoteArrowUp />
          <p>Withdraw</p>
        </Button>
      </div> */}
    </div>
  );
};

export default BalanceCard;
