"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const RootLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen flex">
        <Sidebar />
        <div className="w-[calc(100vw-240px)]">{children}</div>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayoutContent;
