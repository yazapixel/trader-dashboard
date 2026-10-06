export type NewsCategory = 'Forex' | 'Crypto' | 'Indices' | 'Commodities' | 'Macro';
export type NewsSentiment = 'bullish' | 'bearish' | 'neutral';
export type ImpactLevel = 'high' | 'medium' | 'low';

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  category: NewsCategory;
  sentiment: NewsSentiment;
  impact: ImpactLevel;
  relatedSymbols: string[];
  source: string;
  publishedAt: number;
  isBreaking?: boolean;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  countryCode: string;
  currency: string;
  impact: ImpactLevel;
  scheduledAt: number;
  actual?: string;
  forecast?: string;
  previous?: string;
  isReleased: boolean;
}

const SOURCES = [
  'Reuters',
  'Bloomberg',
  'MarketWatch',
  'Financial Times',
  'CNBC',
  'Investing.com',
  'ForexFactory',
  'CoinDesk',
  'Wall Street Journal',
];

const NEWS_TEMPLATES: Omit<NewsItem, 'id' | 'publishedAt'>[] = [
  {
    headline: 'Fed Chair Signals Cautious Approach to Rate Cuts Amid Sticky Inflation',
    summary: 'Federal Reserve Chair indicated policymakers will remain data-dependent, with markets now pricing in fewer cuts than previously expected through end of year.',
    category: 'Macro',
    sentiment: 'bearish',
    impact: 'high',
    relatedSymbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
    source: 'Reuters',
    isBreaking: true,
  },
  {
    headline: 'Bitcoin Surges Past $67,000 as ETF Inflows Hit Monthly Record',
    summary: 'Spot Bitcoin ETFs recorded over $800M in net inflows this week, pushing BTC to its highest level in three months as institutional demand continues to accelerate.',
    category: 'Crypto',
    sentiment: 'bullish',
    impact: 'high',
    relatedSymbols: ['BTC/USD', 'ETH/USD'],
    source: 'CoinDesk',
  },
  {
    headline: 'ECB Holds Rates Steady, Dovish Language Boosts EUR Downside Bets',
    summary: 'The European Central Bank maintained its deposit rate at 4.0% but acknowledged growth risks, fueling expectations of an earlier-than-expected pivot.',
    category: 'Forex',
    sentiment: 'bearish',
    impact: 'high',
    relatedSymbols: ['EUR/USD'],
    source: 'Financial Times',
  },
  {
    headline: 'S&P 500 Hits All-Time High Driven by Tech Earnings Beat',
    summary: 'Major tech names delivered blowout Q3 results, driving the S&P 500 to record territory. Analysts raise year-end targets following better-than-expected margins.',
    category: 'Indices',
    sentiment: 'bullish',
    impact: 'medium',
    relatedSymbols: ['SPX 500', 'NAS 100'],
    source: 'Bloomberg',
  },
  {
    headline: 'Gold Retreats as Dollar Strengthens on Strong NFP Data',
    summary: 'Non-farm payrolls surprised to the upside with 287K jobs added, well above the 185K forecast. Gold fell $22 as yields jumped and the USD index hit 2-month highs.',
    category: 'Commodities',
    sentiment: 'bearish',
    impact: 'high',
    relatedSymbols: ['XAU/USD'],
    source: 'MarketWatch',
  },
  {
    headline: 'Bank of Japan Unexpectedly Raises Rates, Yen Spikes 1.5%',
    summary: 'The BoJ voted 7-2 to raise its policy rate to 0.25%, citing sustained achievement of 2% inflation target. USD/JPY dropped 200 pips in minutes following the decision.',
    category: 'Forex',
    sentiment: 'bullish',
    impact: 'high',
    relatedSymbols: ['USD/JPY'],
    source: 'Reuters',
    isBreaking: true,
  },
  {
    headline: 'Ethereum Foundation Announces Major Protocol Upgrade Timeline',
    summary: 'Core developers confirmed the next hard fork targeting Q1 next year, introducing significant gas optimizations expected to reduce transaction costs by up to 40%.',
    category: 'Crypto',
    sentiment: 'bullish',
    impact: 'medium',
    relatedSymbols: ['ETH/USD', 'SOL/USD'],
    source: 'CoinDesk',
  },
  {
    headline: 'Oil Slides on Demand Concerns as China PMI Misses Expectations',
    summary: 'Brent crude fell below $81 after China\'s manufacturing PMI came in at 49.2, signaling contraction. OPEC+ supply cuts have so far failed to offset weak demand outlook.',
    category: 'Commodities',
    sentiment: 'bearish',
    impact: 'medium',
    relatedSymbols: ['XTI/USD'],
    source: 'Bloomberg',
  },
  {
    headline: 'GBP Rallies After UK Inflation Beats Forecast at 3.1%',
    summary: 'UK CPI came in hotter than the 2.8% consensus estimate, pushing back market pricing for Bank of England rate cuts. Cable surged 80 pips on the release.',
    category: 'Forex',
    sentiment: 'bullish',
    impact: 'high',
    relatedSymbols: ['GBP/USD'],
    source: 'Financial Times',
  },
  {
    headline: 'Nasdaq 100 Futures Slip on Semiconductor Export Restrictions',
    summary: 'New US export controls on advanced AI chips to key markets weighed on semiconductor stocks in after-hours trading, with Nasdaq futures down 0.8%.',
    category: 'Indices',
    sentiment: 'bearish',
    impact: 'medium',
    relatedSymbols: ['NAS 100'],
    source: 'Wall Street Journal',
  },
  {
    headline: 'AUD/USD Climbs on RBA Hawkish Hold, Iron Ore Price Surge',
    summary: 'Reserve Bank of Australia kept rates on hold but surprised markets with an unexpectedly hawkish statement. AUD strengthened broadly as iron ore rose 3.2%.',
    category: 'Forex',
    sentiment: 'bullish',
    impact: 'medium',
    relatedSymbols: ['AUD/USD'],
    source: 'Investing.com',
  },
  {
    headline: 'Solana Network Outage Lasts 4 Hours, SOL Drops 8%',
    summary: 'The Solana blockchain experienced its third major outage this year due to a validator congestion issue, sparking fresh concerns about network reliability at scale.',
    category: 'Crypto',
    sentiment: 'bearish',
    impact: 'high',
    relatedSymbols: ['SOL/USD'],
    source: 'CoinDesk',
  },
  {
    headline: 'Dow Jones Hits Record High Amid Hopes for Soft Landing',
    summary: 'The Dow Jones Industrial Average crossed 40,000 for the first time as core PCE data showed inflation cooling without significant labor market deterioration.',
    category: 'Indices',
    sentiment: 'bullish',
    impact: 'medium',
    relatedSymbols: ['US 30', 'SPX 500'],
    source: 'CNBC',
  },
  {
    headline: 'Gold Rallies on Safe-Haven Demand Amid Geopolitical Tensions',
    summary: 'Escalating regional conflicts drove safe-haven flows into gold, which briefly touched $2,380/oz. Central bank buying from emerging markets also continues to provide a floor.',
    category: 'Commodities',
    sentiment: 'bullish',
    impact: 'medium',
    relatedSymbols: ['XAU/USD'],
    source: 'Reuters',
  },
  {
    headline: 'EUR/USD Breaks Below 1.0800 Support on Diverging PMI Data',
    summary: 'Eurozone composite PMI fell to 47.2 vs US PMI at 52.8, widening the growth differential and reinforcing dollar strength. Next technical support at 1.0750.',
    category: 'Forex',
    sentiment: 'bearish',
    impact: 'medium',
    relatedSymbols: ['EUR/USD'],
    source: 'ForexFactory',
  },
];

