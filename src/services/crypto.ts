export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap_rank?: number;
};

const COINGECKO_MARKETS_URL = import.meta.env.VITE_COINGECKO_MARKETS_URL || 'https://api.coingecko.com/api/v3/coins/markets';

/**
 * Fetch top N coins markets from CoinGecko
 * per_page max is 250, we'll request 100
 */
export async function fetchTopMarkets(perPage = 100): Promise<CoinMarket[]> {
  const qs = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: String(perPage),
    page: '1',
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  const url = `${COINGECKO_MARKETS_URL}?${qs.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko error ${res.status}`);
  const data = await res.json();
  return data as CoinMarket[];
}
