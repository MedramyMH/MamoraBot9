// Trading Data Manager - Real data instead of fixed basePrices
export class TradingDataManager {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = new Map();
    this.updateInterval = 30000; // 30s
  }

  // Get market data for a symbol
  async getMarketData(symbol) {
    try {
      if (this.shouldUseCache(symbol)) {
        return this.cache.get(symbol);
      }

      let marketData;

      if (symbol.endsWith("-USD")) {
        // crypto (BTC-USD, ETH-USD) from Binance
        marketData = await this.fetchCryptoData(symbol);
      } else {
        // stocks/etf (AAPL, MSFT...) from Yahoo Finance
        marketData = await this.fetchStockData(symbol);
      }

      if (marketData) {
        this.cache.set(symbol, marketData);
        this.lastUpdate.set(symbol, Date.now());
      }

      return marketData;
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch crypto from Binance
  async fetchCryptoData(symbol) {
    const binanceSymbol = symbol.replace("-USD", "USDT"); // e.g. BTC-USD → BTCUSDT
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`);
    const data = await res.json();

    const currentPrice = parseFloat(data.lastPrice);
    return {
      symbol,
      currentPrice,
      priceChange: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
      technicalIndicators: this.generateTechnicalIndicators(currentPrice),
      timestamp: new Date()
    };
  }

  // Fetch stocks from Yahoo Finance
  async fetchStockData(symbol) {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    const json = await res.json();

    const result = json.chart.result[0];
    const currentPrice = result.meta.regularMarketPrice;

    return {
      symbol,
      currentPrice,
      priceChange: result.meta.regularMarketChangePercent,
      volume: result.meta.regularMarketVolume,
      technicalIndicators: this.generateTechnicalIndicators(currentPrice),
      timestamp: new Date()
    };
  }

  shouldUseCache(symbol) {
    if (!this.cache.has(symbol) || !this.lastUpdate.has(symbol)) return false;
    const lastUpdate = this.lastUpdate.get(symbol);
    return (Date.now() - lastUpdate) < this.updateInterval;
  }

  // Keep your old indicator generator
  generateTechnicalIndicators(currentPrice) {
    const rsi = 30 + Math.random() * 40;
    const macd = (Math.random() - 0.5) * 2;
    return { rsi, macd };
  }
}

export default TradingDataManager;
