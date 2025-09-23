"use client";

import React from "react";
import UserProfile from "../components/UserProfile";

const CoinVistaAI = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-grey-900">CoinVista AI</h1>

        <UserProfile />
      </div>

      <div className="flex-1 w-full px-[30px] py-[20px] overflow-y-auto">
        <div className=""></div>
      </div>
    </div>
  );
};

export default CoinVistaAI;
