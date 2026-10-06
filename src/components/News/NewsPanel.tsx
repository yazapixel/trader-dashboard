import React, { useState, useEffect, useCallback } from 'react';
import type { NewsItem, EconomicEvent } from '../../services/newsData';
import { generateNewsItems, generateEconomicCalendar } from '../../services/newsData';
import './NewsPanel.css';

type PanelTab = 'news' | 'calendar';

interface NewsPanelProps {
  activeSymbols?: string[];
}

export const NewsPanel: React.FC<NewsPanelProps> = ({ activeSymbols = [] }) => {
  const [activeTab, setActiveTab] = useState<PanelTab>('news');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<EconomicEvent[]>([]);
  const [filterImpact, setFilterImpact] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);
  const [newFlashIds, setNewFlashIds] = useState<Set<string>>(new Set());

  const refreshNews = useCallback(() => {
    const items = generateNewsItems();
    setNewsItems(prev => {
      const newIds = items
        .filter(n => !prev.some(p => p.headline === n.headline))
        .map(n => n.id);
      if (newIds.length > 0) {
        setNewFlashIds(new Set(newIds));
        setTimeout(() => setNewFlashIds(new Set()), 3000);
      }
      return items;
    });
    setCalendarEvents(generateEconomicCalendar());
  }, []);

  useEffect(() => {
    refreshNews();
    const interval = setInterval(refreshNews, 90000); // refresh every 90s
    return () => clearInterval(interval);
  }, [refreshNews]);

  const filteredNews = filterImpact === 'all'
    ? newsItems
    : newsItems.filter(n => n.impact === filterImpact);

  const filteredEvents = filterImpact === 'all'
    ? calendarEvents
    : calendarEvents.filter(e => e.impact === filterImpact);

  const formatTimeAgo = (ts: number): string => {
    const diffMs = Date.now() - ts;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return `${Math.floor(diffH / 24)}d ago`;
  };

  const formatEventTime = (ts: number): string => {
    const d = new Date(ts);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(ts);
    eventDay.setHours(0, 0, 0, 0);

    const diffDays = Math.round((eventDay.getTime() - today.getTime()) / 86400000);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diffDays === -1) return `Yesterday ${timeStr}`;
    if (diffDays === 0) return `Today ${timeStr}`;
    if (diffDays === 1) return `Tomorrow ${timeStr}`;
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${timeStr}`;
  };

  const getActualClass = (event: EconomicEvent): string => {
    if (!event.actual || !event.forecast) return '';
    const actualNum = parseFloat(event.actual);
    const forecastNum = parseFloat(event.forecast);
    if (isNaN(actualNum) || isNaN(forecastNum)) return '';
    return actualNum > forecastNum ? 'bullish' : actualNum < forecastNum ? 'bearish' : '';
  };

  const upcomingCount = calendarEvents.filter(e => !e.isReleased && e.impact === 'high').length;

  return (
    <div className="news-panel">
      <div className="news-panel-header">
        <div className="news-tabs">
          <button
            className={activeTab === 'news' ? 'active' : ''}
            onClick={() => setActiveTab('news')}
          >
            News Feed
          </button>
          <button
            className={activeTab === 'calendar' ? 'active' : ''}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
            {upcomingCount > 0 && (
              <span className="event-badge">{upcomingCount}</span>
            )}
          </button>
        </div>
        <div className="news-filter-row">
          {(['all', 'high', 'medium', 'low'] as const).map(lvl => (
            <button
              key={lvl}
              className={`impact-filter ${filterImpact === lvl ? 'active' : ''} ${lvl !== 'all' ? `impact-${lvl}` : ''}`}
              onClick={() => setFilterImpact(lvl)}
            >
              {lvl === 'all' ? 'All' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="news-panel-body">
        {activeTab === 'news' && (
          <div className="news-list">
            {filteredNews.length === 0 && (
              <div className="news-empty">No news items match the current filter.</div>
            )}
            {filteredNews.map(item => (
              <div
                key={item.id}
                className={[
                  'news-item',
                  item.sentiment,
                  item.isBreaking ? 'breaking' : '',
                  newFlashIds.has(item.id) ? 'flash-new' : '',
                  expandedNewsId === item.id ? 'expanded' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setExpandedNewsId(prev => prev === item.id ? null : item.id)}
              >
                <div className="news-item-top">
                  <div className="news-meta">
                    {item.isBreaking && <span className="breaking-badge">BREAKING</span>}
                    <span className={`impact-dot impact-${item.impact}`} title={`${item.impact} impact`} />
                    <span className="news-source">{item.source}</span>
                    <span className="news-time">{formatTimeAgo(item.publishedAt)}</span>
                  </div>
                  <div className="news-symbols">
                    {item.relatedSymbols.map(s => (
                      <span key={s} className={`symbol-tag ${activeSymbols.includes(s) ? 'active-symbol' : ''}`}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="news-headline">{item.headline}</div>
                {expandedNewsId === item.id && (
                  <div className="news-summary">{item.summary}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-list">
            {filteredEvents.length === 0 && (
              <div className="news-empty">No events match the current filter.</div>
            )}
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className={`calendar-event ${event.isReleased ? 'released' : 'upcoming'} impact-border-${event.impact}`}
              >
                <div className="event-left">
                  <div className="event-time-label">
                    {formatEventTime(event.scheduledAt)}
                    {!event.isReleased && event.impact === 'high' && (
                      <span className="event-alert-icon" title="High impact event">!</span>
                    )}
                  </div>
                  <div className="event-flag" title={event.country}>
                    <span className="event-currency">{event.currency}</span>
                  </div>
                </div>

                <div className="event-center">
                  <div className="event-title">{event.title}</div>
                  <div className="event-country">{event.country}</div>
                </div>

                <div className="event-right">
                  <div className={`impact-pill impact-${event.impact}`}>{event.impact}</div>
                  <div className="event-data">
                    {event.actual !== undefined ? (
                      <span className={`event-actual ${getActualClass(event)}`}>{event.actual}</span>
                    ) : (
                      <span className="event-pending">TBD</span>
                    )}
                    {event.forecast && (
                      <span className="event-forecast" title="Forecast">{event.forecast}</span>
                    )}
                    {event.previous && (
                      <span className="event-previous" title="Previous">{event.previous}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
