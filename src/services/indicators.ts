import { Candle } from '../types/trading';

export function calculateEMA(candles: Candle[], period: number): (number | null)[] {
  const closes = candles.map(c => c.close);
  const result: (number | null)[] = new Array(closes.length).fill(null);
  if (closes.length === 0) return result;

  const multiplier = 2 / (period + 1);
  let sum = 0;

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      sum += closes[i];
    } else if (i === period - 1) {
      sum += closes[i];
      result[i] = sum / period;
    } else {
      const prevEMA = result[i - 1];
      if (prevEMA !== null) {
        result[i] = (closes[i] - prevEMA) * multiplier + prevEMA;
      }
    }
  }

  return result;
}

export function calculateRSI(candles: Candle[], period: number = 14): (number | null)[] {
  const closes = candles.map(c => c.close);
  const result: (number | null)[] = new Array(closes.length).fill(null);
  if (closes.length <= period) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  result[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff >= 0 ? 0 : -diff;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      result[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      result[i] = 100 - (100 / (1 + rs));
    }
  }

  return result;
}
