// Trading Data Manager - Handles market data fetching and processing
// Simulates real-time market data with technical indicators

export class TradingDataManager {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = new Map();
    this.updateInterval = 30000; // 30 seconds
  }

  // Get market data for a symbol
  async getMarketData(symbol) {
    try {
      // Check cache first
      if (this.shouldUseCache(symbol)) {
        return this.cache.get(symbol);
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate realistic market data
      const marketData = this.generateMarketData(symbol);
      
      // Cache the data
      this.cache.set(symbol, marketData);
      this.lastUpdate.set(symbol, Date.now());

      return marketData;
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      return null;
    }
  }

  // Check if we should use cached data
  shouldUseCache(symbol) {
    if (!this.cache.has(symbol) || !this.lastUpdate.has(symbol)) {
      return false;
    }

    const lastUpdate = this.lastUpdate.get(symbol);
    return (Date.now() - lastUpdate) < this.updateInterval;
  }

  // Generate realistic market data
  generateMarketData(symbol) {
    // Base prices for different symbols
    const basePrices = {
      'AAPL': 175.50,
      'GOOGL': 142.30,
      'MSFT': 415.20,
      'TSLA': 248.75,
      'NVDA': 875.40,
      'AMZN': 145.80,
      'META': 485.60,
      'NFLX': 445.20,
      'SPY': 450.30,
      'QQQ': 385.70,
      'IWM': 198.50,
      'GLD': 185.40,
      'BTC-USD': 43250.00,
      'ETH-USD': 2650.00
    };

    const basePrice = basePrices[symbol] || 100;
    
    // Add some random variation (-5% to +5%)
    const variation = (Math.random() - 0.5) * 0.1;
    const currentPrice = basePrice * (1 + variation);
    
    // Generate price change
    const priceChange = (Math.random() - 0.5) * 6; // -3% to +3%
    
    // Generate volume
    const baseVolume = symbol.includes('BTC') || symbol.includes('ETH') ? 50000 : 1000000;
    const volume = Math.floor(baseVolume * (0.5 + Math.random()));

    // Generate technical indicators
    const technicalIndicators = this.generateTechnicalIndicators(currentPrice);

    return {
      symbol,
      currentPrice,
      priceChange,
      volume,
      technicalIndicators,
      timestamp: new Date(),
      marketCap: this.calculateMarketCap(symbol, currentPrice),
      dayHigh: currentPrice * (1 + Math.random() * 0.03),
      dayLow: currentPrice * (1 - Math.random() * 0.03)
    };
  }

  // Generate technical indicators
  generateTechnicalIndicators(currentPrice) {
    // RSI (0-100)
    const rsi = 30 + Math.random() * 40; // Mostly between 30-70

    // MACD
    const macd = (Math.random() - 0.5) * 2; // -1 to 1

    // Moving Averages
    const sma20 = currentPrice * (0.98 + Math.random() * 0.04); // ±2%
    const sma50 = currentPrice * (0.95 + Math.random() * 0.1); // ±5%
    const ema12 = currentPrice * (0.99 + Math.random() * 0.02); // ±1%
    const ema26 = currentPrice * (0.97 + Math.random() * 0.06); // ±3%

    // Bollinger Bands
    const bbUpper = currentPrice * (1.02 + Math.random() * 0.03);
    const bbLower = currentPrice * (0.95 + Math.random() * 0.03);
    const bbMiddle = (bbUpper + bbLower) / 2;

    // Stochastic
    const stochK = Math.random() * 100;
    const stochD = stochK * (0.9 + Math.random() * 0.2);

    // Volume indicators
    const volumeMA = Math.random() * 2000000;
    const volumeRatio = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

    return {
      rsi,
      macd,
      macdSignal: macd * 0.8,
      macdHistogram: macd * 0.2,
      sma20,
      sma50,
      ema12,
      ema26,
      bbUpper,
      bbLower,
      bbMiddle,
      stochK,
      stochD,
      volumeMA,
      volumeRatio,
      atr: currentPrice * 0.02, // Average True Range
      adx: 20 + Math.random() * 60, // Directional Movement Index
      cci: (Math.random() - 0.5) * 400, // Commodity Channel Index
      williamsR: -Math.random() * 100 // Williams %R
    };
  }

  // Calculate market cap (simplified)
  calculateMarketCap(symbol, price) {
    const sharesCounts = {
      'AAPL': 15.7e9,
      'GOOGL': 12.3e9,
      'MSFT': 7.4e9,
      'TSLA': 3.2e9,
      'NVDA': 2.5e9,
      'AMZN': 10.6e9,
      'META': 2.7e9,
      'NFLX': 0.44e9
    };

    const shares = sharesCounts[symbol] || 1e9;
    return price * shares;
  }

  // Get multiple symbols data
  async getMultipleSymbolsData(symbols) {
    const promises = symbols.map(symbol => this.getMarketData(symbol));
    const results = await Promise.all(promises);
    
    const data = {};
    symbols.forEach((symbol, index) => {
      if (results[index]) {
        data[symbol] = results[index];
      }
    });

    return data;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.lastUpdate.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      cachedSymbols: Array.from(this.cache.keys()),
      cacheSize: this.cache.size,
      lastUpdates: Object.fromEntries(this.lastUpdate)
    };
  }
}

export default TradingDataManager;