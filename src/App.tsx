import { useTradingEngine } from './hooks/useTradingEngine';
import { Header } from './components/Header/Header';
import { Watchlist } from './components/Watchlist/Watchlist';
import { CanvasChart } from './components/Chart/CanvasChart';
import { OrderTicket } from './components/OrderTicket/OrderTicket';
import { OrderBook } from './components/OrderBook/OrderBook';
import { PositionsPanel } from './components/Positions/PositionsPanel';
import { NewsPanel } from './components/News/NewsPanel';

export function App() {
  const {
    instruments,
    activeInstrument,
    setActiveInstrument,
    candles,
    timeframe,
    setTimeframe,
    account,
    positions,
    pendingOrders,
    history,
    placeOrder,
    closePosition,
    cancelOrder
  } = useTradingEngine();

  return (
    <div className="app-container">
      <Header account={account} />
      
      <main className="terminal-main">
        <Watchlist 
          instruments={instruments} 
          activeInstrument={activeInstrument}
          onSelect={setActiveInstrument}
        />
        
        <div className="center-content">
          <div className="top-row">
            {activeInstrument && (
              <CanvasChart 
                instrument={activeInstrument}
                candles={candles}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            )}
            <OrderBook instrument={activeInstrument} />
          </div>
          <PositionsPanel 
            positions={positions}
            pendingOrders={pendingOrders}
            history={history}
            onClosePosition={closePosition}
            onCancelOrder={cancelOrder}
          />
        </div>

        {activeInstrument && (
          <div className="right-column">
            <OrderTicket 
              instrument={activeInstrument}
              account={account}
              onPlaceOrder={placeOrder}
            />
            <NewsPanel activeSymbols={activeInstrument ? [activeInstrument.symbol] : []} />
          </div>
        )}
      </main>
    </div>
  );
}
