/**
 * Technical indicators calculations for crypto dashboard
 * Implementing exact formulas as used in TradingView and Binance
 */

// Store actual decimals from Binance API response
let symbolDecimalsCache = {};

// Set decimals for a symbol based on actual price precision from Binance
export const setSymbolDecimals = (symbol, price) => {
  if (!symbol || !price) return;
  
  const priceStr = price.toString();
  const decimalIndex = priceStr.indexOf('.');
  
  if (decimalIndex === -1) {
    symbolDecimalsCache[symbol] = 0;
    return;
  }
  
  // Count significant decimal places (ignore trailing zeros)
  const decimalPart = priceStr.substring(decimalIndex + 1);
  const significantDecimals = decimalPart.replace(/0+$/, '').length;
  
  // Ensure minimum of 2 decimals for better readability, max 8
  const finalDecimals = Math.max(2, Math.min(8, significantDecimals));
  symbolDecimalsCache[symbol] = finalDecimals;
};

// Get token decimals based on cached Binance precision or fallback
export const getTokenDecimals = (symbol) => {
  if (!symbol) return 2;
  
  // Return cached decimals from actual Binance data
  if (symbolDecimalsCache[symbol] !== undefined) {
    return symbolDecimalsCache[symbol];
  }
  
  // Fallback: Extract the base token for common patterns
  const baseToken = symbol.replace(/USDT$|USDC$|BUSD$|FDUSD$/, '');
  
  // Common tokens with typical decimal places (fallback only)
  const decimalsMap = {
    'BTC': 2,
    'ETH': 2,
    'BNB': 2,
    'SOL': 2,
    'ADA': 4,
    'XRP': 4,
    'DOT': 3,
    'DOGE': 6,
    'SHIB': 8,
    'PEPE': 8,
  };
  
  return decimalsMap[baseToken] || 2; // Default to 2 if not in the map
};

// Calculate Simple Moving Average (SMA)
export const calculateSMA = (data, period) => {
  const sma = [];
  
  // Need at least 'period' data points to calculate SMA
  if (data.length < period) {
    return [];
  }
  
  // Calculate SMA for each window of size 'period'
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((total, candle) => total + candle.close, 0);
    sma.push({
      time: data[i].time,
      value: sum / period
    });
  }
  
  return sma;
};

// Calculate all required MAs (9, 21, 55, 100, 200)
export const calculateAllMAs = (data) => {
  const periods = [9, 21, 55, 100, 200];
  const result = {};
  
  for (const period of periods) {
    if (data.length >= period) {
      result[period] = calculateSMA(data, period);
    }
  }
  
  return result;
};

// Calculate Exponential Moving Average (EMA) - TradingView/Binance compatible
export const calculateEMA = (data, period) => {
  const ema = [];
  
  // Need at least 'period' data points
  if (data.length < period) {
    return [];
  }
  
  // TradingView/Binance EMA calculation
  const alpha = 2 / (period + 1);
  
  // First EMA value is the first price (not SMA as commonly thought)
  let previousEMA = data[0].close;
  
  // Start from the first data point
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      ema.push({
        time: data[i].time,
        value: previousEMA
      });
    } else {
      const currentEMA = alpha * data[i].close + (1 - alpha) * previousEMA;
      ema.push({
        time: data[i].time,
        value: currentEMA
      });
      previousEMA = currentEMA;
    }
  }
  
  return ema;
};

// Calculate RSI (Relative Strength Index) - TradingView/Binance compatible
export const calculateRSI = (data, period = 14) => {
  if (!data || data.length < period + 1) {
    console.log(`RSI: Need ${period + 1} data points, have ${data?.length || 0}`);
    return [];
  }

  const rsiData = [];
  let gains = [];
  let losses = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Calculate first average gain/loss (SMA)
  let avgGain = 0;
  let avgLoss = 0;
  
  for (let i = 0; i < period; i++) {
    avgGain += gains[i];
    avgLoss += losses[i];
  }
  
  avgGain /= period;
  avgLoss /= period;
  
  // Calculate first RSI
  const rs = avgGain / (avgLoss === 0 ? 0.0001 : avgLoss);
  const rsi = 100 - (100 / (1 + rs));
  
  rsiData.push({
    ...data[period],
    rsi: rsi
  });
  
  // Calculate subsequent RSI values using Wilder's smoothing (EMA with alpha = 1/period)
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    
    // Wilder's smoothing
    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;
    
    const newRs = avgGain / (avgLoss === 0 ? 0.0001 : avgLoss);
    const newRsi = 100 - (100 / (1 + newRs));
    
    rsiData.push({
      ...data[i],
      rsi: newRsi
    });
  }

  return rsiData;
};

