"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import ChangeAvatar from "./ChangeAvatar";
import { AddToPortfolioModal } from "./AddToPortfolio";

const RootLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/auth");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen flex">
        <Sidebar />

        <div
          className={`${
            hideSidebar ? "w-full h-full" : "w-[calc(100vw-240px)] h-full"
          }`}
        >
          {children}
        </div>

        {/* Doesn't afffect layout */}
        <ChangeAvatar />
        <AddToPortfolioModal />
      </div>
    </QueryClientProvider>
  );
};

export default RootLayoutContent;
