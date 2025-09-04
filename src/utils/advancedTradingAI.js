// Advanced Trading AI with Learning Capabilities
// Learns from past trades and improves recommendations over time

export class AdvancedTradingAI {
  constructor() {
    this.tradeHistory = this.loadTradeHistory();
    this.learningData = this.loadLearningData();
    this.performanceMetrics = {
      totalTrades: 0,
      successfulTrades: 0,
      accuracy: 0,
      totalProfit: 0,
      avgHoldTime: 0,
      bestStrategies: []
    };
    this.marketPatterns = new Map();
    this.riskThreshold = 0.02; // 2% max risk per trade
    this.confidenceThreshold = 0.75; // Minimum 75% confidence for trades
  }

  // Generate intelligent trade recommendation
  generateTradeRecommendation(symbol, marketData, pocketOptionData) {
    try {
      // Analyze current market conditions
      const marketAnalysis = this.analyzeMarketConditions(marketData, pocketOptionData);
      
      // Check historical patterns
      const historicalPattern = this.findSimilarPatterns(symbol, marketAnalysis);
      
      // Calculate trade signals
      const signals = this.calculateAdvancedSignals(marketData, pocketOptionData);
      
      // Apply machine learning insights
      const mlInsights = this.applyMachineLearning(symbol, signals, historicalPattern);
      
      // Generate final recommendation
      const recommendation = this.generateFinalRecommendation(
        symbol, 
        marketAnalysis, 
        signals, 
        mlInsights,
        marketData.currentPrice
      );
      
      // Store for learning
      this.storeForLearning(symbol, recommendation, marketAnalysis);
      
      return recommendation;
    } catch (error) {
      console.error('Error generating trade recommendation:', error);
      return this.createSafeRecommendation(symbol);
    }
  }

  // Analyze comprehensive market conditions
  analyzeMarketConditions(marketData, pocketOptionData) {
    const market = marketData.technicalIndicators;
    const pocket = pocketOptionData.indicators;
    
    // Price action analysis
    const priceAction = this.analyzePriceAction(marketData.currentPrice, market);
    
    // Volume analysis
    const volumeAnalysis = this.analyzeVolume(marketData.volume, market.volumeMA);
    
    // Volatility analysis
    const volatility = this.calculateVolatility(market);
    
    // Trend strength
    const trendStrength = this.calculateTrendStrength(market);
    
    // Source agreement
    const sourceAgreement = this.calculateSourceAgreement(market, pocket);
    
    // Market sentiment
    const sentiment = this.calculateMarketSentiment(market, priceAction);
    
    return {
      priceAction,
      volumeAnalysis,
      volatility,
      trendStrength,
      sourceAgreement,
      sentiment,
      timestamp: Date.now()
    };
  }

  // Calculate advanced trading signals
  calculateAdvancedSignals(marketData, pocketOptionData) {
    const signals = {
      rsi: this.analyzeRSI(marketData.technicalIndicators.rsi, pocketOptionData.indicators.rsi),
      macd: this.analyzeMacd(marketData.technicalIndicators, pocketOptionData.indicators),
      movingAverages: this.analyzeMovingAverages(marketData.technicalIndicators, marketData.currentPrice),
      bollingerBands: this.analyzeBollingerBands(marketData.technicalIndicators, marketData.currentPrice),
      stochastic: this.analyzeStochastic(marketData.technicalIndicators),
      pricePattern: this.analyzePricePattern(marketData.currentPrice),
      volumeProfile: this.analyzeVolumeProfile(marketData.volume, marketData.technicalIndicators.volumeMA)
    };

    // Calculate composite signal strength
    signals.composite = this.calculateCompositeSignal(signals);
    
    return signals;
  }

  // Apply machine learning insights
  applyMachineLearning(symbol, signals, historicalPattern) {
    const insights = {
      patternMatch: 0,
      successProbability: 0.5,
      riskLevel: 'medium',
      recommendedHoldTime: '2-4 hours',
      confidence: 0.5
    };

    // Learn from historical patterns
    if (historicalPattern) {
      insights.patternMatch = historicalPattern.similarity;
      insights.successProbability = historicalPattern.successRate;
      insights.recommendedHoldTime = historicalPattern.avgHoldTime;
    }

    // Adjust based on recent performance
    const recentPerformance = this.getRecentPerformance(symbol);
    if (recentPerformance.accuracy > 0.7) {
      insights.confidence *= 1.2; // Boost confidence for good performers
    } else if (recentPerformance.accuracy < 0.4) {
      insights.confidence *= 0.8; // Reduce confidence for poor performers
    }

    // Risk assessment based on learning
    insights.riskLevel = this.assessRiskLevel(signals, historicalPattern);
    
    return insights;
  }