const ECONOMIC_EVENTS_TEMPLATES: Omit<EconomicEvent, 'id' | 'scheduledAt' | 'isReleased'>[] = [
  {
    title: 'Non-Farm Payrolls',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    impact: 'high',
    forecast: '185K',
    previous: '227K',
  },
  {
    title: 'Fed Interest Rate Decision',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    impact: 'high',
    forecast: '5.25%',
    previous: '5.50%',
  },
  {
    title: 'CPI (YoY)',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    impact: 'high',
    forecast: '3.1%',
    previous: '3.2%',
  },
  {
    title: 'ECB Interest Rate Decision',
    country: 'Eurozone',
    countryCode: 'EU',
    currency: 'EUR',
    impact: 'high',
    forecast: '4.00%',
    previous: '4.25%',
  },
  {
    title: 'Eurozone CPI Flash (YoY)',
    country: 'Eurozone',
    countryCode: 'EU',
    currency: 'EUR',
    impact: 'high',
    forecast: '2.4%',
    previous: '2.6%',
  },
  {
    title: 'UK CPI (YoY)',
    country: 'United Kingdom',
    countryCode: 'GB',
    currency: 'GBP',
    impact: 'high',
    forecast: '2.8%',
    previous: '3.0%',
  },
  {
    title: 'Bank of England Rate Decision',
    country: 'United Kingdom',
    countryCode: 'GB',
    currency: 'GBP',
    impact: 'high',
    forecast: '5.25%',
    previous: '5.25%',
  },
  {
    title: 'BoJ Policy Rate',
    country: 'Japan',
    countryCode: 'JP',
    currency: 'JPY',
    impact: 'high',
    forecast: '0.10%',
    previous: '0.10%',
  },
  {
    title: 'Japan CPI (YoY)',
    country: 'Japan',
    countryCode: 'JP',
    currency: 'JPY',
    impact: 'medium',
    forecast: '2.2%',
    previous: '2.4%',
  },
  {
    title: 'China Manufacturing PMI',
    country: 'China',
    countryCode: 'CN',
    currency: 'CNY',
    impact: 'high',
    forecast: '50.2',
    previous: '49.8',
  },
  {
    title: 'US GDP (QoQ)',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    impact: 'high',
    forecast: '2.8%',
    previous: '3.1%',
  },
  {
    title: 'US Retail Sales (MoM)',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    impact: 'medium',
    forecast: '0.3%',
    previous: '0.1%',
  },
  {
    title: 'Eurozone GDP Flash (QoQ)',
    country: 'Eurozone',
    countryCode: 'EU',
    currency: 'EUR',
    impact: 'medium',
    forecast: '0.3%',
    previous: '0.2%',
  },
  {
    title: 'AUD RBA Rate Decision',
    country: 'Australia',
    countryCode: 'AU',
    currency: 'AUD',
    impact: 'high',
    forecast: '4.35%',
    previous: '4.35%',
  },
  {
    title: 'Canada Employment Change',
    country: 'Canada',
    countryCode: 'CA',
    currency: 'CAD',
    impact: 'medium',
    forecast: '22.5K',
    previous: '15.0K',
  },
  {
    title: 'US ISM Manufacturing PMI',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    impact: 'medium',
    forecast: '49.5',
    previous: '48.7',
  },
  {
    title: 'EIA Crude Oil Inventories',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    impact: 'medium',
    forecast: '-1.2M',
    previous: '0.8M',
  },
  {
    title: 'FOMC Meeting Minutes',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    impact: 'medium',
    forecast: undefined,
    previous: undefined,
  },
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateNewsItems(): NewsItem[] {
  const now = Date.now();
  const items: NewsItem[] = [];

  NEWS_TEMPLATES.forEach((template, index) => {
    const minutesAgo = index * 8 + Math.floor(Math.random() * 5);
    items.push({
      ...template,
      id: generateId(),
      source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
      publishedAt: now - minutesAgo * 60 * 1000,
    });
  });

  return items.sort((a, b) => b.publishedAt - a.publishedAt);
}

export function generateEconomicCalendar(): EconomicEvent[] {
  const now = Date.now();
  const events: EconomicEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const RELEASE_TIMES = [8, 9.5, 10, 12, 13, 13.5, 14, 15, 15.5, 16, 17, 18, 19];

  ECONOMIC_EVENTS_TEMPLATES.forEach((template, index) => {
    const dayOffset = Math.floor(index / 4) - 1; // spread across -1, 0, 1, 2 days
    const timeIndex = index % RELEASE_TIMES.length;
    const releaseHour = RELEASE_TIMES[timeIndex];
    const releaseTime = today.getTime() + dayOffset * 86400000 + releaseHour * 3600000;
    const isReleased = releaseTime <= now;

    const event: EconomicEvent = {
      ...template,
      id: generateId(),
      scheduledAt: releaseTime,
      isReleased,
    };

    if (isReleased) {
      // Generate actual slightly off from forecast
      if (template.forecast) {
        const forecastNum = parseFloat(template.forecast);
        if (!isNaN(forecastNum)) {
          const variance = forecastNum * 0.05 * (Math.random() - 0.4);
          const actualNum = forecastNum + variance;
          const decimals = template.forecast.includes('.') ? template.forecast.split('.')[1].replace(/[^0-9]/g, '').length : 0;
          const suffix = template.forecast.replace(/[0-9.-]/g, '');
          event.actual = `${actualNum.toFixed(decimals)}${suffix}`;
        }
      }
    }

    events.push(event);
  });

  return events.sort((a, b) => a.scheduledAt - b.scheduledAt);
}

export function getBreakingNews(items: NewsItem[]): NewsItem | null {
  return items.find(n => n.isBreaking) ?? null;
}
