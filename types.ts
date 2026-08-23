export type AssetType = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string; // ISO date
  atl: number;
  atl_change_percentage: number;
  atl_date: string; // ISO date
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string; // ISO date
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  sparkline_in_7d?: { price: number[] } | null;
};

export type PortfolioResType = {
  coinId: string;
  boughtPrice: number;
  amountBought: number;
  _id: string;
};

export type PortfolioType = {
  /** CoinGecko id, attached by useGetPortfolio when it joins market data. */
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  holdings: number;
  cost: number;
  value: number;
  prevValue: number;
  coinId: string;
  boughtPrice: number;
  amountBought: number;
  _id: string;
};
