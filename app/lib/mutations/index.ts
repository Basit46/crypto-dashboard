"use client";

import useUser from "@/app/hooks/useUser";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//Add coin to watchlist
export const useAddToWatchlist = () => {
  const { data } = useUser();
  const userId = data?._id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coinId: string) => {
      const res = await axiosInstance.put(`/watchlist?userId=${userId}`, {
        coinId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
};

//Remove coin from watchlist
export const useRemoveFromWatchlist = () => {
  const { data } = useUser();
  const userId = data?._id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coinId: string) => {
      const res = await axiosInstance.delete(
        `/watchlist?userId=${userId}&coinId=${coinId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
};

//Add coin to wportfolio
export const useAddToPortfolio = () => {
  const { data } = useUser();
  const userId = data?._id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      coinId: string;
      boughtPrice: number;
      amountBought: number;
    }) => {
      const { coinId, boughtPrice = 0, amountBought = 0 } = data;
      const res = await axiosInstance.post(`/portfolio`, {
        coinId,
        userId,
        boughtPrice,
        amountBought,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
};