  // Generate final trade recommendation
  generateFinalRecommendation(symbol, marketAnalysis, signals, mlInsights, currentPrice) {
    const composite = signals.composite;
    const confidence = Math.min(mlInsights.confidence * marketAnalysis.sourceAgreement, 0.95);
    
    // Determine action
    let action = 'HOLD';
    if (composite.strength > 0.6 && confidence > this.confidenceThreshold) {
      action = composite.direction > 0 ? 'BUY' : 'SELL';
    }

    // Calculate optimal entry timing
    const entryTiming = this.calculateOptimalEntry(signals, marketAnalysis);
    
    // Calculate position size based on risk
    const positionSize = this.calculatePositionSize(confidence, mlInsights.riskLevel);
    
    // Calculate stop loss and take profit
    const riskManagement = this.calculateRiskManagement(currentPrice, action, marketAnalysis.volatility);
    
    // Estimate hold time based on ML insights
    const holdTime = this.estimateHoldTime(signals, mlInsights, marketAnalysis.trendStrength);

    return {
      symbol,
      action,
      confidence: Math.round(confidence * 100),
      
      // Entry details
      entryPrice: currentPrice,
      bestEntryTime: entryTiming.bestTime,
      entryWindow: entryTiming.window,
      
      // Position sizing
      positionSize: positionSize.percentage,
      positionAmount: positionSize.amount,
      
      // Risk management
      stopLoss: riskManagement.stopLoss,
      takeProfit: riskManagement.takeProfit,
      riskRewardRatio: riskManagement.ratio,
      
      // Timing
      estimatedHoldTime: holdTime.duration,
      exitStrategy: holdTime.strategy,
      
      // Analysis
      signalStrength: Math.round(composite.strength * 100),
      riskLevel: mlInsights.riskLevel,
      patternMatch: Math.round(mlInsights.patternMatch * 100),
      
      // Learning insights
      reasoning: this.generateReasoning(signals, mlInsights, marketAnalysis),
      successProbability: Math.round(mlInsights.successProbability * 100),
      
      timestamp: Date.now()
    };
  }

  // Calculate optimal entry timing
  calculateOptimalEntry(signals, marketAnalysis) {
    const urgency = signals.composite.strength > 0.8 ? 'immediate' : 
                   signals.composite.strength > 0.6 ? 'within-hour' : 'wait';
    
    const timing = {
      immediate: { bestTime: 'Now', window: '0-5 minutes' },
      'within-hour': { bestTime: 'Next 30 minutes', window: '15-60 minutes' },
      'wait': { bestTime: 'Wait for confirmation', window: '1-4 hours' }
    };

    return timing[urgency];
  }

  // Calculate position size based on confidence and risk
  calculatePositionSize(confidence, riskLevel) {
    const baseSize = 0.1; // 10% base position
    const riskMultipliers = { low: 1.5, medium: 1.0, high: 0.5 };
    
    const adjustedSize = baseSize * confidence * riskMultipliers[riskLevel];
    const percentage = Math.min(Math.max(adjustedSize, 0.02), 0.25); // 2-25%
    
    return {
      percentage: Math.round(percentage * 100),
      amount: Math.round(percentage * 10000) // Assuming $10k portfolio
    };
  }

