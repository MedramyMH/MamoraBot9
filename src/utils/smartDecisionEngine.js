// Enhanced Smart Decision Engine for Dual Source Analysis
// Provides intelligent trading signals considering both market and Pocket Option data

export class SmartDecisionEngine {
  constructor() {
    this.signalHistory = [];
    this.performanceMetrics = {
      totalSignals: 0,
      accuracy: 0,
      avgConfidence: 0
    };
  }

  // Generate intelligent trading signal with dual source analysis
  generateIntelligentSignal(symbol, marketData, pocketOptionData) {
    if (!marketData || !pocketOptionData) {
      return this.createNeutralSignal(symbol, 'Insufficient data');
    }

    const marketPrice = marketData.currentPrice;
    const pocketPrice = pocketOptionData.price;
    const marketIndicators = marketData.technicalIndicators;
    const pocketIndicators = pocketOptionData.indicators;

    // Calculate price discrepancy
    const priceDiscrepancy = Math.abs(marketPrice - pocketPrice) / marketPrice;
    
    // Base confidence starts high and decreases with price discrepancy
    let baseConfidence = Math.max(0.3, 1.0 - (priceDiscrepancy * 5));

    // Analyze technical signals from both sources
    const signals = this.analyzeTechnicalSignals(marketIndicators, pocketIndicators);
    
    // Calculate signal strength
    const signalStrength = this.calculateSignalStrength(signals);
    
    // Determine action based on signal strength and agreement between sources
    const action = this.determineAction(signalStrength, signals.agreement);
    
    // Calculate final confidence
    const confidence = this.calculateFinalConfidence(
      baseConfidence, 
      signalStrength, 
      signals.agreement,
      priceDiscrepancy
    );

    // Generate reasoning
    const reasoning = this.generateReasoning(signals, priceDiscrepancy, action);

    const signal = {
      symbol,
      action,
      confidence,
      reasoning,
      marketPrice,
      pocketOptionPrice: pocketPrice,
      priceDiscrepancy: priceDiscrepancy * 100,
      signalStrength: Math.abs(signalStrength),
      agreement: signals.agreement,
      factorsConsidered: signals.factors.length,
      timestamp: new Date(),
      technicalFactors: signals.factors
    };

    // Store in history
    this.signalHistory.push(signal);
    this.updatePerformanceMetrics();

    return signal;
  }

  // Analyze technical signals from both data sources
  analyzeTechnicalSignals(marketIndicators, pocketIndicators) {
    const signals = [];
    const factors = [];
    let bullishCount = 0;
    let bearishCount = 0;
    let agreementCount = 0;
    let totalSignals = 0;

    // RSI Analysis
    if (marketIndicators.rsi && pocketIndicators.rsi) {
      const marketRSI = marketIndicators.rsi;
      const pocketRSI = pocketIndicators.rsi;
      
      let rsiSignal = 0;
      if (marketRSI < 30 && pocketRSI < 35) {
        rsiSignal = 1; // Oversold - BUY
        bullishCount++;
        factors.push('RSI oversold in both sources');
      } else if (marketRSI > 70 && pocketRSI > 65) {
        rsiSignal = -1; // Overbought - SELL
        bearishCount++;
        factors.push('RSI overbought in both sources');
      } else if ((marketRSI < 30 && pocketRSI > 35) || (marketRSI > 70 && pocketRSI < 65)) {
        factors.push('RSI signals diverge between sources');
      }
      
      signals.push({ type: 'RSI', value: rsiSignal, agreement: Math.abs(marketRSI - pocketRSI) < 10 });
      if (Math.abs(marketRSI - pocketRSI) < 10) agreementCount++;
      totalSignals++;
    }

    // MACD Analysis
    if (marketIndicators.macd && pocketIndicators.macd) {
      const marketMACD = marketIndicators.macd;
      const pocketMACD = pocketIndicators.macd;
      
      let macdSignal = 0;
      if (marketMACD > 0 && pocketMACD > 0) {
        macdSignal = 1; // Bullish
        bullishCount++;
        factors.push('MACD bullish in both sources');
      } else if (marketMACD < 0 && pocketMACD < 0) {
        macdSignal = -1; // Bearish
        bearishCount++;
        factors.push('MACD bearish in both sources');
      } else {
        factors.push('MACD signals diverge between sources');
      }
      
      signals.push({ type: 'MACD', value: macdSignal, agreement: (marketMACD > 0) === (pocketMACD > 0) });
      if ((marketMACD > 0) === (pocketMACD > 0)) agreementCount++;
      totalSignals++;
    }

    // Moving Average Analysis
    if (marketIndicators.sma20 && pocketIndicators.sma20) {
      const marketPrice = marketIndicators.currentPrice || 0;
      const pocketPrice = pocketIndicators.currentPrice || 0;
      
      let maSignal = 0;
      const marketAboveSMA = marketPrice > marketIndicators.sma20;
      const pocketAboveSMA = pocketPrice > pocketIndicators.sma20;
      
      if (marketAboveSMA && pocketAboveSMA) {
        maSignal = 0.5; // Mild bullish
        bullishCount += 0.5;
        factors.push('Price above SMA(20) in both sources');
      } else if (!marketAboveSMA && !pocketAboveSMA) {
        maSignal = -0.5; // Mild bearish
        bearishCount += 0.5;
        factors.push('Price below SMA(20) in both sources');
      } else {
        factors.push('SMA signals diverge between sources');
      }
      
      signals.push({ type: 'SMA', value: maSignal, agreement: marketAboveSMA === pocketAboveSMA });
      if (marketAboveSMA === pocketAboveSMA) agreementCount++;
      totalSignals++;
    }

    // Calculate overall agreement
    const agreement = totalSignals > 0 ? agreementCount / totalSignals : 0;

    return {
      signals,
      factors,
      bullishCount,
      bearishCount,
      agreement,
      totalSignals
    };
  }

