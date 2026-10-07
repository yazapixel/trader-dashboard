/**
 * Finnhub API service
 * Free tier: 60 API calls/min, WebSocket real-time quotes
 * Sign up at https://finnhub.io (no credit card required)
 *
 * Symbol mapping:
 *   Forex  → Finnhub uses "OANDA:EUR_USD" format
 *   Crypto → Finnhub uses "BINANCE:BTCUSDT" format
 *   Stocks/Indices → use underlying ETF proxies (SPY, QQQ, DIA, GLD, USO)
 */

import type { Instrument, Candle } from '../types/trading';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY as string | undefined;
const BASE_URL = 'https://finnhub.io/api/v1';
const WS_URL = 'wss://ws.finnhub.io';

export const HAS_FINNHUB_KEY = Boolean(API_KEY && API_KEY !== 'your_finnhub_api_key_here');

// Map our internal instrument IDs to Finnhub WebSocket subscription symbols
export const FINNHUB_SYMBOLS: Record<string, string> = {
  EURUSD:  'OANDA:EUR_USD',
  GBPUSD:  'OANDA:GBP_USD',
  USDJPY:  'OANDA:USD_JPY',
  AUDUSD:  'OANDA:AUD_USD',
  BTCUSD:  'BINANCE:BTCUSDT',
  ETHUSD:  'BINANCE:ETHUSDT',
  SOLUSD:  'BINANCE:SOLUSDT',
  // Indices: use ETF proxies for real-time price movement
  SPX500:  'SPY',
  NAS100:  'QQQ',
  // Commodities
  XAUUSD:  'OANDA:XAU_USD',
  XTIUSD:  'OANDA:USOIL',
};

// Map our instrument IDs to Finnhub candle resolution symbols
export const FINNHUB_CANDLE_SYMBOLS: Record<string, string> = {
  EURUSD:  'OANDA:EUR_USD',
  GBPUSD:  'OANDA:GBP_USD',
  USDJPY:  'OANDA:USD_JPY',
  AUDUSD:  'OANDA:AUD_USD',
  BTCUSD:  'BINANCE:BTCUSDT',
  ETHUSD:  'BINANCE:ETHUSDT',
  SOLUSD:  'BINANCE:SOLUSDT',
  SPX500:  'SPY',
  NAS100:  'QQQ',
  XAUUSD:  'OANDA:XAU_USD',
  XTIUSD:  'OANDA:USOIL',
};

// Finnhub timeframe resolution codes
const RESOLUTION_MAP: Record<string, string> = {
  '1m':  '1',
  '5m':  '5',
  '15m': '15',
  '1h':  '60',
  '4h':  '240',
  '1d':  'D',
};

export interface FinnhubQuote {
  c: number;  // current price
  d: number;  // change
  dp: number; // change percent
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
  t: number;  // timestamp
}

export interface FinnhubCandle {
  c: number[];  // close prices
  h: number[];  // high prices
  l: number[];  // low prices
  o: number[];  // open prices
  t: number[];  // timestamps (unix seconds)
  v: number[];  // volumes
  s: string;    // status: 'ok' or 'no_data'
}

export interface FinnhubNewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

async function fetchFinnhub<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!HAS_FINNHUB_KEY) return null;
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('token', API_KEY!);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function fetchQuote(instrumentId: string): Promise<FinnhubQuote | null> {
  const symbol = FINNHUB_CANDLE_SYMBOLS[instrumentId];
  if (!symbol) return null;
  return fetchFinnhub<FinnhubQuote>('/quote', { symbol });
}

export async function fetchCandles(
  instrumentId: string,
  timeframe: string,
  from: number,
  to: number
): Promise<Candle[] | null> {
  const symbol = FINNHUB_CANDLE_SYMBOLS[instrumentId];
  const resolution = RESOLUTION_MAP[timeframe] ?? '15';
  if (!symbol) return null;

  const data = await fetchFinnhub<FinnhubCandle>('/stock/candle', {
    symbol,
    resolution,
    from: String(Math.floor(from / 1000)),
    to: String(Math.floor(to / 1000)),
  });

  if (!data || data.s !== 'ok' || !data.t?.length) return null;

  return data.t.map((ts, i) => ({
    timestamp: ts * 1000,
    open:   data.o[i],
    high:   data.h[i],
    low:    data.l[i],
    close:  data.c[i],
    volume: data.v[i],
  }));
}

export async function fetchForexCandles(
  instrumentId: string,
  timeframe: string,
  from: number,
  to: number
): Promise<Candle[] | null> {
  const symbol = FINNHUB_CANDLE_SYMBOLS[instrumentId];
  const resolution = RESOLUTION_MAP[timeframe] ?? '15';
  if (!symbol) return null;

  // Forex candles use /forex/candle endpoint
  const data = await fetchFinnhub<FinnhubCandle>('/forex/candle', {
    symbol,
    resolution,
    from: String(Math.floor(from / 1000)),
    to: String(Math.floor(to / 1000)),
  });

  if (!data || data.s !== 'ok' || !data.t?.length) return null;

  return data.t.map((ts, i) => ({
    timestamp: ts * 1000,
    open:   data.o[i],
    high:   data.h[i],
    low:    data.l[i],
    close:  data.c[i],
    volume: data.v[i],
  }));
}

