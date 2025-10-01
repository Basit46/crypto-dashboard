"use client";

import Chart from "@/app/components/Chart";
import UserProfile from "@/app/components/UserProfile";
import {
  useAddToWatchlist,
  useRemoveFromPortfolio,
  useRemoveFromWatchlist,
} from "@/app/lib/mutations";
import { useGetPortfolio, useGetWatchlist } from "@/app/lib/query";
import { useGlobalStore } from "@/app/store/globalStore";
import { Button } from "@/components/ui/button";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import { useQuery } from "@tanstack/react-query";
import { LucideChevronLeft, LucideStar } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const CoinDetails = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { setIsAddToPortfolioOpen, setAddToPortfolioId } = useGlobalStore();
  const { assets: portfolio } = useGetPortfolio();
  const { data: watchlist = [] } = useGetWatchlist();
  const { mutate: addToWatchlist } = useAddToWatchlist();
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist();
  const { mutate: removeFromPortfolio } = useRemoveFromPortfolio();

  const [section, setSection] = useState("0");
  const [timeframe, setTimeframe] = useState<"7" | "30" | "365">("365");

  const { data = {}, isLoading } = useQuery({
    queryKey: ["markets", id],
    queryFn: async () => {
      const res = await axiosCoingeckoApi(`/coins/${id}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 12,
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 w-full px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <div
          role="button"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <div className="size-[40px] border border-grey-200 rounded-full grid place-items-center">
            <LucideChevronLeft className="size-[20px] text-grey-700" />
          </div>
          <p className="text-[20px] text-grey-700 font-medium">Back</p>
        </div>

        <UserProfile />
      </div>

      <div className="flex-1 w-full px-[30px] flex gap-[20px] overflow-y-auto">
        <div className="w-[25%] h-full pr-[30px] pt-[30px] border-r border-r-grey-200 overflow-y-auto">
          <div className="flex items-center gap-2">
            <Image src={data?.image?.small} width={40} height={40} alt="coin" />
            <h1 className="text-[24px] text-grey-700 font-medium">
              {data?.name}{" "}
              <span className="text-[16px] text-grey-500 font-normal">
                {data?.symbol}
              </span>
            </h1>
          </div>
          <div className="mt-[10px] flex items-center gap-[10px]">
            <p className="text-[28px] text-grey-800 font-medium">
              ${data.market_data?.current_price?.usd?.toLocaleString()}
            </p>
            <p
              className={`${
                data?.market_data?.price_change_percentage_24h
                  ?.toString()
                  .includes("-")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {data?.market_data?.price_change_percentage_24h?.toFixed(2)}%
            </p>
            <p className="text-grey-500">(24h)</p>
          </div>

          <div className="mt-[30px]">
            {!portfolio.find((item) => item.coinId == id) ? (
              <Button
                variant={"outline"}
                onClick={() => {
                  setIsAddToPortfolioOpen(true);
                  setAddToPortfolioId(id);
                }}
                className="w-full h-[44px] flex justify-start items-center gap-[12px]"
              >
                <LucideStar className="!size-[20px] text-indigo-600" />
                <p className="text-[18px] text-indigo-600 font-normal">
                  Add to portfolio
                </p>
              </Button>
            ) : (
              <Button
                variant={"outline"}
                onClick={() => {
                  removeFromPortfolio(id);
                }}
                className="w-full h-[44px] flex justify-start items-center gap-[12px]  border-red-500 hover:bg-red-25"
              >
                <LucideStar className="!size-[20px] text-red-600" />
                <p className="text-[18px] text-red-600 font-normal">
                  Remove from portfolio
                </p>
              </Button>
            )}

            {!watchlist?.includes(data.id) ? (
              <Button
                onClick={() => addToWatchlist(data.id)}
                variant={"outline"}
                className="mt-[10px] w-full h-[44px] flex justify-start items-center gap-[12px]"
              >
                <LucideStar className="!size-[20px] text-indigo-600" />
                <p className="text-[18px] text-indigo-600 font-normal">
                  Add to watchlist
                </p>
              </Button>
            ) : (
              <Button
                onClick={() => removeFromWatchlist(data.id)}
                variant={"outline"}
                className="mt-[10px] w-full h-[44px] flex justify-start items-center gap-[12px] border-red-500 hover:bg-red-25"
              >
                <LucideStar className="!size-[20px] text-red-500" />
                <p className="text-[18px] text-red-500 font-normal">
                  Remove from watchlist
                </p>
              </Button>
            )}
          </div>

          <div className="mt-[40px] flex flex-col gap-[15px]">
            <div className="w-full flex items-center justify-between pb-[15px] border-b border-b-grey-100">
              <p className="text-grey-500">Market Cap</p>
              <p className="font-medium">
                ${data?.market_data?.market_cap?.usd?.toLocaleString()}
              </p>
            </div>
            <div className="w-full flex items-center justify-between pb-[15px] border-b border-b-grey-100">
              <p className="text-grey-500">Fully Diluted Valuation</p>
              <p className="font-medium">
                $
                {data?.market_data?.fully_diluted_valuation?.usd?.toLocaleString()}
              </p>
            </div>
            <div className="w-full flex items-center justify-between pb-[15px] border-b border-b-grey-100">
              <p className="text-grey-500">Total Volume</p>
              <p className="font-medium">
                ${data?.market_data?.total_volume?.usd?.toLocaleString()}
              </p>
            </div>
            <div className="w-full flex items-center justify-between pb-[15px] border-b border-b-grey-100">
              <p className="text-grey-500">All Time High</p>
              <p className="font-medium">
                ${data?.market_data?.ath?.usd?.toLocaleString()}
              </p>
            </div>
            <div className="w-full flex items-center justify-between pb-[15px] border-b border-b-grey-100">
              <p className="text-grey-500">All Time Low</p>
              <p className="font-medium">
                ${data?.market_data?.atl?.usd?.toLocaleString()}
              </p>
            </div>
            <div className="w-full flex items-center justify-between pb-[15px] border-b border-b-grey-100">
              <p className="text-grey-500">Total Supply</p>
              <p className="font-medium">
                ${data?.market_data?.total_supply?.toLocaleString()}
              </p>
            </div>
            <div className="w-full flex items-center justify-between pb-[15px] border-b border-b-grey-100">
              <p className="text-grey-500">Max Supply</p>
              <p className="font-medium">
                ${data?.market_data?.max_supply?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 h-full py-[30px] pb-[40px] flex flex-col space-y-[20px]">
          <div className="flex justify-between items-center">
            <div className="chart-btns w-fit h-[40px] bg-grey-100 px-[4px] py-[4px] rounded-[8px] flex items-center gap-2">
              <button
                onClick={() => setSection("0")}
                className={section == "0" ? "active" : ""}
              >
                Price
              </button>
              <button
                onClick={() => setSection("1")}
                className={section == "1" ? "active" : ""}
              >
                Market Cap
              </button>
              <button
                onClick={() => setSection("2")}
                className={section == "2" ? "active" : ""}
              >
                Total Volume
              </button>
            </div>

            <div className="chart-btns w-fit h-[40px] bg-grey-100 px-[4px] py-[4px] rounded-[8px] flex items-center gap-2">
              <button
                onClick={() => setTimeframe("7")}
                className={timeframe == "7" ? "active" : ""}
              >
                7 days
              </button>
              <button
                onClick={() => setTimeframe("30")}
                className={timeframe == "30" ? "active" : ""}
              >
                1 month
              </button>
              <button
                onClick={() => setTimeframe("365")}
                className={timeframe == "365" ? "active" : ""}
              >
                1 year
              </button>
            </div>
          </div>

          <div className="h-full w-full">
            <Chart
              timeframe={timeframe}
              section={
                section == "0"
                  ? "prices"
                  : section == "1"
                  ? "market_caps"
                  : "total_volumes"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