  // Calculate signal strength
  calculateSignalStrength(signals) {
    const netBullish = signals.bullishCount - signals.bearishCount;
    const maxPossible = signals.totalSignals || 1;
    return netBullish / maxPossible;
  }

  // Determine trading action
  determineAction(signalStrength, agreement) {
    // Require higher agreement for stronger signals
    const agreementThreshold = 0.6;
    
    if (agreement < agreementThreshold) {
      return 'HOLD'; // Sources disagree too much
    }
    
    if (signalStrength > 0.3) {
      return 'BUY';
    } else if (signalStrength < -0.3) {
      return 'SELL';
    } else {
      return 'HOLD';
    }
  }

  // Calculate final confidence score
  calculateFinalConfidence(baseConfidence, signalStrength, agreement, priceDiscrepancy) {
    // Start with base confidence
    let confidence = baseConfidence;
    
    // Boost confidence with strong signals
    confidence *= (1 + Math.abs(signalStrength));
    
    // Boost confidence with high agreement
    confidence *= (0.5 + agreement);
    
    // Reduce confidence with high price discrepancy
    if (priceDiscrepancy > 0.02) { // 2%
      confidence *= (1 - priceDiscrepancy);
    }
    
    // Cap confidence between 0.1 and 0.95
    return Math.max(0.1, Math.min(0.95, confidence));
  }

  // Generate human-readable reasoning
  generateReasoning(signals, priceDiscrepancy, action) {
    const reasons = [];
    
    // Price discrepancy reasoning
    if (priceDiscrepancy > 0.02) {
      reasons.push(`High price discrepancy (${(priceDiscrepancy * 100).toFixed(1)}%) between sources reduces confidence`);
    } else if (priceDiscrepancy < 0.01) {
      reasons.push('Low price discrepancy indicates good source alignment');
    }
    
    // Agreement reasoning
    if (signals.agreement > 0.8) {
      reasons.push('Strong agreement between market and Pocket Option indicators');
    } else if (signals.agreement < 0.5) {
      reasons.push('Significant divergence between data sources suggests caution');
    }
    
    // Signal-specific reasoning
    signals.factors.forEach(factor => {
      reasons.push(factor);
    });
    
    // Action reasoning
    switch (action) {
      case 'BUY':
        reasons.push('Technical indicators suggest potential upward movement');
        break;
      case 'SELL':
        reasons.push('Technical indicators suggest potential downward movement');
        break;
      case 'HOLD':
        reasons.push('Mixed or weak signals recommend waiting for clearer direction');
        break;
    }
    
    return reasons.join('. ') + '.';
  }

  // Create neutral signal for error cases
  createNeutralSignal(symbol, reason) {
    return {
      symbol,
      action: 'HOLD',
      confidence: 0.5,
      reasoning: reason,
      marketPrice: 0,
      pocketOptionPrice: 0,
      priceDiscrepancy: 0,
      signalStrength: 0,
      agreement: 0,
      factorsConsidered: 0,
      timestamp: new Date(),
      technicalFactors: []
    };
  }

  // Update performance metrics
  updatePerformanceMetrics() {
    this.performanceMetrics.totalSignals = this.signalHistory.length;
    
    if (this.signalHistory.length > 0) {
      const totalConfidence = this.signalHistory.reduce((sum, signal) => sum + signal.confidence, 0);
      this.performanceMetrics.avgConfidence = totalConfidence / this.signalHistory.length;
    }
  }

  // Get recent signal history
  getSignalHistory(limit = 10) {
    return this.signalHistory.slice(-limit);
  }

  // Get performance metrics
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      avgConfidence: Math.round(this.performanceMetrics.avgConfidence * 100) / 100
    };
  }
}

export default SmartDecisionEngine;