  // Calculate risk management levels
  calculateRiskManagement(entryPrice, action, volatility) {
    const volatilityMultiplier = Math.max(volatility * 2, 0.02); // Min 2% stop
    
    let stopLoss, takeProfit;
    
    if (action === 'BUY') {
      stopLoss = entryPrice * (1 - volatilityMultiplier);
      takeProfit = entryPrice * (1 + volatilityMultiplier * 2); // 2:1 reward
    } else if (action === 'SELL') {
      stopLoss = entryPrice * (1 + volatilityMultiplier);
      takeProfit = entryPrice * (1 - volatilityMultiplier * 2);
    } else {
      return { stopLoss: 0, takeProfit: 0, ratio: 0 };
    }
    
    const ratio = Math.abs(takeProfit - entryPrice) / Math.abs(entryPrice - stopLoss);
    
    return {
      stopLoss: Math.round(stopLoss * 100) / 100,
      takeProfit: Math.round(takeProfit * 100) / 100,
      ratio: Math.round(ratio * 10) / 10
    };
  }

  // Estimate hold time based on analysis
  estimateHoldTime(signals, mlInsights, trendStrength) {
    let baseDuration = 4; // 4 hours base
    
    // Adjust based on trend strength
    if (trendStrength > 0.8) baseDuration *= 2; // Strong trends last longer
    if (trendStrength < 0.3) baseDuration *= 0.5; // Weak trends are shorter
    
    // Adjust based on signal strength
    if (signals.composite.strength > 0.8) baseDuration *= 1.5;
    
    const duration = Math.round(baseDuration);
    const strategy = duration > 8 ? 'swing' : duration > 2 ? 'day' : 'scalp';
    
    return {
      duration: `${duration} hours`,
      strategy: `${strategy} trading`,
      exitConditions: this.generateExitConditions(signals, duration)
    };
  }

  // Generate exit conditions
  generateExitConditions(signals, duration) {
    const conditions = [];
    
    if (signals.rsi.signal !== 0) {
      conditions.push(`RSI ${signals.rsi.signal > 0 ? 'overbought' : 'oversold'} reversal`);
    }
    
    if (signals.macd.signal !== 0) {
      conditions.push('MACD signal line cross');
    }
    
    conditions.push(`Time-based exit after ${duration} hours`);
    conditions.push('Stop loss or take profit hit');
    
    return conditions;
  }

  // Learn from trade outcomes
  learnFromTrade(tradeId, outcome) {
    const trade = this.tradeHistory.find(t => t.id === tradeId);
    if (!trade) return;

    // Update trade with outcome
    trade.outcome = outcome;
    trade.actualProfit = outcome.profit;
    trade.actualHoldTime = outcome.holdTime;
    trade.success = outcome.profit > 0;

    // Update performance metrics
    this.updatePerformanceMetrics(trade);

    // Learn patterns
    this.learnPatterns(trade);

    // Save learning data
    this.saveLearningData();
  }

  // Update performance metrics
  updatePerformanceMetrics(trade) {
    this.performanceMetrics.totalTrades++;
    if (trade.success) {
      this.performanceMetrics.successfulTrades++;
    }
    
    this.performanceMetrics.accuracy = 
      this.performanceMetrics.successfulTrades / this.performanceMetrics.totalTrades;
    
    this.performanceMetrics.totalProfit += trade.actualProfit || 0;
  }

  // Generate comprehensive reasoning
  generateReasoning(signals, mlInsights, marketAnalysis) {
    const reasons = [];
    
    // Technical analysis reasons
    if (signals.rsi.signal > 0) reasons.push('RSI indicates oversold conditions');
    if (signals.rsi.signal < 0) reasons.push('RSI indicates overbought conditions');
    
    if (signals.macd.signal > 0) reasons.push('MACD shows bullish momentum');
    if (signals.macd.signal < 0) reasons.push('MACD shows bearish momentum');
    
    // ML insights
    if (mlInsights.patternMatch > 0.7) {
      reasons.push(`Strong pattern match (${Math.round(mlInsights.patternMatch * 100)}%) with historical data`);
    }
    
    // Market conditions
    if (marketAnalysis.sourceAgreement > 0.8) {
      reasons.push('High agreement between market and Pocket Option data');
    }
    
    if (marketAnalysis.trendStrength > 0.7) {
      reasons.push('Strong trend momentum detected');
    }
    
    return reasons.join('. ') + '.';
  }

  // Helper methods for technical analysis
  analyzeRSI(marketRSI, pocketRSI) {
    const avgRSI = (marketRSI + pocketRSI) / 2;
    let signal = 0;
    
    if (avgRSI < 30) signal = 1; // Oversold - buy signal
    if (avgRSI > 70) signal = -1; // Overbought - sell signal
    
    return { signal, value: avgRSI, agreement: Math.abs(marketRSI - pocketRSI) < 10 };
  }

