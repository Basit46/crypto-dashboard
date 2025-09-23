import useUser from "@/app/hooks/useUser";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

//GET all coins from coingecko
export const useGetAllCoins = () => {
  return useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axiosCoingeckoApi("/coins/markets?vs_currency=usd");
      return res.data;
    },
  });
};

//GET all watchlist coin Ids
export const useGetWatchlist = () => {
  const { data } = useUser();
  const userId = data?._id;

  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/watchlist?userId=${userId}`);
      return res.data.watchlist;
    },
  });
};
