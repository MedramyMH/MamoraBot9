// Advanced Market Analysis Engine
// Continuously processes live trading data with automatic refresh cycles
// Detects patterns, volatility shifts, and emerging opportunities

class MarketAnalysisEngine {
  constructor() {
    this.analysisHistory = [];
    this.patterns = new Map();
    this.volatilityThresholds = {
      low: 0.02,
      medium: 0.05,
      high: 0.1
    };
    this.refreshInterval = 1000; // 1 second
    this.isRunning = false;
  }

  // Start continuous market analysis
  startAnalysis(onUpdate) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.analysisInterval = setInterval(() => {
      this.performAnalysis(onUpdate);
    }, this.refreshInterval);
  }

  // Stop continuous analysis
  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.isRunning = false;
    }
  }

  // Main analysis function
  async performAnalysis(onUpdate) {
    try {
      const marketData = await this.getCurrentMarketData();
      const analysis = {
        timestamp: Date.now(),
        patterns: this.detectPatterns(marketData),
        volatility: this.analyzeVolatility(marketData),
        opportunities: this.identifyOpportunities(marketData),
        marketSentiment: this.calculateMarketSentiment(marketData),
        trendStrength: this.analyzeTrendStrength(marketData)
      };

      this.analysisHistory.push(analysis);
      
      // Keep only last 100 analyses for performance
      if (this.analysisHistory.length > 100) {
        this.analysisHistory.shift();
      }

      if (onUpdate) {
        onUpdate(analysis);
      }

      return analysis;
    } catch (error) {
      console.error('Market analysis error:', error);
      return null;
    }
  }

  // Get current market data from multiple sources
  async getCurrentMarketData() {
    // Simulate real-time market data
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];
    const marketData = {};

    for (const symbol of symbols) {
      marketData[symbol] = {
        price: this.generateRealisticPrice(symbol),
        volume: Math.random() * 1000000,
        change24h: (Math.random() - 0.5) * 0.2, // -10% to +10%
        high24h: 0,
        low24h: 0,
        trades: Math.floor(Math.random() * 10000),
        timestamp: Date.now()
      };
    }

    return marketData;
  }

  // Generate realistic price movements
  generateRealisticPrice(symbol) {
    const basePrices = {
      'BTCUSDT': 45000,
      'ETHUSDT': 3000,
      'BNBUSDT': 300,
      'ADAUSDT': 0.5,
      'SOLUSDT': 100
    };

    const basePrice = basePrices[symbol] || 100;
    const volatility = 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility;
    
    return basePrice * (1 + change);
  }

  // Detect market patterns
  detectPatterns(marketData) {
    const patterns = [];

    Object.entries(marketData).forEach(([symbol, data]) => {
      // Bullish pattern detection
      if (data.change24h > 0.05) {
        patterns.push({
          symbol,
          type: 'bullish_breakout',
          strength: Math.min(data.change24h * 10, 1),
          confidence: 0.8
        });
      }

      // Bearish pattern detection
      if (data.change24h < -0.05) {
        patterns.push({
          symbol,
          type: 'bearish_breakdown',
          strength: Math.min(Math.abs(data.change24h) * 10, 1),
          confidence: 0.75
        });
      }

      // Volume spike pattern
      if (data.volume > 500000) {
        patterns.push({
          symbol,
          type: 'volume_spike',
          strength: Math.min(data.volume / 1000000, 1),
          confidence: 0.7
        });
      }
    });

    return patterns;
  }

  // Analyze market volatility
  analyzeVolatility(marketData) {
    const volatilityData = {};

    Object.entries(marketData).forEach(([symbol, data]) => {
      const volatility = Math.abs(data.change24h);
      let level = 'low';
      
      if (volatility > this.volatilityThresholds.high) {
        level = 'high';
      } else if (volatility > this.volatilityThresholds.medium) {
        level = 'medium';
      }

      volatilityData[symbol] = {
        level,
        value: volatility,
        trend: this.getVolatilityTrend(symbol, volatility)
      };
    });

    return volatilityData;
  }

  // Get volatility trend
  getVolatilityTrend(symbol, currentVolatility) {
    const history = this.analysisHistory.slice(-5);
    if (history.length < 2) return 'stable';

    const previousVolatility = history[history.length - 1]?.volatility?.[symbol]?.value || currentVolatility;
    
    if (currentVolatility > previousVolatility * 1.2) return 'increasing';
    if (currentVolatility < previousVolatility * 0.8) return 'decreasing';
    return 'stable';
  }

  // Identify trading opportunities
  identifyOpportunities(marketData) {
    const opportunities = [];

    Object.entries(marketData).forEach(([symbol, data]) => {
      // Oversold opportunity
      if (data.change24h < -0.08) {
        opportunities.push({
          symbol,
          type: 'oversold_bounce',
          potential: Math.abs(data.change24h) * 5,
          risk: 'medium',
          timeframe: 'short',
          confidence: 0.65
        });
      }

      // Momentum opportunity
      if (data.change24h > 0.03 && data.volume > 300000) {
        opportunities.push({
          symbol,
          type: 'momentum_continuation',
          potential: data.change24h * 3,
          risk: 'high',
          timeframe: 'short',
          confidence: 0.7
        });
      }

      // Breakout opportunity
      if (Math.abs(data.change24h) > 0.06 && data.volume > 400000) {
        opportunities.push({
          symbol,
          type: 'breakout_trade',
          potential: Math.abs(data.change24h) * 4,
          risk: 'medium',
          timeframe: 'medium',
          confidence: 0.75
        });
      }
    });

    return opportunities.sort((a, b) => b.confidence - a.confidence);
  }

  // Calculate overall market sentiment
  calculateMarketSentiment(marketData) {
    const symbols = Object.keys(marketData);
    const totalChange = symbols.reduce((sum, symbol) => {
      return sum + marketData[symbol].change24h;
    }, 0);

    const avgChange = totalChange / symbols.length;
    
    let sentiment = 'neutral';
    let score = 0.5;

    if (avgChange > 0.02) {
      sentiment = 'bullish';
      score = Math.min(0.5 + avgChange * 5, 1);
    } else if (avgChange < -0.02) {
      sentiment = 'bearish';
      score = Math.max(0.5 + avgChange * 5, 0);
    }

    return {
      sentiment,
      score,
      strength: Math.abs(avgChange) > 0.05 ? 'strong' : 'weak'
    };
  }

  // Analyze trend strength
  analyzeTrendStrength(marketData) {
    const trendData = {};

    Object.entries(marketData).forEach(([symbol, data]) => {
      const change = data.change24h;
      let strength = 'weak';
      let direction = 'sideways';

      if (Math.abs(change) > 0.05) {
        strength = 'strong';
      } else if (Math.abs(change) > 0.02) {
        strength = 'medium';
      }

      if (change > 0.01) {
        direction = 'up';
      } else if (change < -0.01) {
        direction = 'down';
      }

      trendData[symbol] = {
        direction,
        strength,
        momentum: this.calculateMomentum(symbol, change)
      };
    });

    return trendData;
  }

  // Calculate momentum indicator
  calculateMomentum(symbol, currentChange) {
    const history = this.analysisHistory.slice(-3);
    if (history.length < 2) return 0;

    const changes = history.map(h => {
      const symbolData = Object.values(h)[0]; // Simplified for demo
      return symbolData?.change24h || 0;
    });

    changes.push(currentChange);
    
    // Calculate momentum as rate of change acceleration
    const momentum = changes.reduce((acc, change, index) => {
      if (index === 0) return acc;
      return acc + (change - changes[index - 1]);
    }, 0) / (changes.length - 1);

    return momentum;
  }

  // Get latest analysis
  getLatestAnalysis() {
    return this.analysisHistory[this.analysisHistory.length - 1] || null;
  }

  // Get analysis history
  getAnalysisHistory(limit = 10) {
    return this.analysisHistory.slice(-limit);
  }
}

export default MarketAnalysisEngine;