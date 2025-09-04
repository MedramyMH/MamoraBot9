/**
 * Binance WebSocket API utilities for live crypto data
 */
import { setSymbolDecimals } from './technicalIndicators';

// List of available USDC and USDT trading pairs
export const getTradingPairs = async () => {
  try {
    // Fetch exchange information from Binance API
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const data = await response.json();
    
    // Filter for USDC pairs, fallback to USDT if no USDC pairs
    const usdcPairs = data.symbols
      .filter(symbol => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDC')
      .map(symbol => symbol.symbol);
      
    // If no USDC pairs found, use USDT pairs as fallback
    if (usdcPairs.length === 0) {
      return data.symbols
        .filter(symbol => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT')
        .map(symbol => symbol.symbol);
    }
    
    return usdcPairs;
  } catch (error) {
    console.error('Error fetching trading pairs:', error);
    return [];
  }
};

// Initialize WebSocket connection to Binance for price data
export const createPriceWebSocket = (symbol, onMessage) => {
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`);
  
  ws.onopen = () => {
    console.log(`WebSocket connection opened for ${symbol}`);
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Cache the decimal precision from actual price data
    setSymbolDecimals(symbol, parseFloat(data.c));
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error(`WebSocket error for ${symbol}:`, error);
  };
  
  ws.onclose = () => {
    console.log(`WebSocket connection closed for ${symbol}`);
  };
  
  return ws;
};

// Create WebSocket for candlestick data for technical indicators
export const createKlineWebSocket = (symbol, interval, onMessage) => {
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);
  
  ws.onopen = () => {
    console.log(`Kline WebSocket connection opened for ${symbol} - ${interval}`);
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error(`Kline WebSocket error for ${symbol} - ${interval}:`, error);
  };
  
  ws.onclose = () => {
    console.log(`Kline WebSocket connection closed for ${symbol} - ${interval}`);
  };
  
  return ws;
};

// Fetch historical candle data for initial calculations
export const fetchHistoricalData = async (symbol, interval, limit = 100) => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
    const data = await response.json();
    
    // Format candle data and cache decimal precision
    return data.map(candle => {
      const candleData = {
        time: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
        closeTime: candle[6],
        quoteAssetVolume: parseFloat(candle[7]),
        trades: candle[8],
        takerBuyBaseAssetVolume: parseFloat(candle[9]),
        takerBuyQuoteAssetVolume: parseFloat(candle[10])
      };
      
      // Cache decimal precision from close price
      setSymbolDecimals(symbol, candleData.close);
      return candleData;
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

// Get hourly performance data
export const fetchHourlyPerformance = async (symbol) => {
  try {
    // Get data for the last 5 hours (5 candles)
    const data = await fetchHistoricalData(symbol, '1h', 5);
    
    // Calculate percentage changes for each hour
    return data.map((candle, index) => {
      // Calculate percentage change from open to close for each candle
      const percentChange = ((candle.close - candle.open) / candle.open) * 100;
      
      // Format timestamp to hour in 24-hour format
      const date = new Date(candle.time);
      const hour = date.getHours();
      
      return {
        hour,
        percentChange: percentChange,
        formattedHour: `${hour.toString().padStart(2, '0')}:00`
      };
    }).reverse(); // Reverse to get most recent first
  } catch (error) {
    console.error('Error calculating hourly performance:', error);
    return [];
  }
};

// Calculate current hour progress
export const getCurrentHourProgress = async (symbol) => {
  try {
    // Get the current hour's data
    const now = new Date();
    const currentHour = now.getHours();
    const minutesIntoHour = now.getMinutes();
    
    // Get the latest ticker price
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    const ticker = await response.json();
    const currentPrice = parseFloat(ticker.price);
    
    // Get the opening price for this hour
    const hourOpenData = await fetchHistoricalData(symbol, '1h', 1);
    const hourOpenPrice = hourOpenData[0].open;
    
    // Calculate percentage change from hour open to current price
    const percentChange = ((currentPrice - hourOpenPrice) / hourOpenPrice) * 100;
    
    return {
      hour: currentHour,
      formattedHour: `${currentHour.toString().padStart(2, '0')}:00`,
      minutesIntoHour,
      percentChange: percentChange
    };
  } catch (error) {
    console.error('Error calculating current hour progress:', error);
    return {
      hour: new Date().getHours(),
      formattedHour: `${new Date().getHours().toString().padStart(2, '0')}:00`,
      minutesIntoHour: new Date().getMinutes(),
      percentChange: 0
    };
  }
};

// Fetch enough historical data for calculating MAs and crosses
export const fetchExtendedHistoricalData = async (symbol, interval) => {
  // For longer period MAs like MA200, we need more data
  const limit = 500; // Maximum allowed by Binance API
  return fetchHistoricalData(symbol, interval, limit);
};