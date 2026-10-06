import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  Instrument, Candle, Position, Order, ClosedTrade, 
  AccountState, OrderSide, OrderType 
} from '../types/trading';
import { simulateTick, generateHistory } from '../services/marketData';

export function useTradingEngine(initialBalance: number = 100000) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [activeInstrument, setActiveInstrument] = useState<Instrument | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [timeframe, setTimeframe] = useState<string>('15m');
  
  const [account, setAccount] = useState<AccountState>({
    balance: initialBalance,
    equity: initialBalance,
    margin: 0,
    freeMargin: initialBalance,
    marginLevel: 0,
    realizedPnl: 0,
    dailyPnl: 0,
  });

  const [positions, setPositions] = useState<Position[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<ClosedTrade[]>([]);

  // Refs for real-time simulation without stale closures
  const positionsRef = useRef<Position[]>([]);
  const accountRef = useRef<AccountState>(account);
  const activeInstrumentRef = useRef<Instrument | null>(null);

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  useEffect(() => {
    activeInstrumentRef.current = activeInstrument;
  }, [activeInstrument]);

  // Initialize data
  useEffect(() => {
    import('../services/marketData').then(m => {
      const all = m.getInstruments();
      setInstruments(all);
      setActiveInstrument(all[0]);
    });
  }, []);

  useEffect(() => {
    if (activeInstrument) {
      setCandles(generateHistory(activeInstrument, timeframe));
    }
  }, [activeInstrument, timeframe]);

  // Tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeInstrumentRef.current) return;

      const newPrice = simulateTick(activeInstrumentRef.current.price, activeInstrumentRef.current.category);
      
      // Update instrument price
      setActiveInstrument(prev => prev ? { 
        ...prev, 
        price: newPrice,
        bid: newPrice - (prev.spread * prev.pipSize / 2),
        ask: newPrice + (prev.spread * prev.pipSize / 2)
      } : null);

      // Update candles
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const updatedLast = {
          ...last,
          high: Math.max(last.high, newPrice),
          low: Math.min(last.low, newPrice),
          close: newPrice
        };
        return [...prev.slice(0, -1), updatedLast];
      });

      // Update positions P&L
      setPositions(prev => {
        const updated = prev.map(pos => {
          if (pos.symbol !== activeInstrumentRef.current?.symbol) return pos;
          
          const contractSize = pos.symbol.includes('/') ? 100000 : 1; // Simplistic
          const pnl = pos.side === 'BUY'
            ? (newPrice - pos.entryPrice) * pos.lots * contractSize
            : (pos.entryPrice - newPrice) * pos.lots * contractSize;
          
          return {
            ...pos,
            currentPrice: newPrice,
            floatingPnl: pnl,
            floatingPnlPercent: (pnl / pos.margin) * 100
          };
        });

        // Check TP/SL
        const toClose: Position[] = [];
        const remaining = updated.filter(pos => {
          if (pos.symbol !== activeInstrumentRef.current?.symbol) return true;
          
          const hitSL = pos.stopLoss && (pos.side === 'BUY' ? newPrice <= pos.stopLoss : newPrice >= pos.stopLoss);
          const hitTP = pos.takeProfit && (pos.side === 'BUY' ? newPrice >= pos.takeProfit : newPrice <= pos.takeProfit);
          
          if (hitSL || hitTP) {
            toClose.push({ ...pos, currentPrice: newPrice });
            return false;
          }
          return true;
        });

        if (toClose.length > 0) {
          toClose.forEach(pos => closePosition(pos.id, pos.stopLoss && (pos.side === 'BUY' ? newPrice <= pos.stopLoss : newPrice >= pos.stopLoss) ? 'SL' : 'TP'));
        }

        return remaining;
      });

      // Update Account Equity/Margin Level
      const totalFloatingPnl = positionsRef.current.reduce((acc, p) => acc + p.floatingPnl, 0);
      const newEquity = accountRef.current.balance + totalFloatingPnl;
      const marginLevel = accountRef.current.margin > 0 ? (newEquity / accountRef.current.margin) * 100 : 0;

      setAccount(prev => ({
        ...prev,
        equity: newEquity,
        freeMargin: newEquity - prev.margin,
        marginLevel
      }));

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const placeOrder = useCallback((params: {
    side: OrderSide;
    type: OrderType;
    lots: number;
    leverage: number;
    targetPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => {
    if (!activeInstrument) return;

    if (params.type === 'MARKET') {
      const contractSize = activeInstrument.category === 'Forex' ? 100000 : (activeInstrument.category === 'Crypto' ? 1 : 10);
      const margin = (params.lots * contractSize * activeInstrument.price) / params.leverage;

      if (margin > account.freeMargin) return;

      const newPosition: Position = {
        id: Math.random().toString(36).substr(2, 9),
        symbol: activeInstrument.symbol,
        side: params.side,
        entryPrice: activeInstrument.price,
        currentPrice: activeInstrument.price,
        lots: params.lots,
        leverage: params.leverage,
        margin,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
        floatingPnl: 0,
        floatingPnlPercent: 0,
        openedAt: Date.now(),
      };

      setPositions(prev => [...prev, newPosition]);
      setAccount(prev => ({
        ...prev,
        margin: prev.margin + margin,
        freeMargin: prev.freeMargin - margin
      }));
    } else {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        symbol: activeInstrument.symbol,
        side: params.side,
        type: params.type,
        targetPrice: params.targetPrice,
        lots: params.lots,
        leverage: params.leverage,
        margin: 0, // Calculated at fill
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
        status: 'PENDING',
        createdAt: Date.now(),
      };
      setPendingOrders(prev => [...prev, newOrder]);
    }
  }, [activeInstrument, account]);

  const closePosition = useCallback((id: string, reason: 'MANUAL' | 'TP' | 'SL' = 'MANUAL') => {
    setPositions(prev => {
      const pos = prev.find(p => p.id === id);
      if (!pos) return prev;

      const closedTrade: ClosedTrade = {
        id: pos.id,
        symbol: pos.symbol,
        side: pos.side,
        entryPrice: pos.entryPrice,
        exitPrice: pos.currentPrice,
        lots: pos.lots,
        pnl: pos.floatingPnl,
        closedAt: Date.now(),
        closeReason: reason
      };

      setHistory(h => [closedTrade, ...h]);
      setAccount(acc => ({
        ...acc,
        balance: acc.balance + pos.floatingPnl,
        realizedPnl: acc.realizedPnl + pos.floatingPnl,
        margin: acc.margin - pos.margin,
        freeMargin: acc.freeMargin + pos.margin
      }));

      return prev.filter(p => p.id !== id);
    });
  }, []);

  const cancelOrder = useCallback((id: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  return {
    instruments,
    activeInstrument,
    setActiveInstrument,
    candles,
    timeframe,
    setTimeframe,
    account,
    positions,
    pendingOrders,
    history,
    placeOrder,
    closePosition,
    cancelOrder
  };
}
