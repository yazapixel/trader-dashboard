import React, { useEffect, useState } from 'react';
import { AccountState, Instrument } from '../../types/trading';
import './Header.css';

interface HeaderProps {
  account: AccountState;
  instruments: Instrument[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onResetAccount: () => void;
  onOpenAnalytics: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  account,
  instruments,
  selectedSymbol,
  onSelectSymbol,
  onResetAccount,
  onOpenAnalytics,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="terminal-header">
      <div className="header-brand">
        <div className="brand-logo-icon"></div>
        <div className="brand-title">
          <h1>APEX TERMINAL</h1>
          <span>Institutional Multi-Asset Suite</span>
        </div>
      </div>

      <div className="header-ticker-tape">
        <div className="ticker-track">
          {instruments.slice(0, 6).map(inst => {
            const isPositive = inst.change24h >= 0;
            return (
              <div 
                key={inst.id} 
                className={`ticker-item ${selectedSymbol === inst.id ? 'active' : ''}`}
                onClick={() => onSelectSymbol(inst.id)}
              >
                <span className="ticker-symbol">{inst.symbol}</span>
                <span className="ticker-price tabular-nums">{inst.price.toFixed(inst.decimals)}</span>
                <span className={`ticker-change tabular-nums ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? '+' : ''}{inst.change24h.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="header-metrics">
        <div className="metric-group">
          <span className="metric-label">Balance</span>
          <span className="metric-value tabular-nums">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="metric-group">
          <span className="metric-label">Equity</span>
          <span className={`metric-value tabular-nums ${account.equity >= account.balance ? 'positive' : 'negative'}`}>
            ${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="metric-group">
          <span className="metric-label">Margin Level</span>
          <span className={`metric-value tabular-nums ${account.margin > 0 ? (account.marginLevel > 200 ? 'positive' : 'warning') : ''}`}>
            {account.margin > 0 ? `${account.marginLevel.toFixed(1)}%` : '---'}
          </span>
        </div>

        <div className="header-actions">
          <button className="btn-terminal" onClick={onOpenAnalytics}>Analytics</button>
          <button className="btn-terminal-outline" onClick={onResetAccount} title="Reset Demo Balance">Reset</button>
          <div className="system-status">
            <span className="status-dot"></span>
            <span className="status-time tabular-nums">{utcTime || '00:00:00 UTC'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