// Calculate Stochastic RSI - TradingView/Binance compatible
export const calculateStochasticRSI = (data, rsiPeriod = 14, stochPeriod = 14, kSmooth = 3, dSmooth = 3) => {
  const minDataPoints = rsiPeriod + stochPeriod + Math.max(kSmooth, dSmooth);
  
  if (!data || data.length < minDataPoints) {
    console.log(`StochRSI: Need ${minDataPoints} data points, have ${data?.length || 0}`);
    return [];
  }

  // First calculate RSI
  const rsiData = calculateRSI(data, rsiPeriod);
  
  if (!rsiData || rsiData.length < stochPeriod) {
    console.log(`StochRSI: RSI data insufficient. Need ${stochPeriod} RSI points, have ${rsiData?.length || 0}`);
    return [];
  }
  
  const stochRSIResults = [];
  
  // Calculate raw Stochastic RSI
  for (let i = stochPeriod - 1; i < rsiData.length; i++) {
    const rsiSlice = rsiData.slice(i - stochPeriod + 1, i + 1);
    const rsiValues = rsiSlice.map(d => d.rsi);
    
    const minRSI = Math.min(...rsiValues);
    const maxRSI = Math.max(...rsiValues);
    const currentRSI = rsiData[i].rsi;

    // Calculate raw StochRSI
    const stochRSI = maxRSI - minRSI === 0 ? 0 : ((currentRSI - minRSI) / (maxRSI - minRSI)) * 100;
    
    stochRSIResults.push({
      ...rsiData[i],
      rawStochRSI: stochRSI
    });
  }
  
  // Apply K smoothing (SMA of raw StochRSI)
  const kValues = [];
  for (let i = kSmooth - 1; i < stochRSIResults.length; i++) {
    const slice = stochRSIResults.slice(i - kSmooth + 1, i + 1);
    const kValue = slice.reduce((sum, item) => sum + item.rawStochRSI, 0) / kSmooth;
    kValues.push({
      ...stochRSIResults[i],
      k: kValue
    });
  }
  
  // Apply D smoothing (SMA of K values)
  const finalResults = [];
  for (let i = dSmooth - 1; i < kValues.length; i++) {
    const slice = kValues.slice(i - dSmooth + 1, i + 1);
    const dValue = slice.reduce((sum, item) => sum + item.k, 0) / dSmooth;
    
    finalResults.push({
      ...kValues[i],
      stochRSI: kValues[i].k, // %K
      stochRSID: dValue       // %D
    });
  }
  
  console.log(`StochRSI: Generated ${finalResults.length} valid points from ${data.length} input points`);
  return finalResults;
};

