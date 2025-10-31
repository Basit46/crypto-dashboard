"use client";

import { LucideGem, LucideSidebarClose, LucideSidebarOpen } from "lucide-react";
import FeaturedCoins from "./components/FeaturedCoins";
import BalanceCard from "./components/BalanceCard";
import PortfolioCard from "./components/PortfolioCard";
import MarketOverview from "./components/MarketOverview";
import CollectiblesOverview from "./components/CollectiblesOverview";
import UserProfile from "./components/UserProfile";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "./store/globalStore";

const Home = () => {
  const { showSideBar, setShowSideBar } = useGlobalStore();

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="w-full px-[20px] vsm:px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-grey-900">Dashboard</h1>

        <div className="flex items-center gap-[20px]">
          <div className="hidden vsm:flex px-[12px] h-[36px] border border-grey-200 bg-green-25 items-center gap-[8px] rounded-full">
            <LucideGem className="size-[16px] text-green-700" />
            <p className="text-[14px] text-green-700">Market Online</p>
          </div>

          <UserProfile />
          <Button
            onClick={() => setShowSideBar(!showSideBar)}
            className="size-[40px] xl:hidden"
          >
            {showSideBar ? <LucideSidebarClose /> : <LucideSidebarOpen />}
          </Button>
        </div>
      </div>

      <div className="w-full relative flex-1 overflow-y-auto">
        <div className="hidden xl:flex w-full px-[30px] py-[20px] flex-col gap-[16px]">
          <div className="w-full flex gap-[16px]">
            <FeaturedCoins />
            <BalanceCard />
          </div>
          <div className="w-full flex gap-[16px]">
            <MarketOverview />
            <PortfolioCard />
          </div>
          <div className="w-full max-w-full flex gap-[16px]">
            <CollectiblesOverview />
          </div>
        </div>

        <div className="flex xl:hidden w-full px-[20px] vsm:px-[30px] py-[20px] flex-col gap-[16px]">
          <div className="w-full flex gap-[16px]">
            <FeaturedCoins />
          </div>

          <div className="w-full flex flex-col md:flex-row gap-[16px]">
            <BalanceCard />
            <PortfolioCard />
          </div>
          <div className="hidden vsm:flex w-full gap-[16px]">
            <MarketOverview />
          </div>
          <div className="w-full max-w-full flex gap-[16px]">
            <CollectiblesOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
