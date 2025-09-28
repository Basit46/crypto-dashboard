import useUser from "@/app/hooks/useUser";
import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import axiosInstance from "@/lib/axiosInstance";
import { AssetType, PortfolioResType, PortfolioType } from "@/types";
import { useQuery } from "@tanstack/react-query";

//GET all coins from coingecko
export const useGetAllCoins = () => {
  return useQuery<AssetType[]>({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axiosCoingeckoApi("/coins/markets?vs_currency=usd");
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 12,
  });
};

//GET all watchlist assets
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

//GET all portfolio assets
export const useGetPortfolio = () => {
  const { data: coins = [] } = useGetAllCoins();
  const { data } = useUser();
  const userId = data?._id;

  const { data: portfolioCoins = [], isLoading } = useQuery<PortfolioResType[]>(
    {
      queryKey: ["portfolio"],
      queryFn: async () => {
        const res = await axiosInstance.get(`/portfolio?userId=${userId}`);
        return res.data.assets;
      },
    }
  );

  const assets = portfolioCoins?.map((asset) => {
    const coin = coins?.find((coin: AssetType) => coin.id == asset.coinId);

    return {
      ...asset,
      name: coin?.name,
      symbol: coin?.symbol,
      image: coin?.image,
      price: coin?.current_price,
      holdings: asset.amountBought,
      cost: asset.boughtPrice,
      value: asset?.amountBought * (coin?.current_price || 1),
      prevValue: asset?.amountBought * (asset?.boughtPrice || 1),
    };
  });

  return { assets: (assets || []) as PortfolioType[], isLoading: isLoading };
};
