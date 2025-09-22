"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { TOKEN } from "../utils/constant";

const useUser = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null;

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/me");
      return res.data.user;
    },
    enabled: !!token,
  });
};

export default useUser;
