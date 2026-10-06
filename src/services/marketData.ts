import type { Instrument, Candle, AssetCategory } from '../types/trading';

export const DEFAULT_INSTRUMENTS: Instrument[] = [
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'Forex',
    price: 1.0850,
    change24h: 0.15,
    high24h: 1.0890,
    low24h: 1.0810,
    volume: 450000000,
    bid: 1.0849,
    ask: 1.0851,
    spread: 0.2,
    decimals: 5,
    pipSize: 0.0001,
    minLot: 0.01,
    maxLot: 100,
    defaultLeverage: 30
  },
  {
    id: 'btcusd',
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    category: 'Crypto',
    price: 65420.50,
    change24h: 2.4,
    high24h: 66100.00,
    low24h: 64200.00,
    volume: 32000000000,
    bid: 65415.00,
    ask: 65426.00,
    spread: 11.0,
    decimals: 2,
    pipSize: 1.0,
    minLot: 0.0001,
    maxLot: 10,
    defaultLeverage: 100
  },
  {
    id: 'spx500',
    symbol: 'SPX 500',
    name: 'S&P 500 Index',
    category: 'Indices',
    price: 5450.25,
    change24h: -0.45,
    high24h: 5480.00,
    low24h: 5430.00,
    volume: 1200000000,
    bid: 5450.00,
    ask: 5450.50,
    spread: 0.5,
    decimals: 2,
    pipSize: 0.01,
    minLot: 0.1,
    maxLot: 500,
    defaultLeverage: 20
  },
  {
    id: 'xauusd',
    symbol: 'XAU/USD',
    name: 'Gold / US Dollar',
    category: 'Commodities',
    price: 2345.60,
    change24h: 0.85,
    high24h: 2360.00,
    low24h: 2330.00,
    volume: 850000000,
    bid: 2345.40,
    ask: 2345.80,
    spread: 0.4,
    decimals: 2,
    pipSize: 0.1,
    minLot: 0.01,
    maxLot: 200,
    defaultLeverage: 50
  },
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'Forex',
    price: 1.2720,
    change24h: -0.12,
    high24h: 1.2750,
    low24h: 1.2690,
    volume: 320000000,
    bid: 1.2719,
    ask: 1.2721,
    spread: 0.2,
    decimals: 5,
    pipSize: 0.0001,
    minLot: 0.01,
    maxLot: 100,
    defaultLeverage: 30
  },
  {
    id: 'ethusd',
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    category: 'Crypto',
    price: 3450.75,
    change24h: 1.8,
    high24h: 3510.00,
    low24h: 3390.00,
    volume: 15000000000,
    bid: 3450.20,
    ask: 3451.30,
    spread: 1.1,
    decimals: 2,
    pipSize: 0.1,
    minLot: 0.01,
    maxLot: 500,
    defaultLeverage: 100
  },
  {
    id: 'nas100',
    symbol: 'NAS 100',
    name: 'Nasdaq 100 Index',
    category: 'Indices',
    price: 19250.40,
    change24h: -0.65,
    high24h: 19400.00,
    low24h: 19150.00,
    volume: 2100000000,
    bid: 19250.00,
    ask: 19250.80,
    spread: 0.8,
    decimals: 2,
    pipSize: 0.01,
    minLot: 0.1,
    maxLot: 500,
    defaultLeverage: 20
  },
  {
    id: 'xtiusd',
    symbol: 'XTI/USD',
    name: 'Crude Oil',
    category: 'Commodities',
    price: 81.45,
    change24h: -1.2,
    high24h: 83.00,
    low24h: 80.50,
    volume: 450000000,
    bid: 81.42,
    ask: 81.48,
    spread: 0.06,
    decimals: 2,
    pipSize: 0.01,
    minLot: 0.1,
    maxLot: 500,
    defaultLeverage: 50
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'Forex',
    price: 158.45,
    change24h: 0.35,
    high24h: 159.00,
    low24h: 157.80,
    volume: 520000000,
    bid: 158.44,
    ask: 158.46,
    spread: 0.2,
    decimals: 3,
    pipSize: 0.01,
    minLot: 0.01,
    maxLot: 100,
    defaultLeverage: 30
  },
  {
    id: 'solusd',
    symbol: 'SOL/USD',
    name: 'Solana / US Dollar',
    category: 'Crypto',
    price: 145.20,
    change24h: 4.5,
    high24h: 148.00,
    low24h: 138.00,
    volume: 4500000000,
    bid: 145.10,
    ask: 145.30,
    spread: 0.2,
    decimals: 2,
    pipSize: 0.1,
    minLot: 0.1,
    maxLot: 1000,
    defaultLeverage: 100
  },
  {
    id: 'us30',
    symbol: 'US 30',
    name: 'Dow Jones Index',
    category: 'Indices',
    price: 39150.75,
    change24h: -0.15,
    high24h: 39300.00,
    low24h: 39050.00,
    volume: 850000000,
    bid: 39150.00,
    ask: 39151.50,
    spread: 1.5,
    decimals: 2,
    pipSize: 1.0,
    minLot: 0.1,
    maxLot: 500,
    defaultLeverage: 20
  },
  {
    id: 'audusd',
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    category: 'Forex',
    price: 0.6650,
    change24h: 0.25,
    high24h: 0.6680,
    low24h: 0.6620,
    volume: 150000000,
    bid: 0.6649,
    ask: 0.6651,
    spread: 0.2,
    decimals: 5,
    pipSize: 0.0001,
    minLot: 0.01,
    maxLot: 100,
    defaultLeverage: 30
  }
];

export function getInstruments(): Instrument[] {
  return DEFAULT_INSTRUMENTS;
}

export function generateHistory(instrument: Instrument, timeframe: string, count: number = 200): Candle[] {
  const candles: Candle[] = [];
  const now = Math.floor(Date.now() / 60000) * 60000;
  let interval = 60000; // 1m default

  switch (timeframe) {
    case '5m': interval = 5 * 60000; break;
    case '15m': interval = 15 * 60000; break;
    case '1h': interval = 60 * 60000; break;
    case '4h': interval = 4 * 60 * 60000; break;
    case '1d': interval = 24 * 60 * 60000; break;
  }

  let lastClose = instrument.price;
  const volatility = instrument.category === 'Crypto' ? 0.005 : (instrument.category === 'Forex' ? 0.0005 : 0.001);

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - (i * interval);
    
    // Brownian motion for OHLC
    const change = lastClose * volatility * (Math.random() - 0.5);
    const open = lastClose - change;
    const close = lastClose;
    const high = Math.max(open, close) + (Math.random() * lastClose * volatility * 0.5);
    const low = Math.min(open, close) - (Math.random() * lastClose * volatility * 0.5);
    const volume = Math.floor(Math.random() * 1000) + 100;

    candles.push({ timestamp, open, high, low, close, volume });
    lastClose = open; // iterate backwards
  }

  return candles.reverse(); // put back in chronological order
}

export function simulateTick(currentPrice: number, category: AssetCategory): number {
  const volatility = category === 'Crypto' ? 0.0005 : (category === 'Forex' ? 0.00005 : 0.0001);
  const change = currentPrice * volatility * (Math.random() - 0.5);
  return currentPrice + change;
}
