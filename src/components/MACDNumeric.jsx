import React, { useMemo, useEffect } from 'react';
import { calculateMACD } from '../utils/technicalIndicators';

const MACDNumeric = ({ data, timeframe, symbol, binanceMACD = null }) => {
  // Add debugging
  useEffect(() => {
    console.log('MACDNumeric - Props changed:', { 
      timeframe, 
      symbol, 
      dataLength: data?.length || 0,
      dataFirst3: data?.slice(0, 3) || []
    });
  }, [data, timeframe, symbol]);

  const currentMACD = useMemo(() => {
    if (!data || data.length === 0) {
      console.log('MACDNumeric - No data available');
      return { macd: 0, signal: 0, histogram: 0, hasData: false };
    }

    // MACD needs 34 data points minimum (26 for slow EMA + 9 for signal line - 1)
    const requiredPoints = 34;
    if (data.length < requiredPoints) {
      console.log(`MACDNumeric - Need ${requiredPoints} points, have ${data.length}`);
      return { macd: 0, signal: 0, histogram: 0, hasData: false, dataPoints: data.length, required: requiredPoints };
    }

    const macdData = calculateMACD(data, 12, 26, 9);
    
    console.log('MACDNumeric - Calculation result:', {
      timeframe,
      dataLength: data?.length || 0,
      macdDataLength: macdData.length,
      lastMACD: macdData.length > 0 ? macdData[macdData.length - 1] : null
    });

    if (macdData.length === 0) {
      console.log('MACDNumeric - Calculation returned no results');
      return { macd: 0, signal: 0, histogram: 0, hasData: false };
    }

    const latest = macdData[macdData.length - 1];
    return {
      macd: parseFloat(latest.macd) || 0,
      signal: parseFloat(latest.signal) || 0,
      histogram: parseFloat(latest.histogram) || 0,
      hasData: true
    };
  }, [data, timeframe]);

  const { macd: macdValue, signal: signalValue, histogram: histogramValue, hasData, dataPoints, required } = currentMACD;

  // Use Binance values if provided, otherwise use calculated values
  const displayMACD = binanceMACD || {
    macd: macdValue,
    signal: signalValue,
    histogram: histogramValue
  };

  if (!hasData && !binanceMACD) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">MACD ({timeframe})</h4>
        <div className="text-gray-400 text-sm">
          {!data || data.length === 0 
            ? 'Loading MACD...' 
            : `Need ${required || 34} data points, have ${dataPoints || 0}`
          }
        </div>
      </div>
    );
  }



  let signal = 'Neutral';
  let signalColor = 'text-gray-400';
  let bgColor = 'bg-gray-900/50';

  const macdVal = displayMACD.macd;
  const signalVal = displayMACD.signal;
  const histogramVal = displayMACD.histogram;

  if (macdVal > signalVal && histogramVal > 0) {
    signal = 'Bullish';
    signalColor = 'text-green-400';
    bgColor = 'bg-green-900/20';
  } else if (macdVal < signalVal && histogramVal < 0) {
    signal = 'Bearish';
    signalColor = 'text-red-400';
    bgColor = 'bg-red-900/20';
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">MACD ({timeframe})</h4>
          {binanceMACD && (
            <div className="text-xs text-blue-400 mt-1">Live Binance Data</div>
          )}
        </div>
        <div className={`text-xs px-2 py-1 rounded ${signalColor} ${bgColor}`}>
          {signal}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {macdVal.toFixed(5)}
            </div>
            <div className="text-xs text-gray-400">DIF (MACD)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-400">
              {signalVal.toFixed(5)}
            </div>
            <div className="text-xs text-gray-400">DEA (Signal)</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${histogramVal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {histogramVal.toFixed(5)}
            </div>
            <div className="text-xs text-gray-400">MACD Bar</div>
          </div>
        </div>

        <div className="bg-gray-900/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-2">Signal Interpretation:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-900/20 rounded p-2">
              <div className="text-green-400 font-medium">Bullish Signal</div>
              <div className="text-gray-400">MACD &gt; Signal &amp; Histogram &gt; 0</div>
            </div>
            <div className="bg-red-900/20 rounded p-2">
              <div className="text-red-400 font-medium">Bearish Signal</div>
              <div className="text-gray-400">MACD &lt; Signal &amp; Histogram &lt; 0</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center">
          Parameters: Fast EMA(12), Slow EMA(26), Signal EMA(9)
        </div>
      </div>
    </div>
  );
};

export default MACDNumeric;