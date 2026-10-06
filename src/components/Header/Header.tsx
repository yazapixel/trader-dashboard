import React from 'react';
import type { AccountState } from '../../types/trading';
import './Header.css';

interface HeaderProps {
  account: AccountState;
}

export const Header: React.FC<HeaderProps> = ({ account }) => {
  const marginLevelColor = account.marginLevel > 150 ? 'bullish' : (account.marginLevel > 100 ? 'caution' : 'bearish');

  return (
    <header className="terminal-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">▲</span>
          APEX <span className="logo-accent">TRADER</span>
        </div>
        <div className="system-status">
          <span className="status-dot online"></span>
          LIVE
        </div>
      </div>

      <div className="account-metrics">
        <div className="metric">
          <span className="label">Balance</span>
          <span className="value mono">${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="metric">
          <span className="label">Equity</span>
          <span className="value mono">${account.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="metric">
          <span className="label">Margin</span>
          <span className="value mono">${account.margin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="metric">
          <span className="label">Free Margin</span>
          <span className="value mono">${account.freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="metric">
          <span className="label">Margin Level</span>
          <span className={`value mono ${marginLevelColor}`}>
            {account.margin > 0 ? `${account.marginLevel.toFixed(1)}%` : '∞'}
          </span>
        </div>
      </div>

      <div className="header-right">
        <div className="real-time-clock mono">
          {new Date().toLocaleTimeString()} UTC
        </div>
      </div>
    </header>
  );
};
