"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const RootLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayoutContent;