// Calculate MACD - TradingView/Binance compatible
export const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  const minDataPoints = Math.max(fastPeriod, slowPeriod) + signalPeriod;
  
  if (!data || data.length < minDataPoints) {
    console.log(`MACD: Need ${minDataPoints} data points, have ${data?.length || 0}`);
    return [];
  }

  // Calculate EMAs using TradingView method
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  if (!fastEMA || !slowEMA || fastEMA.length === 0 || slowEMA.length === 0) {
    return [];
  }

  // Calculate MACD line (fast EMA - slow EMA)
  const macdLine = [];
  const minLength = Math.min(fastEMA.length, slowEMA.length);
  
  for (let i = 0; i < minLength; i++) {
    if (fastEMA[i] && slowEMA[i] && fastEMA[i].time === slowEMA[i].time) {
      macdLine.push({
        time: fastEMA[i].time,
        close: fastEMA[i].value - slowEMA[i].value // MACD value as "close" for EMA calculation
      });
    }
  }

  if (macdLine.length < signalPeriod) {
    return [];
  }

  // Calculate Signal line (EMA of MACD line)
  const signalEMA = calculateEMA(macdLine, signalPeriod);
  
  if (!signalEMA || signalEMA.length === 0) {
    return [];
  }

  // Combine MACD, Signal, and Histogram
  const result = [];
  
  for (let i = 0; i < signalEMA.length; i++) {
    if (i < macdLine.length) {
      const macdValue = macdLine[i].close;
      const signalValue = signalEMA[i].value;
      const histogram = macdValue - signalValue;
      
      result.push({
        time: macdLine[i].time,
        timestamp: macdLine[i].time,
        macd: macdValue,
        signal: signalValue,
        histogram: histogram
      });
    }
  }

  console.log(`MACD: Generated ${result.length} valid points from ${data.length} input points`);
  return result;
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  // Need at least 'period' data points
  if (data.length < period) {
    return [];
  }
  
  const bands = [];
  
  // Calculate SMA
  const smaValues = calculateSMA(data, period);
  
  // Calculate standard deviation and bands for each point where we have SMA
  for (let i = period - 1; i < data.length; i++) {
    // Get window for standard deviation calculation
    const slice = data.slice(i - period + 1, i + 1);
    
    // Calculate SMA for this window
    const sma = smaValues[i - (period - 1)].value;
    
    // Calculate standard deviation
    const squaredDifferences = slice.map(candle => Math.pow(candle.close - sma, 2));
    const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    // Calculate upper and lower bands
    bands.push({
      time: data[i].time,
      middle: sma,
      upper: sma + (standardDeviation * stdDev),
      lower: sma - (standardDeviation * stdDev)
    });
  }
  
  return bands;
};

// Calculate distance to technical levels
export const calculateDistanceToLevel = (currentPrice, level) => {
  if (!level || !currentPrice) return { percentage: 0, isAbove: true };
  
  const distance = level - currentPrice;
  const percentage = Math.abs((distance / currentPrice) * 100);
  const isAbove = distance > 0;
  
  return { percentage, isAbove };
};

// Find the closest technical level
export const findClosestLevel = (currentPrice, levels) => {
  if (!levels || Object.keys(levels).length === 0 || !currentPrice) {
    return { level: null, distance: null, name: null };
  }
  
  let closestName = '';
  let closestLevel = null;
  let closestDistance = Infinity;
  
  Object.entries(levels).forEach(([name, level]) => {
    if (level !== null) {
      const distance = Math.abs(currentPrice - level);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestLevel = level;
        closestName = name;
      }
    }
  });
  
  return {
    level: closestLevel,
    name: closestName,
    distance: calculateDistanceToLevel(currentPrice, closestLevel)
  };
};

// Find closest MA from all periods for each timeframe
export const findClosestMA = (currentPrice, maData) => {
  const latestValues = {};
  
  // Get the latest value for each MA period
  Object.entries(maData).forEach(([period, data]) => {
    if (data.length > 0) {
      latestValues[`MA${period}`] = data[data.length - 1].value;
    }
  });
  
  return findClosestLevel(currentPrice, latestValues);
};

// Find closest BB level (upper, middle, lower) for each timeframe
export const findClosestBB = (currentPrice, bbData) => {
  if (!bbData || bbData.length === 0) return { level: null, distance: null, name: null };
  
  const latest = bbData[bbData.length - 1];
  
  const levels = {
    'Upper Band': latest.upper,
    'Middle Band': latest.middle,
    'Lower Band': latest.lower
  };
  
  return findClosestLevel(currentPrice, levels);
};

