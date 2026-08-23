"use client";

import BalanceCard from "./components/BalanceCard";
import CollectiblesOverview from "./components/CollectiblesOverview";
import FeaturedCoins from "./components/FeaturedCoins";
import MarketOverview from "./components/MarketOverview";
import MarketStats from "./components/MarketStats";
import PageHeader from "./components/PageHeader";
import PortfolioCard from "./components/PortfolioCard";

const Home = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        caption={today}
        actions={
          <span className="hidden items-center gap-1.5 rounded-md border border-pos-border bg-pos-soft px-2 py-1 text-xs font-medium text-pos vsm:inline-flex">
            <span className="size-1.5 rounded-full bg-pos" />
            Markets open
          </span>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* One grid at every breakpoint — the layout collapses by column span
            rather than by rendering a second copy of the page. */}
        <div className="grid grid-cols-1 gap-4 p-4 vsm:p-6 xl:grid-cols-12">
          <div className="xl:col-span-12">
            <MarketStats />
          </div>

          <div className="xl:col-span-12">
            <FeaturedCoins />
          </div>

          <div className="min-w-0 xl:col-span-8">
            <MarketOverview />
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
            <BalanceCard />
            <PortfolioCard />
          </div>

          <div className="min-w-0 xl:col-span-12">
            <CollectiblesOverview />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
