import { Candle, Instrument, OrderBookData, Timeframe } from '../types/trading';

export const INITIAL_INSTRUMENTS: Instrument[] = [
  {
    id: 'EURUSD',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    price: 1.08450,
    change24h: 0.35,
    high24h: 1.08720,
    low24h: 1.08110,
    volume: 1452000,
    bid: 1.08448,
    ask: 1.08452,
    spread: 0.4,
    decimals: 5,
    pipSize: 0.0001,
    minLot: 0.01,
    maxLot: 100,
    defaultLeverage: 100,
  },
  {
    id: 'GBPUSD',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'forex',
    price: 1.29820,
    change24h: -0.18,
    high24h: 1.30250,
    low24h: 1.29540,
    volume: 984000,
    bid: 1.29817,
    ask: 1.29823,
    spread: 0.6,
    decimals: 5,
    pipSize: 0.0001,
    minLot: 0.01,
    maxLot: 100,
    defaultLeverage: 100,
  },
  {
    id: 'USDJPY',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    price: 153.420,
    change24h: 0.72,
    high24h: 153.890,
    low24h: 152.310,
    volume: 1210000,
    bid: 153.417,
    ask: 153.423,
    spread: 0.6,
    decimals: 3,
    pipSize: 0.01,
    minLot: 0.01,
    maxLot: 100,
    defaultLeverage: 100,
  },
  {
    id: 'AUDUSD',
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    category: 'forex',
    price: 0.65820,
    change24h: 0.12,
    high24h: 0.66100,
    low24h: 0.65590,
    volume: 640000,
    bid: 0.65817,
    ask: 0.65823,
    spread: 0.6,
    decimals: 5,
    pipSize: 0.0001,
    minLot: 0.01,
    maxLot: 100,
    defaultLeverage: 100,
  },
  {
    id: 'BTCUSD',
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    category: 'crypto',
    price: 68420.0,
    change24h: 3.45,
    high24h: 69200.0,
    low24h: 66150.0,
    volume: 48200,
    bid: 68412.0,
    ask: 68428.0,
    spread: 16.0,
    decimals: 2,
    pipSize: 1.0,
    minLot: 0.001,
    maxLot: 20,
    defaultLeverage: 20,
  },
  {
    id: 'ETHUSD',
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    category: 'crypto',
    price: 3540.50,
    change24h: 2.10,
    high24h: 3610.00,
    low24h: 3450.00,
    volume: 95400,
    bid: 3540.00,
    ask: 3541.00,
    spread: 1.0,
    decimals: 2,
    pipSize: 0.1,
    minLot: 0.01,
    maxLot: 50,
    defaultLeverage: 20,
  },
  {
    id: 'SOLUSD',
    symbol: 'SOL/USD',
    name: 'Solana / US Dollar',
    category: 'crypto',
    price: 184.25,
    change24h: 5.82,
    high24h: 189.50,
    low24h: 172.10,
    volume: 231000,
    bid: 184.20,
    ask: 184.30,
    spread: 0.1,
    decimals: 2,
    pipSize: 0.01,
    minLot: 0.1,
    maxLot: 500,
    defaultLeverage: 10,
  },
  {
    id: 'SPX500',
    symbol: 'SPX 500',
    name: 'S&P 500 Index CFD',
    category: 'indices',
    price: 5860.25,
    change24h: 0.48,
    high24h: 5875.00,
    low24h: 5830.50,
    volume: 780000,
    bid: 5860.00,
    ask: 5860.50,
    spread: 0.5,
    decimals: 2,
    pipSize: 0.25,
    minLot: 0.1,
    maxLot: 100,
    defaultLeverage: 50,
  },
  {
    id: 'NAS100',
    symbol: 'NAS 100',
    name: 'Nasdaq 100 Index CFD',
    category: 'indices',
    price: 20340.50,
    change24h: 0.85,
    high24h: 20420.00,
    low24h: 20180.00,
    volume: 890000,
    bid: 20340.00,
    ask: 20341.00,
    spread: 1.0,
    decimals: 2,
    pipSize: 0.5,
    minLot: 0.1,
    maxLot: 100,
    defaultLeverage: 50,
  },
  {
    id: 'XAUUSD',
    symbol: 'XAU/USD',
    name: 'Gold / US Dollar',
    category: 'commodities',
    price: 2735.40,
    change24h: 1.15,
    high24h: 2748.20,
    low24h: 2712.00,
    volume: 620000,
    bid: 2735.25,
    ask: 2735.55,
    spread: 0.3,
    decimals: 2,
    pipSize: 0.01,
    minLot: 0.01,
    maxLot: 50,
    defaultLeverage: 50,
  },
  {
    id: 'XTIUSD',
    symbol: 'XTI/USD',
    name: 'WTI Crude Oil',
    category: 'commodities',
    price: 71.85,
    change24h: -1.45,
    high24h: 73.40,
    low24h: 71.10,
    volume: 410000,
    bid: 71.83,
    ask: 71.87,
    spread: 0.04,
    decimals: 2,
    pipSize: 0.01,
    minLot: 0.1,
    maxLot: 100,
    defaultLeverage: 20,
  }
];

