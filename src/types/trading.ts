export type AssetCategory = 'Forex' | 'Crypto' | 'Indices' | 'Commodities';

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

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  targetPrice?: number;
  lots: number;
  leverage: number;
  margin: number;
  stopLoss?: number;
  takeProfit?: number;
  status: OrderStatus;
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
  closeReason: 'MANUAL' | 'TP' | 'SL';
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