export async function fetchCryptoCandles(
  instrumentId: string,
  timeframe: string,
  from: number,
  to: number
): Promise<Candle[] | null> {
  const symbol = FINNHUB_CANDLE_SYMBOLS[instrumentId];
  const resolution = RESOLUTION_MAP[timeframe] ?? '15';
  if (!symbol) return null;

  const data = await fetchFinnhub<FinnhubCandle>('/crypto/candle', {
    symbol,
    resolution,
    from: String(Math.floor(from / 1000)),
    to: String(Math.floor(to / 1000)),
  });

  if (!data || data.s !== 'ok' || !data.t?.length) return null;

  return data.t.map((ts, i) => ({
    timestamp: ts * 1000,
    open:   data.o[i],
    high:   data.h[i],
    low:    data.l[i],
    close:  data.c[i],
    volume: data.v[i],
  }));
}

export async function fetchRealCandles(
  instrument: Instrument,
  timeframe: string
): Promise<Candle[] | null> {
  const now = Date.now();
  const candleCount = 200;
  const msPerCandle: Record<string, number> = {
    '1m': 60_000, '5m': 300_000, '15m': 900_000,
    '1h': 3_600_000, '4h': 14_400_000, '1d': 86_400_000,
  };
  const from = now - (candleCount * (msPerCandle[timeframe] ?? 900_000));

  switch (instrument.category) {
    case 'forex':
    case 'commodities':
      return fetchForexCandles(instrument.id, timeframe, from, now);
    case 'crypto':
      return fetchCryptoCandles(instrument.id, timeframe, from, now);
    case 'indices':
      return fetchCandles(instrument.id, timeframe, from, now);
    default:
      return null;
  }
}

export async function fetchMarketNews(category: string = 'general'): Promise<FinnhubNewsItem[]> {
  const data = await fetchFinnhub<FinnhubNewsItem[]>('/news', { category });
  return data ?? [];
}

export async function fetchSymbolNews(symbol: string): Promise<FinnhubNewsItem[]> {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const data = await fetchFinnhub<FinnhubNewsItem[]>('/company-news', {
    symbol,
    from: fmt(from),
    to: fmt(today),
  });
  return data ?? [];
}

// -------------------------
// WebSocket real-time feed
// -------------------------

type TickCallback = (instrumentId: string, price: number) => void;

class FinnhubWebSocket {
  private ws: WebSocket | null = null;
  private subscribers = new Map<string, TickCallback[]>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connected = false;

  connect() {
    if (!HAS_FINNHUB_KEY || this.ws) return;

    this.ws = new WebSocket(`${WS_URL}?token=${API_KEY}`);

    this.ws.onopen = () => {
      this.connected = true;
      // Re-subscribe all pending symbols
      this.subscribers.forEach((_, symbol) => {
        this.ws?.send(JSON.stringify({ type: 'subscribe', symbol }));
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        if (msg.type !== 'trade' || !msg.data?.length) return;
        for (const trade of msg.data) {
          const { s: wsSymbol, p: price } = trade;
          // Find the instrument ID that maps to this WS symbol
          const instrumentId = Object.entries(FINNHUB_SYMBOLS)
            .find(([, v]) => v === wsSymbol)?.[0];
          if (!instrumentId) continue;
          const cbs = this.subscribers.get(wsSymbol) ?? [];
          cbs.forEach(cb => cb(instrumentId, price));
        }
      } catch {
        // ignore parse errors
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.ws = null;
      // Reconnect after 3s
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  subscribe(instrumentId: string, cb: TickCallback) {
    const wsSymbol = FINNHUB_SYMBOLS[instrumentId];
    if (!wsSymbol) return;

    const existing = this.subscribers.get(wsSymbol) ?? [];
    this.subscribers.set(wsSymbol, [...existing, cb]);

    if (this.connected) {
      this.ws?.send(JSON.stringify({ type: 'subscribe', symbol: wsSymbol }));
    } else {
      this.connect();
    }
  }

  unsubscribe(instrumentId: string, cb: TickCallback) {
    const wsSymbol = FINNHUB_SYMBOLS[instrumentId];
    if (!wsSymbol) return;

    const existing = this.subscribers.get(wsSymbol) ?? [];
    const updated = existing.filter(c => c !== cb);
    if (updated.length === 0) {
      this.subscribers.delete(wsSymbol);
      if (this.connected) {
        this.ws?.send(JSON.stringify({ type: 'unsubscribe', symbol: wsSymbol }));
      }
    } else {
      this.subscribers.set(wsSymbol, updated);
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.subscribers.clear();
    this.connected = false;
  }
}

// Singleton WebSocket instance
export const finnhubWS = new FinnhubWebSocket();
