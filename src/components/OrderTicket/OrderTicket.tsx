import React, { useState, useEffect } from 'react';
import type { Instrument, OrderSide, OrderType, AccountState } from '../../types/trading';
import './OrderTicket.css';

interface OrderTicketProps {
  instrument: Instrument;
  account: AccountState;
  onPlaceOrder: (order: {
    side: OrderSide;
    type: OrderType;
    lots: number;
    leverage: number;
    targetPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => void;
}

export const OrderTicket: React.FC<OrderTicketProps> = ({
  instrument,
  account,
  onPlaceOrder,
}) => {
  const [side, setSide] = useState<OrderSide>('BUY');
  const [type, setType] = useState<OrderType>('MARKET');
  const [lots, setLots] = useState<number>(0.1);
  const [leverage, setLeverage] = useState<number>(instrument.defaultLeverage);
  const [targetPrice, setTargetPrice] = useState<number>(instrument.price);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);

  // Financial calculations
  const contractSize = instrument.category === 'Forex' ? 100000 : (instrument.category === 'Crypto' ? 1 : 10);
  const notionalValue = lots * contractSize * (type === 'MARKET' ? instrument.price : targetPrice);
  const requiredMargin = notionalValue / leverage;
  const pipValue = (instrument.pipSize / (type === 'MARKET' ? instrument.price : targetPrice)) * notionalValue;
  
  const riskAmount = side === 'BUY' 
    ? (stopLoss > 0 ? (instrument.price - stopLoss) / instrument.pipSize * pipValue : 0)
    : (stopLoss > 0 ? (stopLoss - instrument.price) / instrument.pipSize * pipValue : 0);

  const rewardAmount = side === 'BUY'
    ? (takeProfit > 0 ? (takeProfit - instrument.price) / instrument.pipSize * pipValue : 0)
    : (takeProfit > 0 ? (instrument.price - takeProfit) / instrument.pipSize * pipValue : 0);

  const rrRatio = riskAmount > 0 ? (rewardAmount / riskAmount).toFixed(2) : '0.00';

  useEffect(() => {
    setTargetPrice(instrument.price);
    setLeverage(instrument.defaultLeverage);
  }, [instrument]);

  return (
    <div className={`order-ticket ${side.toLowerCase()}`}>
      <div className="ticket-header">
        <button 
          className={`side-btn buy ${side === 'BUY' ? 'active' : ''}`}
          onClick={() => setSide('BUY')}
        >
          BUY
        </button>
        <button 
          className={`side-btn sell ${side === 'SELL' ? 'active' : ''}`}
          onClick={() => setSide('SELL')}
        >
          SELL
        </button>
      </div>

      <div className="ticket-body">
        <div className="input-group">
          <label>Order Type</label>
          <div className="type-selector">
            {(['MARKET', 'LIMIT', 'STOP'] as OrderType[]).map(t => (
              <button 
                key={t}
                className={type === t ? 'active' : ''}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {type !== 'MARKET' && (
          <div className="input-group">
            <label>Target Price</label>
            <input 
              type="number" 
              step={instrument.pipSize}
              value={targetPrice} 
              onChange={e => setTargetPrice(parseFloat(e.target.value))}
            />
          </div>
        )}

        <div className="input-group">
          <label>Lots</label>
          <div className="lot-input">
            <input 
              type="number" 
              step="0.01" 
              value={lots} 
              onChange={e => setLots(parseFloat(e.target.value))}
            />
            <div className="quick-lots">
              {[0.01, 0.1, 0.5, 1.0].map(l => (
                <button key={l} onClick={() => setLots(l)}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>Leverage (1:{leverage})</label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={leverage} 
            onChange={e => setLeverage(parseInt(e.target.value))}
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Stop Loss</label>
            <input 
              type="number" 
              step={instrument.pipSize}
              placeholder="0.00"
              value={stopLoss || ''} 
              onChange={e => setStopLoss(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="input-group">
            <label>Take Profit</label>
            <input 
              type="number" 
              step={instrument.pipSize}
              placeholder="0.00"
              value={takeProfit || ''} 
              onChange={e => setTakeProfit(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="risk-preview">
          <div className="preview-item">
            <span>Required Margin</span>
            <span className="mono">${requiredMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="preview-item">
            <span>Pip Value</span>
            <span className="mono">${pipValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {riskAmount > 0 && (
            <div className="preview-item">
              <span>Risk/Reward</span>
              <span className="mono">1:{rrRatio}</span>
            </div>
          )}
        </div>

        <button 
          className="place-order-btn"
          disabled={requiredMargin > account.freeMargin}
          onClick={() => onPlaceOrder({ side, type, lots, leverage, targetPrice, stopLoss, takeProfit })}
        >
          {side} {lots} {instrument.symbol}
          <div className="btn-subtext">
            {requiredMargin > account.freeMargin ? 'Insufficient Margin' : `Margin: $${requiredMargin.toFixed(2)}`}
          </div>
        </button>
      </div>
    </div>
  );
};
