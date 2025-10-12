"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { TOKEN } from "../utils/constant";

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null;

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axiosInstance.get("/me");
      return res.data.user;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem(TOKEN),
    retry: false, // Don't retry on 401 errors
  });
};

export default useUser;