export function generateHistoricalCandles(basePrice: number, timeframe: Timeframe, count: number = 100): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  
  let timeframeMs = 60 * 1000; // 1m
  if (timeframe === '5m') timeframeMs = 5 * 60 * 1000;
  if (timeframe === '15m') timeframeMs = 15 * 60 * 1000;
  if (timeframe === '1h') timeframeMs = 60 * 60 * 1000;
  if (timeframe === '4h') timeframeMs = 4 * 60 * 60 * 1000;
  if (timeframe === '1d') timeframeMs = 24 * 60 * 60 * 1000;

  let currentPrice = basePrice * (1 - (count * 0.001)); // start slightly lower for trend
  const volatility = basePrice * 0.0015;

  for (let i = count; i >= 0; i--) {
    const timestamp = now - (i * timeframeMs);
    const change = (Math.random() - 0.49) * volatility;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.6);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.6);
    const volume = Math.floor(Math.random() * 5000) + 500;

    candles.push({ timestamp, open, high, low, close, volume });
    currentPrice = close;
  }

  // Ensure last candle close matches current basePrice roughly
  if (candles.length > 0) {
    candles[candles.length - 1].close = basePrice;
    candles[candles.length - 1].high = Math.max(candles[candles.length - 1].high, basePrice);
    candles[candles.length - 1].low = Math.min(candles[candles.length - 1].low, basePrice);
  }

  return candles;
}

export function generateOrderBook(midPrice: number, decimals: number, spread: number): OrderBookData {
  const bids = [];
  const asks = [];
  const step = midPrice * 0.0001;

  let bidTotal = 0;
  for (let i = 1; i <= 10; i++) {
    const price = Number((midPrice - (spread / 2) - (i * step)).toFixed(decimals));
    const size = Number((Math.random() * 2 + 0.1).toFixed(2));
    bidTotal += size;
    bids.push({ price, size, total: Number(bidTotal.toFixed(2)) });
  }

  let askTotal = 0;
  for (let i = 1; i <= 10; i++) {
    const price = Number((midPrice + (spread / 2) + (i * step)).toFixed(decimals));
    const size = Number((Math.random() * 2 + 0.1).toFixed(2));
    askTotal += size;
    asks.push({ price, size, total: Number(askTotal.toFixed(2)) });
  }

  return { bids, asks };
}

export function simulateTick(currentPrice: number, category: string): number {
  const volatility =
    category === 'crypto' ? 0.0004 :
    category === 'forex'  ? 0.00004 :
    0.0001;
  const change = currentPrice * volatility * (Math.random() - 0.5);
  return currentPrice + change;
}
