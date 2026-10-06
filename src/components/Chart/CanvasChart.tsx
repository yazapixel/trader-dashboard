import React, { useRef, useEffect, useState, useMemo } from 'react';
import type { Candle, Instrument } from '../../types/trading';
import { calculateEMA, calculateRSI } from '../../services/indicators';
import './CanvasChart.css';

interface CanvasChartProps {
  instrument: Instrument;
  candles: Candle[];
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
}

export const CanvasChart: React.FC<CanvasChartProps> = ({
  instrument,
  candles,
  timeframe,
  onTimeframeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const rsiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);

  const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'];

  const indicators = useMemo(() => {
    const prices = candles.map(c => c.close);
    return {
      ema20: calculateEMA(prices, 20),
      ema50: calculateEMA(prices, 50),
      rsi14: calculateRSI(prices, 14),
    };
  }, [candles]);

  const render = () => {
    if (!mainCanvasRef.current || !rsiCanvasRef.current || candles.length === 0) return;

    const mainCtx = mainCanvasRef.current.getContext('2d');
    const rsiCtx = rsiCanvasRef.current.getContext('2d');
    if (!mainCtx || !rsiCtx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = mainCanvasRef.current.width / dpr;
    const mainHeight = mainCanvasRef.current.height / dpr;
    const rsiHeight = rsiCanvasRef.current.height / dpr;

    // Clear
    mainCtx.clearRect(0, 0, width * dpr, mainHeight * dpr);
    rsiCtx.clearRect(0, 0, width * dpr, rsiHeight * dpr);

    mainCtx.scale(dpr, dpr);
    rsiCtx.scale(dpr, dpr);

    // Padding
    const paddingRight = 60;
    const paddingTop = 20;
    const paddingBottom = 20;
    const chartWidth = width - paddingRight;
    const mainChartHeight = mainHeight - paddingTop - paddingBottom;

    // Scaling
    const minPrice = Math.min(...candles.map(c => c.low));
    const maxPrice = Math.max(...candles.map(c => c.high));
    const priceRange = maxPrice - minPrice;
    const candleWidth = chartWidth / candles.length;

    const getX = (i: number) => i * candleWidth + candleWidth / 2;
    const getY = (price: number) => 
      mainChartHeight - ((price - minPrice) / priceRange) * mainChartHeight + paddingTop;

    // Grid lines
    mainCtx.strokeStyle = '#1e293d';
    mainCtx.lineWidth = 1;
    mainCtx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const y = paddingTop + (i * mainChartHeight) / 5;
      mainCtx.moveTo(0, y);
      mainCtx.lineTo(chartWidth, y);
      
      // Price labels
      mainCtx.fillStyle = '#64748b';
      mainCtx.font = '10px monospace';
      const labelPrice = maxPrice - (i * priceRange) / 5;
      mainCtx.fillText(labelPrice.toFixed(instrument.decimals), chartWidth + 5, y + 3);
    }
    mainCtx.stroke();

    // Candles
    candles.forEach((candle, i) => {
      const x = getX(i);
      const isUp = candle.close >= candle.open;
      mainCtx.strokeStyle = isUp ? '#10b981' : '#f43f5e';
      mainCtx.fillStyle = isUp ? '#10b981' : '#f43f5e';
      
      // Wick
      mainCtx.beginPath();
      mainCtx.moveTo(x, getY(candle.high));
      mainCtx.lineTo(x, getY(candle.low));
      mainCtx.stroke();
      
      // Body
      const bodyTop = getY(Math.max(candle.open, candle.close));
      const bodyBottom = getY(Math.min(candle.open, candle.close));
      mainCtx.fillRect(x - candleWidth * 0.35, bodyTop, candleWidth * 0.7, Math.max(1, bodyBottom - bodyTop));
    });

    // EMA 20
    mainCtx.strokeStyle = '#38bdf8';
    mainCtx.lineWidth = 1.5;
    mainCtx.beginPath();
    indicators.ema20.forEach((val, i) => {
      if (i === 0) mainCtx.moveTo(getX(i), getY(val));
      else mainCtx.lineTo(getX(i), getY(val));
    });
    mainCtx.stroke();

    // EMA 50
    mainCtx.strokeStyle = '#f59e0b';
    mainCtx.beginPath();
    indicators.ema50.forEach((val, i) => {
      if (i === 0) mainCtx.moveTo(getX(i), getY(val));
      else mainCtx.lineTo(getX(i), getY(val));
    });
    mainCtx.stroke();

    // RSI
    rsiCtx.strokeStyle = '#1e293d';
    rsiCtx.beginPath();
    [30, 70].forEach(level => {
      const y = rsiHeight - (level / 100) * rsiHeight;
      rsiCtx.moveTo(0, y);
      rsiCtx.lineTo(chartWidth, y);
    });
    rsiCtx.stroke();

    rsiCtx.strokeStyle = '#8b5cf6';
    rsiCtx.lineWidth = 1.5;
    rsiCtx.beginPath();
    indicators.rsi14.forEach((val, i) => {
      const x = getX(i);
      const y = rsiHeight - (val / 100) * rsiHeight;
      if (i === 0) rsiCtx.moveTo(x, y);
      else rsiCtx.lineTo(x, y);
    });
    rsiCtx.stroke();

    // Crosshair
    if (crosshair) {
      mainCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      mainCtx.setLineDash([5, 5]);
      
      // Vertical
      mainCtx.beginPath();
      mainCtx.moveTo(crosshair.x, 0);
      mainCtx.lineTo(crosshair.x, mainHeight);
      mainCtx.stroke();
      
      // Horizontal
      mainCtx.beginPath();
      mainCtx.moveTo(0, crosshair.y);
      mainCtx.lineTo(width, crosshair.y);
      mainCtx.stroke();
      
      mainCtx.setLineDash([]);

      // Data Tooltip
      const index = Math.floor(crosshair.x / candleWidth);
      if (candles[index]) {
        const c = candles[index];
        const dataText = `O: ${c.open.toFixed(instrument.decimals)} H: ${c.high.toFixed(instrument.decimals)} L: ${c.low.toFixed(instrument.decimals)} C: ${c.close.toFixed(instrument.decimals)} V: ${c.volume}`;
        mainCtx.fillStyle = '#f1f5f9';
        mainCtx.font = 'bold 12px monospace';
        mainCtx.fillText(dataText, 10, 20);
      }
    }

    mainCtx.setTransform(1, 0, 0, 1, 0, 0);
    rsiCtx.setTransform(1, 0, 0, 1, 0, 0);
  };

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !mainCanvasRef.current || !rsiCanvasRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      mainCanvasRef.current.width = width * dpr;
      mainCanvasRef.current.height = (height * 0.75) * dpr;
      mainCanvasRef.current.style.width = `${width}px`;
      mainCanvasRef.current.style.height = `${height * 0.75}px`;

      rsiCanvasRef.current.width = width * dpr;
      rsiCanvasRef.current.height = (height * 0.2) * dpr;
      rsiCanvasRef.current.style.width = `${width}px`;
      rsiCanvasRef.current.style.height = `${height * 0.2}px`;
      
      render();
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [candles, crosshair, instrument]);

  return (
    <div className="chart-container" ref={containerRef}>
      <div className="chart-controls">
        <div className="instrument-info">
          <span className="symbol">{instrument.symbol}</span>
          <span className="name">{instrument.name}</span>
        </div>
        <div className="timeframe-selector">
          {TIMEFRAMES.map(tf => (
            <button 
              key={tf} 
              className={timeframe === tf ? 'active' : ''}
              onClick={() => onTimeframeChange(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <canvas 
        ref={mainCanvasRef} 
        onMouseMove={(e) => {
          const rect = mainCanvasRef.current!.getBoundingClientRect();
          setCrosshair({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => setCrosshair(null)}
      />
      <canvas ref={rsiCanvasRef} />
    </div>
  );
};