// Detect Golden/Death Cross
export const detectCrosses = (shortMA, longMA) => {
  // Need enough data points
  if (!shortMA || !longMA || shortMA.length < 2 || longMA.length < 2) {
    return {
      lastGoldenCross: null,
      lastDeathCross: null,
      nextCrossEstimate: null
    };
  }
  
  // Find where short MA crosses long MA
  const crosses = [];
  let startIndex = 0;
  
  // Find the first index where both MAs have values
  while (startIndex < shortMA.length && startIndex < longMA.length) {
    if (shortMA[startIndex].time >= longMA[0].time) break;
    startIndex++;
  }
  
  let prevShort = null;
  let prevLong = null;
  let lastGoldenCross = null;
  let lastDeathCross = null;
  
  // Align data points by time
  for (let i = startIndex; i < shortMA.length; i++) {
    const shortPoint = shortMA[i];
    
    // Find matching long MA point
    const longPoint = longMA.find(point => point.time === shortPoint.time);
    if (!longPoint) continue;
    
    // Check for cross
    if (prevShort !== null && prevLong !== null) {
      const prevAbove = prevShort > prevLong;
      const currAbove = shortPoint.value > longPoint.value;
      
      if (prevAbove !== currAbove) {
        const crossTime = shortPoint.time;
        const isCrossUp = currAbove; // Golden cross when short MA crosses above long MA
        
        crosses.push({
          time: crossTime,
          type: isCrossUp ? 'golden' : 'death',
          shortValue: shortPoint.value,
          longValue: longPoint.value
        });
        
        if (isCrossUp) {
          lastGoldenCross = {
            time: crossTime,
            shortValue: shortPoint.value,
            longValue: longPoint.value
          };
        } else {
          lastDeathCross = {
            time: crossTime,
            shortValue: shortPoint.value,
            longValue: longPoint.value
          };
        }
      }
    }
    
    prevShort = shortPoint.value;
    prevLong = longPoint.value;
  }
  
  // Estimate next cross if possible (linear extrapolation)
  let nextCrossEstimate = null;
  
  if (prevShort !== null && prevLong !== null && shortMA.length >= 5 && longMA.length >= 5) {
    // Get recent trends
    const shortTrend = shortMA[shortMA.length - 1].value - shortMA[shortMA.length - 5].value;
    const longTrend = longMA[longMA.length - 1].value - longMA[longMA.length - 5].value;
    
    // Difference in slopes
    const trendDiff = shortTrend - longTrend;
    
    // Current difference in values
    const currentDiff = prevShort - prevLong;
    
    // Estimate days until next cross if trends continue
    if (trendDiff !== 0 && Math.sign(trendDiff) !== Math.sign(currentDiff)) {
      const timeUntilCross = Math.abs(currentDiff / trendDiff) * 5; // Multiply by 5 because we used 5 candles for trend
      const nextCrossType = currentDiff > 0 ? 'death' : 'golden';
      const estimatedDate = new Date(shortMA[shortMA.length - 1].time + timeUntilCross * 24 * 60 * 60 * 1000);
      
      nextCrossEstimate = {
        estimatedTime: estimatedDate.getTime(),
        type: nextCrossType,
        daysUntil: timeUntilCross
      };
    }
  }
  
  return {
    lastGoldenCross,
    lastDeathCross,
    nextCrossEstimate,
    allCrosses: crosses
  };
};

// Get all technical levels for MA and BB
export const getAllTechnicalLevels = (maData, bbData) => {
  const result = {
    '1h': {
      ma: {},
      bb: {}
    },
    '4h': {
      ma: {},
      bb: {}
    },
    'daily': {
      ma: {},
      bb: {}
    }
  };
  
  // Add all MA levels
  for (const [timeframe, data] of Object.entries(maData)) {
    if (data && Object.keys(data).length > 0) {
      const periods = [9, 21, 55, 100, 200];
      for (const period of periods) {
        if (data[period] && data[period].length > 0) {
          result[timeframe].ma[`MA${period}`] = data[period][data[period].length - 1].value;
        }
      }
    }
  }
  
  // Add BB levels
  for (const [timeframe, data] of Object.entries(bbData)) {
    if (data && data.length > 0) {
      const latest = data[data.length - 1];
      result[timeframe].bb['Upper'] = latest.upper;
      result[timeframe].bb['Middle'] = latest.middle;
      result[timeframe].bb['Lower'] = latest.lower;
    }
  }
  
  return result;
};

