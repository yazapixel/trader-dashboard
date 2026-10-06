import React, { useState } from 'react';
import type { Instrument, AssetCategory } from '../../types/trading';
import './Watchlist.css';

interface WatchlistProps {
  instruments: Instrument[];
  activeInstrument: Instrument | null;
  onSelect: (instrument: Instrument) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({
  instruments,
  activeInstrument,
  onSelect,
}) => {
  const [filter, setFilter] = useState<AssetCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = instruments.filter(i => {
    const matchesFilter = filter === 'All' || i.category === filter;
    const matchesSearch = i.symbol.toLowerCase().includes(search.toLowerCase()) || 
                          i.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="watchlist">
      <div className="watchlist-header">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search instruments..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="category-filters">
          {['All', 'Forex', 'Crypto', 'Indices', 'Commodities'].map(cat => (
            <button 
              key={cat}
              className={filter === cat ? 'active' : ''}
              onClick={() => setFilter(cat as any)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="instrument-list">
        {filtered.map(inst => (
          <div 
            key={inst.id} 
            className={`instrument-item ${activeInstrument?.id === inst.id ? 'active' : ''}`}
            onClick={() => onSelect(inst)}
          >
            <div className="inst-main">
              <span className="inst-symbol">{inst.symbol}</span>
              <span className="inst-category">{inst.category}</span>
            </div>
            <div className="inst-price-box">
              <span className={`inst-price ${inst.change24h >= 0 ? 'bullish' : 'bearish'}`}>
                {inst.price.toFixed(inst.decimals)}
              </span>
              <span className={`inst-change ${inst.change24h >= 0 ? 'bullish' : 'bearish'}`}>
                {inst.change24h >= 0 ? '+' : ''}{inst.change24h}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
