export function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [];
  
  if (prices.length === 0) return [];
  
  let currentEma = prices[0];
  ema.push(currentEma);
  
  for (let i = 1; i < prices.length; i++) {
    currentEma = (prices[i] * k) + (currentEma * (1 - k));
    ema.push(currentEma);
  }
  
  return ema;
}

export function calculateRSI(prices: number[], period: number = 14): number[] {
  if (prices.length <= period) return new Array(prices.length).fill(50);
  
  const rsi: number[] = new Array(prices.length).fill(null);
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    gains.push(Math.max(0, diff));
    losses.push(Math.max(0, -diff));
  }
  
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < prices.length; i++) {
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi[i] = 100 - (100 / (1 + rs));
    
    if (i < prices.length - 1) {
      avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
      avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
    }
  }
  
  // Fill initial values with 50 or first calculated RSI
  const firstRsi = rsi.find(v => v !== null) || 50;
  for (let i = 0; i < prices.length; i++) {
    if (rsi[i] === null) rsi[i] = firstRsi;
  }
  
  return rsi as number[];
}
