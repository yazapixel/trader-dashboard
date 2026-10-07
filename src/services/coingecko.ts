/**
 * CoinGecko API service — completely free, no API key required
 * Used for crypto prices, 24h stats, and OHLCV chart data
 * Docs: https://www.coingecko.com/api/documentation
 */

import type { Candle } from '../types/trading';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Map our instrument IDs to CoinGecko coin IDs
export const COINGECKO_IDS: Record<string, string> = {
  BTCUSD: 'bitcoin',
  ETHUSD: 'ethereum',
  SOLUSD: 'solana',
};

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  market_cap: number;
}

export interface CoinGeckoOHLC {
  // [timestamp, open, high, low, close]
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
}

async function fetchCoinGecko<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function fetchCryptoMarkets(ids: string[]): Promise<CoinGeckoMarket[]> {
  if (!ids.length) return [];
  const data = await fetchCoinGecko<CoinGeckoMarket[]>('/coins/markets', {
    vs_currency: 'usd',
    ids: ids.join(','),
    order: 'market_cap_desc',
    per_page: String(ids.length),
    page: '1',
    sparkline: 'false',
    price_change_percentage: '24h',
  });
  return data ?? [];
}

// CoinGecko OHLC days param: 1=48 candles (30min), 7=168 candles (4h), 14=336 candles (4h), 30=30 candles (daily), max=daily
export async function fetchCryptoOHLC(coinId: string, days: number): Promise<Candle[] | null> {
  // Returns array of [timestamp, open, high, low, close]
  const raw = await fetchCoinGecko<number[][]>(`/coins/${coinId}/ohlc`, {
    vs_currency: 'usd',
    days: String(days),
  });
  if (!raw) return null;

  return raw.map(([ts, o, h, l, c]) => ({
    timestamp: ts,
    open: o,
    high: h,
    low: l,
    close: c,
    volume: 0, // OHLC endpoint does not return volume
  }));
}

// Map our timeframe to CoinGecko days param
export function timeframeToCoinGeckoDays(timeframe: string): number {
  switch (timeframe) {
    case '1m':
    case '5m':
      return 1;   // 30-min granularity for 1 day
    case '15m':
      return 1;
    case '1h':
      return 7;   // 4-hour granularity for 7 days
    case '4h':
      return 14;
    case '1d':
      return 30;  // daily candles
    default:
      return 1;
  }
}
