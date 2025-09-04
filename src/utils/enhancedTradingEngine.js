// Enhanced Trading Engine with Structured Signal Format
export class EnhancedTradingEngine {
  constructor() {
    this.signalHistory = [];
    this.confidenceFactors = {
      rsi: 0.25,
      macd: 0.30,
      movingAverage: 0.20,
      bollinger: 0.15,
      volume: 0.10
    };
  }

  // Generate structured trading signal
  generateStructuredSignal(symbol, marketData, timeframe = '15m') {
    const indicators = this.calculateTechnicalIndicators(marketData);
    const signal = this.analyzeSignal(indicators, marketData);
    const confidence = this.calculateDynamicConfidence(signal, indicators);
    const zones = this.calculateEntryExitZones(marketData, signal);
    
    return {
      signal: signal.type,
      asset: this.formatAssetSymbol(symbol),
      timeframe: timeframe,
      contractPeriod: this.getContractPeriod(timeframe, signal.strength),
      entryZone: zones.entry,
      target: zones.target,
      stopLoss: zones.stopLoss,
      confidence: Math.round(confidence * 100),
      reasoning: this.generateReasoning(signal, indicators),
      timestamp: new Date().toISOString()
    };
  }

  calculateTechnicalIndicators(data) {
    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      sma20: this.calculateSMA(prices, 20),
      sma50: this.calculateSMA(prices, 50),
      ema12: this.calculateEMA(prices, 12),
      ema26: this.calculateEMA(prices, 26),
      bollinger: this.calculateBollingerBands(prices),
      stochastic: this.calculateStochastic(data),
      volume: this.analyzeVolume(volumes),
      currentPrice: prices[prices.length - 1]
    };
  }

  analyzeSignal(indicators, marketData) {
    let signalStrength = 0;
    let signalCount = 0;
    const signals = [];

    // RSI Analysis
    if (indicators.rsi < 30) {
      signalStrength += 1;
      signalCount++;
      signals.push('RSI oversold');
    } else if (indicators.rsi > 70) {
      signalStrength -= 1;
      signalCount++;
      signals.push('RSI overbought');
    }

    // MACD Analysis
    if (indicators.macd.histogram > 0 && indicators.macd.macd > indicators.macd.signal) {
      signalStrength += 1;
      signalCount++;
      signals.push('MACD bullish crossover');
    } else if (indicators.macd.histogram < 0 && indicators.macd.macd < indicators.macd.signal) {
      signalStrength -= 1;
      signalCount++;
      signals.push('MACD bearish crossover');
    }

    // Moving Average Analysis
    if (indicators.currentPrice > indicators.sma20 && indicators.sma20 > indicators.sma50) {
      signalStrength += 0.5;
      signalCount++;
      signals.push('Price above moving averages');
    } else if (indicators.currentPrice < indicators.sma20 && indicators.sma20 < indicators.sma50) {
      signalStrength -= 0.5;
      signalCount++;
      signals.push('Price below moving averages');
    }

    // Bollinger Bands Analysis
    if (indicators.currentPrice < indicators.bollinger.lower) {
      signalStrength += 0.3;
      signalCount++;
      signals.push('Price near lower Bollinger band');
    } else if (indicators.currentPrice > indicators.bollinger.upper) {
      signalStrength -= 0.3;
      signalCount++;
      signals.push('Price near upper Bollinger band');
    }

    const avgSignal = signalCount > 0 ? signalStrength / signalCount : 0;
    
    let signalType;
    if (avgSignal > 0.3) {
      signalType = 'BUY';
    } else if (avgSignal < -0.3) {
      signalType = 'SELL';
    } else {
      signalType = 'HOLD';
    }

    return {
      type: signalType,
      strength: Math.abs(avgSignal),
      factors: signals,
      rawStrength: avgSignal
    };
  }

  calculateDynamicConfidence(signal, indicators) {
    let confidence = 0.5; // Base confidence

    // Adjust based on signal strength
    confidence += signal.strength * 0.3;

    // Adjust based on RSI extremes
    if (indicators.rsi < 20 || indicators.rsi > 80) {
      confidence += 0.15;
    }

    // Adjust based on MACD strength
    if (Math.abs(indicators.macd.histogram) > 0.5) {
      confidence += 0.1;
    }

    // Adjust based on volume
    if (indicators.volume.trend === 'increasing') {
      confidence += 0.1;
    }

    // Cap confidence between 0.1 and 0.95
    return Math.max(0.1, Math.min(0.95, confidence));
  }

  calculateEntryExitZones(marketData, signal) {
    const currentPrice = marketData[marketData.length - 1].close;
    const volatility = this.calculateVolatility(marketData);
    
    let entryRange, target, stopLoss;

    if (signal.type === 'BUY') {
      const entryLow = currentPrice * (1 - volatility * 0.5);
      const entryHigh = currentPrice * (1 + volatility * 0.2);
      entryRange = `${entryLow.toFixed(2)} – ${entryHigh.toFixed(2)}`;
      target = (currentPrice * (1 + volatility * 2)).toFixed(2);
      stopLoss = (currentPrice * (1 - volatility * 1.5)).toFixed(2);
    } else if (signal.type === 'SELL') {
      const entryLow = currentPrice * (1 - volatility * 0.2);
      const entryHigh = currentPrice * (1 + volatility * 0.5);
      entryRange = `${entryLow.toFixed(2)} – ${entryHigh.toFixed(2)}`;
      target = (currentPrice * (1 - volatility * 2)).toFixed(2);
      stopLoss = (currentPrice * (1 + volatility * 1.5)).toFixed(2);
    } else {
      entryRange = `${(currentPrice * 0.995).toFixed(2)} – ${(currentPrice * 1.005).toFixed(2)}`;
      target = currentPrice.toFixed(2);
      stopLoss = currentPrice.toFixed(2);
    }

    return { entry: entryRange, target, stopLoss };
  }

  getContractPeriod(timeframe, strength) {
    const periods = {
      '1m': strength > 0.7 ? '15 minutes' : '5 minutes',
      '5m': strength > 0.7 ? '1 hour' : '30 minutes',
      '15m': strength > 0.7 ? '4 hours' : '2 hours',
      '1h': strength > 0.7 ? '1 day' : '8 hours',
      '4h': strength > 0.7 ? '3 days' : '1 day',
      '1d': strength > 0.7 ? '1 week' : '3 days'
    };
    return periods[timeframe] || '2 hours';
  }

  formatAssetSymbol(symbol) {
    // Convert various symbol formats to standard format
    const forexPairs = {
      'EURUSD=X': 'EUR/USD',
      'GBPUSD=X': 'GBP/USD',
      'USDJPY=X': 'USD/JPY',
      'AUDUSD=X': 'AUD/USD',
      'USDCAD=X': 'USD/CAD'
    };
    
    const cryptoPairs = {
      'BTC-USD': 'BTC/USDT',
      'ETH-USD': 'ETH/USDT',
      'BNB-USD': 'BNB/USDT',
      'ADA-USD': 'ADA/USDT',
      'SOL-USD': 'SOL/USDT'
    };

    return forexPairs[symbol] || cryptoPairs[symbol] || symbol;
  }

  generateReasoning(signal, indicators) {
    const reasons = [];
    
    if (signal.type === 'BUY') {
      if (indicators.rsi < 35) reasons.push('RSI indicates oversold conditions');
      if (indicators.macd.histogram > 0) reasons.push('MACD showing bullish momentum');
      if (indicators.currentPrice > indicators.sma20) reasons.push('Price above key moving average');
      if (indicators.volume.trend === 'increasing') reasons.push('Strong volume confirmation');
    } else if (signal.type === 'SELL') {
      if (indicators.rsi > 65) reasons.push('RSI indicates overbought conditions');
      if (indicators.macd.histogram < 0) reasons.push('MACD showing bearish momentum');
      if (indicators.currentPrice < indicators.sma20) reasons.push('Price below key moving average');
      if (indicators.volume.trend === 'increasing') reasons.push('Strong volume confirmation');
    } else {
      reasons.push('Mixed signals suggest sideways movement');
      reasons.push('Wait for clearer market direction');
    }

    return reasons.join('; ') || 'Technical analysis inconclusive';
  }

  // Technical indicator calculations
  calculateRSI(prices, period = 14) {
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateMACD(prices) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    const signal = this.calculateEMA([macd], 9);
    
    return {
      macd: macd,
      signal: signal,
      histogram: macd - signal
    };
  }

  calculateSMA(prices, period) {
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  }

  calculateEMA(prices, period) {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    const sma = this.calculateSMA(prices, period);
    const slice = prices.slice(-period);
    const variance = slice.reduce((acc, price) => acc + Math.pow(price - sma, 2), 0) / period;
    const std = Math.sqrt(variance);
    
    return {
      upper: sma + (std * stdDev),
      middle: sma,
      lower: sma - (std * stdDev)
    };
  }

  calculateStochastic(data, period = 14) {
    const slice = data.slice(-period);
    const low = Math.min(...slice.map(d => d.low));
    const high = Math.max(...slice.map(d => d.high));
    const current = data[data.length - 1].close;
    
    return ((current - low) / (high - low)) * 100;
  }

  analyzeVolume(volumes) {
    const recent = volumes.slice(-5);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const current = volumes[volumes.length - 1];
    
    return {
      current: current,
      average: avg,
      trend: current > avg * 1.2 ? 'increasing' : current < avg * 0.8 ? 'decreasing' : 'stable'
    };
  }

  calculateVolatility(data, period = 20) {
    const returns = [];
    for (let i = 1; i < data.length && i <= period; i++) {
      const return_rate = (data[data.length - i].close - data[data.length - i - 1].close) / data[data.length - i - 1].close;
      returns.push(return_rate);
    }
    
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((acc, ret) => acc + Math.pow(ret - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }
}