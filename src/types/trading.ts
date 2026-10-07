export type AssetCategory = 'forex' | 'crypto' | 'indices' | 'commodities';

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: number;
  bid: number;
  ask: number;
  spread: number;
  decimals: number;
  pipSize: number;
  minLot: number;
  maxLot: number;
  defaultLeverage: number;
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP';
export type OrderSide = 'BUY' | 'SELL';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  targetPrice: number;
  lots: number;
  leverage: number;
  margin: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  createdAt: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: OrderSide;
  entryPrice: number;
  currentPrice: number;
  lots: number;
  leverage: number;
  margin: number;
  stopLoss?: number;
  takeProfit?: number;
  floatingPnl: number;
  floatingPnlPercent: number;
  openedAt: number;
}

export interface ClosedTrade {
  id: string;
  symbol: string;
  side: OrderSide;
  entryPrice: number;
  exitPrice: number;
  lots: number;
  pnl: number;
  closedAt: number;
  closeReason: 'MARKET' | 'TAKE_PROFIT' | 'STOP_LOSS' | 'MANUAL';
}

export interface AccountState {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  realizedPnl: number;
  dailyPnl: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
