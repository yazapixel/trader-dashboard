import React, { useMemo } from 'react';
import type { Instrument } from '../../types/trading';
import './OrderBook.css';

interface OrderBookProps {
  instrument: Instrument | null;
}

export const OrderBook: React.FC<OrderBookProps> = ({ instrument }) => {
  const depth = useMemo(() => {
    if (!instrument) return { bids: [], asks: [] };
    
    const bids = [];
    const asks = [];
    const step = instrument.pipSize * 2;
    
    for (let i = 0; i < 10; i++) {
      const bidPrice = instrument.bid - (i * step);
      const askPrice = instrument.ask + (i * step);
      bids.push({ price: bidPrice, size: Math.random() * 5 + 0.1 });
      asks.push({ price: askPrice, size: Math.random() * 5 + 0.1 });
    }
    
    return { 
      bids, 
      asks: asks.reverse() // Asks should be descending in visual order
    };
  }, [instrument?.price]);

  if (!instrument) return null;

  const maxVolume = Math.max(
    ...depth.bids.map(b => b.size),
    ...depth.asks.map(a => a.size)
  );

  return (
    <div className="order-book">
      <div className="book-header">Order Book</div>
      
      <div className="book-grid">
        <div className="grid-header">
          <span>Price</span>
          <span>Size</span>
        </div>

        <div className="asks-section">
          {depth.asks.map((ask, i) => (
            <div key={i} className="book-row ask-row">
              <span className="bearish">{ask.price.toFixed(instrument.decimals)}</span>
              <span className="mono">{ask.size.toFixed(2)}</span>
              <div className="depth-bar bearish" style={{ width: `${(ask.size / maxVolume) * 100}%` }}></div>
            </div>
          ))}
        </div>

        <div className="spread-row">
          <span>Spread</span>
          <span className="mono">{instrument.spread.toFixed(1)} Pips</span>
        </div>

        <div className="bids-section">
          {depth.bids.map((bid, i) => (
            <div key={i} className="book-row bid-row">
              <span className="bullish">{bid.price.toFixed(instrument.decimals)}</span>
              <span className="mono">{bid.size.toFixed(2)}</span>
              <div className="depth-bar bullish" style={{ width: `${(bid.size / maxVolume) * 100}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
