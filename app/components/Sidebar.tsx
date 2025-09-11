"use client";

import {
  LucideBrain,
  LucideChartCandlestick,
  LucideImage,
  LucideLayoutDashboard,
  LucideNewspaper,
  LucidePieChart,
  LucideStar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="sidebar shrink-0 w-[240px] bg-grey-100 h-full px-[20px] py-[20px]">
      <div className="flex gap-[8px] items-center">
        <Image src="/logo.png" width={30} height={30} priority alt="Logo" />
        <p className="text-[24px] font-semibold text-grey-900">CoinVista</p>
      </div>

      <div className="mt-[50px] flex flex-col gap-3">
        <Link
          href="/"
          className={`${pathname == "/" ? "active" : ""} navlink`}
          role="button"
        >
          <LucideLayoutDashboard />
          <p>Dashboard</p>
        </Link>

        <Link
          href="/markets"
          className={`${
            pathname.startsWith("/markets") ? "active" : ""
          } navlink`}
          role="button"
        >
          <LucideChartCandlestick />
          <p>Markets</p>
        </Link>

        <div className="w-full h-[1px] bg-grey-200" />

        <Link
          href="/portfolio"
          className={`${
            pathname.startsWith("/portfolio") ? "active" : ""
          } navlink`}
          role="button"
        >
          <LucidePieChart />
          <p>Portfolio</p>
        </Link>

        <Link
          href="/watchlist"
          className={`${
            pathname.startsWith("/watchlist") ? "active" : ""
          } navlink`}
          role="button"
        >
          <LucideStar />
          <p>Watchlist</p>
        </Link>

        <div className="w-full h-[1px] bg-grey-200" />

        <Link
          href="/ai"
          className={`${pathname.startsWith("/ai") ? "active" : ""} navlink`}
          role="button"
        >
          <LucideBrain />
          <p>CoinVista AI</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
