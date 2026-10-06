import React, { useState } from 'react';
import type { Position, Order, ClosedTrade } from '../../types/trading';
import './PositionsPanel.css';

interface PositionsPanelProps {
  positions: Position[];
  pendingOrders: Order[];
  history: ClosedTrade[];
  onClosePosition: (id: string) => void;
  onCancelOrder: (id: string) => void;
}

export const PositionsPanel: React.FC<PositionsPanelProps> = ({
  positions,
  pendingOrders,
  history,
  onClosePosition,
  onCancelOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');

  return (
    <div className="positions-panel">
      <div className="panel-tabs">
        <button 
          className={activeTab === 'positions' ? 'active' : ''} 
          onClick={() => setActiveTab('positions')}
        >
          Positions ({positions.length})
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          Orders ({pendingOrders.length})
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''} 
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      <div className="table-container">
        {activeTab === 'positions' && (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Side</th>
                <th>Size</th>
                <th>Entry</th>
                <th>Current</th>
                <th>P&L</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(pos => (
                <tr key={pos.id}>
                  <td>{pos.symbol}</td>
                  <td className={pos.side === 'BUY' ? 'bullish' : 'bearish'}>{pos.side}</td>
                  <td className="mono">{pos.lots}</td>
                  <td className="mono">{pos.entryPrice.toFixed(5)}</td>
                  <td className="mono">{pos.currentPrice.toFixed(5)}</td>
                  <td className={`mono ${pos.floatingPnl >= 0 ? 'bullish' : 'bearish'}`}>
                    ${pos.floatingPnl.toFixed(2)} ({pos.floatingPnlPercent.toFixed(2)}%)
                  </td>
                  <td>
                    <button className="close-btn" onClick={() => onClosePosition(pos.id)}>Close</button>
                  </td>
                </tr>
              ))}
              {positions.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-msg">No active positions</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'orders' && (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Side</th>
                <th>Size</th>
                <th>Target</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.symbol}</td>
                  <td>{order.type}</td>
                  <td className={order.side === 'BUY' ? 'bullish' : 'bearish'}>{order.side}</td>
                  <td className="mono">{order.lots}</td>
                  <td className="mono">{order.targetPrice?.toFixed(5)}</td>
                  <td>
                    <button className="close-btn" onClick={() => onCancelOrder(order.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
              {pendingOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-msg">No pending orders</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'history' && (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Side</th>
                <th>Size</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>P&L</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {history.map(trade => (
                <tr key={trade.id}>
                  <td>{trade.symbol}</td>
                  <td className={trade.side === 'BUY' ? 'bullish' : 'bearish'}>{trade.side}</td>
                  <td className="mono">{trade.lots}</td>
                  <td className="mono">{trade.entryPrice.toFixed(5)}</td>
                  <td className="mono">{trade.exitPrice.toFixed(5)}</td>
                  <td className={`mono ${trade.pnl >= 0 ? 'bullish' : 'bearish'}`}>
                    ${trade.pnl.toFixed(2)}
                  </td>
                  <td>{trade.closeReason}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-msg">No trade history</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
