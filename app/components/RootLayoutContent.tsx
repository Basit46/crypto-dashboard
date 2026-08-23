"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import ChangeAvatar from "./ChangeAvatar";
import { AddToPortfolioModal } from "./AddToPortfolio";

const RootLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 1 },
        },
      })
  );
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-svh w-full overflow-hidden">
        <Sidebar />
        {/* min-w-0 keeps wide tables from stretching the flex track. */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>

      {/* Portals — outside the layout flow. */}
      <ChangeAvatar />
      <AddToPortfolioModal />
    </QueryClientProvider>
  );
};

export default RootLayoutContent;