  analyzeMacd(marketIndicators, pocketIndicators) {
    const marketMACD = marketIndicators.macd;
    const pocketMACD = pocketIndicators.macd;
    const avgMACD = (marketMACD + pocketMACD) / 2;
    
    let signal = 0;
    if (avgMACD > 0) signal = 1;
    if (avgMACD < 0) signal = -1;
    
    return { signal, value: avgMACD, agreement: (marketMACD > 0) === (pocketMACD > 0) };
  }

  calculateCompositeSignal(signals) {
    let totalSignal = 0;
    let signalCount = 0;
    
    Object.keys(signals).forEach(key => {
      if (signals[key].signal !== undefined) {
        totalSignal += signals[key].signal;
        signalCount++;
      }
    });
    
    const strength = signalCount > 0 ? Math.abs(totalSignal / signalCount) : 0;
    const direction = totalSignal > 0 ? 1 : totalSignal < 0 ? -1 : 0;
    
    return { strength, direction };
  }

  // Data persistence methods
  loadTradeHistory() {
    try {
      const saved = localStorage.getItem('tradingAI_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  loadLearningData() {
    try {
      const saved = localStorage.getItem('tradingAI_learning');
      return saved ? JSON.parse(saved) : { patterns: {}, performance: {} };
    } catch {
      return { patterns: {}, performance: {} };
    }
  }

  saveLearningData() {
    try {
      localStorage.setItem('tradingAI_learning', JSON.stringify(this.learningData));
      localStorage.setItem('tradingAI_history', JSON.stringify(this.tradeHistory));
    } catch (error) {
      console.error('Failed to save learning data:', error);
    }
  }

  // Create safe recommendation when analysis fails
  createSafeRecommendation(symbol) {
    return {
      symbol,
      action: 'HOLD',
      confidence: 50,
      reasoning: 'Insufficient data for reliable analysis. Recommend waiting for clearer signals.',
      riskLevel: 'high',
      bestEntryTime: 'Wait',
      estimatedHoldTime: 'N/A'
    };
  }

  // Get recent performance for a symbol
  getRecentPerformance(symbol) {
    const recentTrades = this.tradeHistory
      .filter(t => t.symbol === symbol && t.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000)
      .slice(-10);
    
    if (recentTrades.length === 0) {
      return { accuracy: 0.5, totalTrades: 0 };
    }
    
    const successful = recentTrades.filter(t => t.success).length;
    return {
      accuracy: successful / recentTrades.length,
      totalTrades: recentTrades.length
    };
  }

  // Store recommendation for learning
  storeForLearning(symbol, recommendation, marketAnalysis) {
    const tradeRecord = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      recommendation,
      marketAnalysis,
      timestamp: Date.now()
    };
    
    this.tradeHistory.push(tradeRecord);
    
    // Keep only last 1000 trades
    if (this.tradeHistory.length > 1000) {
      this.tradeHistory = this.tradeHistory.slice(-1000);
    }
  }

  // Additional helper methods would go here...
  analyzePriceAction(price, indicators) { return { trend: 'neutral', strength: 0.5 }; }
  analyzeVolume(volume, volumeMA) { return { relative: volume / volumeMA, trend: 'normal' }; }
  calculateVolatility(indicators) { return 0.02; }
  calculateTrendStrength(indicators) { return 0.5; }
  calculateSourceAgreement(market, pocket) { return 0.8; }
  calculateMarketSentiment(indicators, priceAction) { return 'neutral'; }
  analyzeMovingAverages(indicators, price) { return { signal: 0 }; }
  analyzeBollingerBands(indicators, price) { return { signal: 0 }; }
  analyzeStochastic(indicators) { return { signal: 0 }; }
  analyzePricePattern(price) { return { signal: 0 }; }
  analyzeVolumeProfile(volume, volumeMA) { return { signal: 0 }; }
  findSimilarPatterns(symbol, analysis) { return null; }
  assessRiskLevel(signals, pattern) { return 'medium'; }
  learnPatterns(trade) { /* Pattern learning logic */ }
}

export default AdvancedTradingAI;