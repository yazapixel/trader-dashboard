/**
 * useMarketData — unified real-time market data hook
 *
 * Priority order:
 *   Crypto prices    → CoinGecko (free, no key)
 *   Crypto candles   → CoinGecko OHLC (free, no key)
 *   Forex prices     → Finnhub WebSocket (key required)
 *   Forex candles    → Finnhub REST (key required)
 *   News             → Finnhub REST (key required) with simulated fallback
 *   All else         → Simulated data fallback
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Instrument, Candle } from '../types/trading';
import { INITIAL_INSTRUMENTS, generateHistoricalCandles } from './marketData';
import {
  HAS_FINNHUB_KEY,
  fetchRealCandles,
  fetchMarketNews,
  finnhubWS,
  type FinnhubNewsItem,
} from './finnhub';
import {
  COINGECKO_IDS,
  fetchCryptoMarkets,
  fetchCryptoOHLC,
  timeframeToCoinGeckoDays,
} from './coingecko';
import { simulateTick } from './marketData';

export type DataSource = 'live' | 'simulated';

export interface MarketDataState {
  instruments: Instrument[];
  activeInstrument: Instrument | null;
  setActiveInstrument: (inst: Instrument) => void;
  candles: Candle[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  news: FinnhubNewsItem[];
  dataSource: DataSource;
  isLoadingCandles: boolean;
}

const CRYPTO_IDS = Object.keys(COINGECKO_IDS); // ['BTCUSD', 'ETHUSD', 'SOLUSD']

export function useMarketData(): MarketDataState {
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [activeInstrument, setActiveInstrumentState] = useState<Instrument | null>(
    INITIAL_INSTRUMENTS[0] ?? null
  );
  const [candles, setCandles] = useState<Candle[]>([]);
  const [timeframe, setTimeframe] = useState<string>('15m');
  const [news, setNews] = useState<FinnhubNewsItem[]>([]);
  const [isLoadingCandles, setIsLoadingCandles] = useState(false);

  const activeRef = useRef<Instrument | null>(activeInstrument);
  const instrumentsRef = useRef<Instrument[]>(instruments);
  const simulationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { activeRef.current = activeInstrument; }, [activeInstrument]);
  useEffect(() => { instrumentsRef.current = instruments; }, [instruments]);

  // Determine data source
  const dataSource: DataSource = HAS_FINNHUB_KEY ? 'live' : 'simulated';

  // -----------------------------------------------------------------------
  // Crypto prices via CoinGecko (always-on, no key needed)
  // -----------------------------------------------------------------------
  useEffect(() => {
    async function loadCryptoPrices() {
      const coinIds = CRYPTO_IDS.map(id => COINGECKO_IDS[id]).filter(Boolean);
      const markets = await fetchCryptoMarkets(coinIds);
      if (!markets.length) return;

      setInstruments(prev =>
        prev.map(inst => {
          const coinId = COINGECKO_IDS[inst.id];
          if (!coinId) return inst;
          const market = markets.find(m => m.id === coinId);
          if (!market) return inst;
          const price = market.current_price;
          const spread = inst.spread;
          return {
            ...inst,
            price,
            bid: price - spread / 2,
            ask: price + spread / 2,
            change24h: Number(market.price_change_percentage_24h?.toFixed(2) ?? inst.change24h),
            high24h: market.high_24h,
            low24h: market.low_24h,
            volume: market.total_volume,
          };
        })
      );
    }

    loadCryptoPrices();
    const interval = setInterval(loadCryptoPrices, 30_000); // every 30s
    return () => clearInterval(interval);
  }, []);

  // -----------------------------------------------------------------------
  // Forex/Indices/Commodity prices via Finnhub WebSocket (key required)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!HAS_FINNHUB_KEY) return;

    const nonCrypto = INITIAL_INSTRUMENTS.filter(i => !CRYPTO_IDS.includes(i.id));

    const handler = (instrumentId: string, price: number) => {
      setInstruments(prev =>
        prev.map(inst => {
          if (inst.id !== instrumentId) return inst;
          return {
            ...inst,
            price,
            bid: price - inst.spread * inst.pipSize / 2,
            ask: price + inst.spread * inst.pipSize / 2,
          };
        })
      );
      // Also update active instrument if it matches
      if (activeRef.current?.id === instrumentId) {
        setActiveInstrumentState(prev =>
          prev && prev.id === instrumentId
            ? { ...prev, price, bid: price - prev.spread * prev.pipSize / 2, ask: price + prev.spread * prev.pipSize / 2 }
            : prev
        );
      }
    };

    nonCrypto.forEach(inst => finnhubWS.subscribe(inst.id, handler));
    return () => {
      nonCrypto.forEach(inst => finnhubWS.unsubscribe(inst.id, handler));
    };
  }, []);

  // -----------------------------------------------------------------------
  // Simulated ticks when no Finnhub key (non-crypto, since crypto uses CoinGecko)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (HAS_FINNHUB_KEY) return; // real data handles this

    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);

    simulationIntervalRef.current = setInterval(() => {
      setInstruments(prev =>
        prev.map(inst => {
          // Crypto already handled by CoinGecko
          if (CRYPTO_IDS.includes(inst.id)) return inst;
          const price = simulateTick(inst.price, inst.category);
          return {
            ...inst,
            price,
            bid: price - inst.spread * inst.pipSize / 2,
            ask: price + inst.spread * inst.pipSize / 2,
          };
        })
      );
    }, 1500);

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, []);

  // Keep active instrument in sync with instruments list price updates
  useEffect(() => {
    setActiveInstrumentState(prev => {
      if (!prev) return prev;
      const updated = instruments.find(i => i.id === prev.id);
      return updated ?? prev;
    });
  }, [instruments]);

  // -----------------------------------------------------------------------
  // Candle data
  // -----------------------------------------------------------------------
  const loadCandles = useCallback(async (instrument: Instrument, tf: string) => {
    setIsLoadingCandles(true);
    let result: Candle[] | null = null;

    try {
      if (CRYPTO_IDS.includes(instrument.id)) {
        // CoinGecko OHLC for crypto
        const coinId = COINGECKO_IDS[instrument.id];
        const days = timeframeToCoinGeckoDays(tf);
        result = await fetchCryptoOHLC(coinId, days);
      } else if (HAS_FINNHUB_KEY) {
        // Finnhub for forex/indices/commodities
        result = await fetchRealCandles(instrument, tf);
      }
    } catch {
      result = null;
    }

    // Fallback to simulated if real data unavailable
    if (!result || result.length === 0) {
      result = generateHistoricalCandles(instrument.price, tf as any);
    }

    setCandles(result);
    setIsLoadingCandles(false);
  }, []);

  useEffect(() => {
    if (activeInstrument) {
      loadCandles(activeInstrument, timeframe);
    }
  }, [activeInstrument?.id, timeframe, loadCandles]);

  // -----------------------------------------------------------------------
  // News via Finnhub (key required), loaded once on mount + every 5 min
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!HAS_FINNHUB_KEY) return;

    async function loadNews() {
      const items = await fetchMarketNews('general');
      if (items.length) setNews(items);
    }

    loadNews();
    const interval = setInterval(loadNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const setActiveInstrument = useCallback((inst: Instrument) => {
    setActiveInstrumentState(inst);
  }, []);

  return {
    instruments,
    activeInstrument,
    setActiveInstrument,
    candles,
    timeframe,
    setTimeframe,
    news,
    dataSource,
    isLoadingCandles,
  };
}