// Prepare chart data for MAs
export const prepareMAChartData = (candles, maData) => {
  // Extract candle times and MA times
  const chartData = [];
  
  // Prepare base data from candles
  for (let i = 0; i < candles.length; i++) {
    chartData.push({
      time: candles[i].time,
      price: candles[i].close
    });
  }
  
  // Add MA data to chart points
  for (const [period, data] of Object.entries(maData)) {
    for (const point of data) {
      const chartPoint = chartData.find(cp => cp.time === point.time);
      if (chartPoint) {
        chartPoint[`MA${period}`] = point.value;
      }
    }
  }
  
  return chartData;
};

// Prepare chart data for BB
export const prepareBBChartData = (candles, bbData) => {
  const chartData = [];
  
  // Prepare base data from candles
  for (let i = 0; i < candles.length; i++) {
    chartData.push({
      time: candles[i].time,
      price: candles[i].close
    });
  }
  
  // Add BB data to chart points
  for (const point of bbData) {
    const chartPoint = chartData.find(cp => cp.time === point.time);
    if (chartPoint) {
      chartPoint.upper = point.upper;
      chartPoint.middle = point.middle;
      chartPoint.lower = point.lower;
    }
  }
  
  return chartData;
};

// Prepare chart data for crosses
export const prepareCrossChartData = (candles, shortMA, longMA, crosses) => {
  const chartData = [];
  
  // Prepare base data from candles
  for (let i = 0; i < candles.length; i++) {
    chartData.push({
      time: candles[i].time,
      timestamp: candles[i].time, // Add timestamp for easier access
      price: candles[i].close
    });
  }
  
  // Add MA data to chart points
  for (const point of shortMA) {
    const chartPoint = chartData.find(cp => cp.time === point.time);
    if (chartPoint) {
      chartPoint.shortMA = point.value;
    }
  }
  
  for (const point of longMA) {
    const chartPoint = chartData.find(cp => cp.time === point.time);
    if (chartPoint) {
      chartPoint.longMA = point.value;
    }
  }
  
  // Mark cross points with better cross detection
  if (crosses && crosses.allCrosses) {
    for (const cross of crosses.allCrosses) {
      const chartPoint = chartData.find(cp => cp.time === cross.time);
      if (chartPoint) {
        chartPoint.crossType = cross.type;
        chartPoint.cross = cross.type === 'golden' ? 'Golden Cross' : 'Death Cross';
      }
    }
  }
  
  return chartData;
};

// Check if cross event is within 5 days (alert range)
export const isCrossInAlertRange = (crossTime, maxDaysAlert = 5) => {
  if (!crossTime) return false;
  
  const now = Date.now();
  const crossDate = new Date(crossTime).getTime();
  const daysDiff = Math.abs(now - crossDate) / (1000 * 60 * 60 * 24);
  
  return daysDiff <= maxDaysAlert;
};

