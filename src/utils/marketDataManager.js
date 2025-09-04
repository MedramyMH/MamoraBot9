// Enhanced Market Data Manager with Forex and Crypto Support
export class MarketDataManager {
  constructor() {
    this.cache = new Map();
    this.updateInterval = 30000; // 30 seconds
    this.lastUpdate = new Map();
  }

  // Enhanced symbol list with forex and crypto
  getAvailableSymbols() {
    return {
      stocks: [
        'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX',
        'SPY', 'QQQ', 'IWM', 'GLD'
      ],
      forex: [
        'EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X', 'USDCAD=X',
        'USDCHF=X', 'NZDUSD=X', 'EURGBP=X', 'EURJPY=X', 'GBPJPY=X'
      ],
      crypto: [
        'BTC-USD', 'ETH-USD', 'BNB-USD', 'ADA-USD', 'SOL-USD',
        'DOT-USD', 'AVAX-USD', 'MATIC-USD', 'LINK-USD', 'UNI-USD'
      ]
    };
  }

  // Simulate real-time market data (in production, this would fetch from APIs)
  async fetchMarketData(symbol) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      // Generate realistic market data based on symbol type
      const symbolType = this.getSymbolType(symbol);
      const basePrice = this.getBasePrice(symbol);
      const volatility = this.getVolatility(symbolType);
      
      // Generate historical data (last 100 periods)
      const historicalData = this.generateHistoricalData(basePrice, volatility, 100);
      
      return {
        symbol: symbol,
        data: historicalData,
        lastUpdate: new Date(),
        symbolType: symbolType
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  }

  getSymbolType(symbol) {
    const symbols = this.getAvailableSymbols();
    if (symbols.forex.includes(symbol)) return 'forex';
    if (symbols.crypto.includes(symbol)) return 'crypto';
    return 'stock';
  }

  getBasePrice(symbol) {
    const basePrices = {
      // Stocks
      'AAPL': 175.00,
      'GOOGL': 135.00,
      'MSFT': 340.00,
      'TSLA': 250.00,
      'NVDA': 450.00,
      'AMZN': 140.00,
      'META': 320.00,
      'NFLX': 450.00,
      'SPY': 430.00,
      'QQQ': 370.00,
      'IWM': 190.00,
      'GLD': 180.00,
      
      // Forex (typically around 1.0 for major pairs)
      'EURUSD=X': 1.0850,
      'GBPUSD=X': 1.2650,
      'USDJPY=X': 148.50,
      'AUDUSD=X': 0.6750,
      'USDCAD=X': 1.3450,
      'USDCHF=X': 0.8950,
      'NZDUSD=X': 0.6150,
      'EURGBP=X': 0.8580,
      'EURJPY=X': 161.20,
      'GBPJPY=X': 187.90,
      
      // Crypto
      'BTC-USD': 43500.00,
      'ETH-USD': 2650.00,
      'BNB-USD': 315.00,
      'ADA-USD': 0.485,
      'SOL-USD': 98.50,
      'DOT-USD': 6.85,
      'AVAX-USD': 38.50,
      'MATIC-USD': 0.875,
      'LINK-USD': 14.50,
      'UNI-USD': 6.25
    };
    
    return basePrices[symbol] || 100.00;
  }

  getVolatility(symbolType) {
    const volatilities = {
      stock: 0.02,   // 2% daily volatility
      forex: 0.008,  // 0.8% daily volatility
      crypto: 0.05   // 5% daily volatility
    };
    
    return volatilities[symbolType] || 0.02;
  }

  generateHistoricalData(basePrice, volatility, periods) {
    const data = [];
    let currentPrice = basePrice;
    const now = new Date();
    
    for (let i = periods; i >= 0; i--) {
      // Generate realistic OHLCV data
      const timestamp = new Date(now.getTime() - (i * 15 * 60 * 1000)); // 15-minute intervals
      
      // Random walk with volatility
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      currentPrice = Math.max(0.01, currentPrice + change);
      
      const open = currentPrice;
      const high = open * (1 + Math.random() * volatility);
      const low = open * (1 - Math.random() * volatility);
      const close = low + Math.random() * (high - low);
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      data.push({
        timestamp: timestamp,
        open: parseFloat(open.toFixed(4)),
        high: parseFloat(high.toFixed(4)),
        low: parseFloat(low.toFixed(4)),
        close: parseFloat(close.toFixed(4)),
        volume: volume
      });
      
      currentPrice = close;
    }
    
    return data;
  }

  // Cache management
  shouldUpdate(symbol) {
    const lastUpdate = this.lastUpdate.get(symbol);
    if (!lastUpdate) return true;
    
    return (Date.now() - lastUpdate) > this.updateInterval;
  }

  async getCachedOrFetch(symbol) {
    if (this.shouldUpdate(symbol)) {
      const data = await this.fetchMarketData(symbol);
      if (data) {
        this.cache.set(symbol, data);
        this.lastUpdate.set(symbol, Date.now());
      }
      return data;
    }
    
    return this.cache.get(symbol) || await this.fetchMarketData(symbol);
  }

  // Get formatted symbol display name
  getSymbolDisplayName(symbol) {
    const displayNames = {
      'EURUSD=X': 'EUR/USD',
      'GBPUSD=X': 'GBP/USD',
      'USDJPY=X': 'USD/JPY',
      'AUDUSD=X': 'AUD/USD',
      'USDCAD=X': 'USD/CAD',
      'USDCHF=X': 'USD/CHF',
      'NZDUSD=X': 'NZD/USD',
      'EURGBP=X': 'EUR/GBP',
      'EURJPY=X': 'EUR/JPY',
      'GBPJPY=X': 'GBP/JPY',
      'BTC-USD': 'BTC/USDT',
      'ETH-USD': 'ETH/USDT',
      'BNB-USD': 'BNB/USDT',
      'ADA-USD': 'ADA/USDT',
      'SOL-USD': 'SOL/USDT',
      'DOT-USD': 'DOT/USDT',
      'AVAX-USD': 'AVAX/USDT',
      'MATIC-USD': 'MATIC/USDT',
      'LINK-USD': 'LINK/USDT',
      'UNI-USD': 'UNI/USDT'
    };
    
    return displayNames[symbol] || symbol;
  }

  // Get symbol category for UI grouping
  getSymbolCategory(symbol) {
    const symbols = this.getAvailableSymbols();
    
    if (symbols.forex.includes(symbol)) return 'Forex';
    if (symbols.crypto.includes(symbol)) return 'Crypto';
    return 'Stocks';
  }
}