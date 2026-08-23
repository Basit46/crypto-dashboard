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
      const res = await axiosCoingeckoApi(
        "/coins/markets?vs_currency=usd&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );
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
    enabled: !!userId,
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
      enabled: !!userId,
    }
  );

  const assets = portfolioCoins?.map((asset) => {
    const coin = coins?.find((coin: AssetType) => coin.id == asset.coinId);

    return {
      ...asset,
      id: coin?.id,
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

export type GlobalMarket = {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
};

//GET market-wide aggregates
export const useGetGlobalMarket = () => {
  return useQuery<GlobalMarket>({
    queryKey: ["global"],
    queryFn: async () => {
      const res = await axiosInstance.get("/global");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