// Generate technical alerts for a symbol
export const generateTechnicalAlerts = (data) => {
  const {
    symbol,
    stochRSIData,
    macdData,
    fearGreedIndex,
    crossData,
    timeframes = ['1h', '4h', 'daily']
  } = data;
  
  const alerts = [];
  const now = Date.now();
  
  timeframes.forEach(timeframe => {
    const tfLabel = timeframe.toUpperCase();
    
    // MA Cross Alerts (within 5 days)
    if (crossData?.[timeframe]) {
      const cross = crossData[timeframe];
      
      // Recent Golden Cross
      if (cross.lastGoldenCross && isCrossInAlertRange(cross.lastGoldenCross.time)) {
        const daysAgo = Math.round((now - cross.lastGoldenCross.time) / (1000 * 60 * 60 * 24));
        alerts.push({
          type: 'cross',
          severity: 'high',
          timeframe,
          symbol,
          message: `Golden Cross ${daysAgo === 0 ? 'today' : `${daysAgo} days ago`} (${tfLabel})`,
          crossType: 'golden',
          timestamp: cross.lastGoldenCross.time,
          daysAgo
        });
      }
      
      // Recent Death Cross
      if (cross.lastDeathCross && isCrossInAlertRange(cross.lastDeathCross.time)) {
        const daysAgo = Math.round((now - cross.lastDeathCross.time) / (1000 * 60 * 60 * 24));
        alerts.push({
          type: 'cross',
          severity: 'high',
          timeframe,
          symbol,
          message: `Death Cross ${daysAgo === 0 ? 'today' : `${daysAgo} days ago`} (${tfLabel})`,
          crossType: 'death',
          timestamp: cross.lastDeathCross.time,
          daysAgo
        });
      }
      
      // Upcoming Cross
      if (cross.nextCrossEstimate && cross.nextCrossEstimate.daysUntil <= 5) {
        const daysUntil = Math.round(cross.nextCrossEstimate.daysUntil);
        alerts.push({
          type: 'cross',
          severity: 'medium',
          timeframe,
          symbol,
          message: `${cross.nextCrossEstimate.type === 'golden' ? 'Golden' : 'Death'} Cross in ${daysUntil} days (${tfLabel})`,
          crossType: cross.nextCrossEstimate.type,
          timestamp: cross.nextCrossEstimate.estimatedTime,
          daysUntil
        });
      }
    }
    
    // Stochastic RSI Alerts
    if (stochRSIData?.[timeframe] && stochRSIData[timeframe].length > 0) {
      const latest = stochRSIData[timeframe][stochRSIData[timeframe].length - 1];
      const stochRSI = latest.stochRSI || 0;
      
      if (stochRSI >= 80) {
        alerts.push({
          type: 'stochRSI',
          severity: 'medium',
          timeframe,
          symbol,
          message: `StochRSI Overbought (${stochRSI.toFixed(1)}) - ${tfLabel}`,
          value: stochRSI,
          condition: 'overbought'
        });
      } else if (stochRSI <= 20) {
        alerts.push({
          type: 'stochRSI',
          severity: 'medium',
          timeframe,
          symbol,
          message: `StochRSI Oversold (${stochRSI.toFixed(1)}) - ${tfLabel}`,
          value: stochRSI,
          condition: 'oversold'
        });
      }
    }
    
    // MACD Alerts (simplified overbought/oversold based on histogram extremes)
    if (macdData?.[timeframe] && macdData[timeframe].length > 0) {
      const latest = macdData[timeframe][macdData[timeframe].length - 1];
      const histogram = latest.histogram || 0;
      
      // Get recent histogram values for context
      const recentHistograms = macdData[timeframe].slice(-10).map(d => d.histogram);
      const maxHistogram = Math.max(...recentHistograms);
      const minHistogram = Math.min(...recentHistograms);
      const histogramRange = maxHistogram - minHistogram;
      
      // Consider overbought if histogram is in top 10% of recent range
      if (histogramRange > 0 && histogram >= (maxHistogram - histogramRange * 0.1)) {
        alerts.push({
          type: 'macd',
          severity: 'low',
          timeframe,
          symbol,
          message: `MACD potentially overbought - ${tfLabel}`,
          value: histogram,
          condition: 'overbought'
        });
      }
      // Consider oversold if histogram is in bottom 10% of recent range
      else if (histogramRange > 0 && histogram <= (minHistogram + histogramRange * 0.1)) {
        alerts.push({
          type: 'macd',
          severity: 'low',
          timeframe,
          symbol,
          message: `MACD potentially oversold - ${tfLabel}`,
          value: histogram,
          condition: 'oversold'
        });
      }
    }
  });
  
  // Fear & Greed Index Alerts
  if (fearGreedIndex !== null && fearGreedIndex !== undefined) {
    if (fearGreedIndex <= 20) {
      alerts.push({
        type: 'fearGreed',
        severity: 'high',
        symbol,
        message: `Extreme Fear - Fear & Greed Index: ${fearGreedIndex}`,
        value: fearGreedIndex,
        condition: 'extreme_fear'
      });
    } else if (fearGreedIndex >= 85) {
      alerts.push({
        type: 'fearGreed',
        severity: 'high',
        symbol,
        message: `Extreme Greed - Fear & Greed Index: ${fearGreedIndex}`,
        value: fearGreedIndex,
        condition: 'extreme_greed'
      });
    }
  }
  
  return alerts;
};