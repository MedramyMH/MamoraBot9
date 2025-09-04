import React, { useMemo, useEffect } from 'react';
import { calculateStochasticRSI } from '../utils/technicalIndicators';

const StochRSINumeric = ({ data, timeframe, symbol }) => {
  // Add debugging
  useEffect(() => {
    console.log('StochRSINumeric - Props changed:', { 
      timeframe, 
      symbol, 
      dataLength: data?.length || 0,
      dataFirst3: data?.slice(0, 3) || []
    });
  }, [data, timeframe, symbol]);

  const currentStochRSI = useMemo(() => {
    if (!data || data.length === 0) {
      console.log('StochRSINumeric - No data available');
      return { stochRSI: 0, percentK: 0, percentD: 0, hasData: false };
    }

    // Stochastic RSI needs 28 data points minimum (14 for RSI + 14 for Stochastic)
    const requiredPoints = 28;
    if (data.length < requiredPoints) {
      console.log(`StochRSINumeric - Need ${requiredPoints} points, have ${data.length}`);
      return { stochRSI: 0, percentK: 0, percentD: 0, hasData: false, dataPoints: data.length, required: requiredPoints };
    }

    const stochRSIData = calculateStochasticRSI(data, 14, 14, 3, 3);
    if (stochRSIData.length === 0) {
      console.log('StochRSINumeric - Calculation returned no results');
      return { stochRSI: 0, percentK: 0, percentD: 0, hasData: false };
    }

    const latest = stochRSIData[stochRSIData.length - 1];
    
    // Use the smoothed K and D values from TradingView-compatible calculation
    const percentK = latest.stochRSI || 0;  // This is %K (smoothed)
    const percentD = latest.stochRSID || 0; // This is %D (double smoothed)

    console.log('StochRSINumeric - Calculated values:', { 
      percentK, 
      percentD, 
      timeframe 
    });

    return { 
      stochRSI: percentK, 
      percentK: percentK, 
      percentD: percentD,
      hasData: true
    };
  }, [data, timeframe]);

  const { stochRSI, percentK, percentD, hasData, dataPoints, required } = currentStochRSI;

  if (!hasData) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Stochastic RSI ({timeframe})</h4>
        <div className="text-gray-400 text-sm">
          {!data || data.length === 0 
            ? 'Loading Stochastic RSI...' 
            : `Need ${required || 28} data points, have ${dataPoints || 0}`
          }
        </div>
      </div>
    );
  }

  let signal = 'Neutral';
  let signalColor = 'text-gray-400';
  let bgColor = 'bg-gray-900/50';

  // StochRSI signals
  if (percentK > 80 && percentD > 80) {
    signal = 'Overbought';
    signalColor = 'text-red-400';
    bgColor = 'bg-red-900/20';
  } else if (percentK < 20 && percentD < 20) {
    signal = 'Oversold';
    signalColor = 'text-green-400';
    bgColor = 'bg-green-900/20';
  } else if (percentK > percentD && percentK > 50) {
    signal = 'Bullish';
    signalColor = 'text-green-400';
    bgColor = 'bg-green-900/20';
  } else if (percentK < percentD && percentK < 50) {
    signal = 'Bearish';
    signalColor = 'text-red-400';
    bgColor = 'bg-red-900/20';
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-white">Stochastic RSI ({timeframe})</h4>
        <div className={`text-xs px-2 py-1 rounded ${signalColor} ${bgColor}`}>
          {signal}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {percentK.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">%K (Fast)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {percentD.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">%D (Slow)</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-red-900/20 rounded p-2 text-center">
            <div className="text-red-400 font-medium">Overbought</div>
            <div className="text-gray-400">&gt; 80</div>
          </div>
          <div className="bg-gray-900/20 rounded p-2 text-center">
            <div className="text-gray-400 font-medium">Neutral</div>
            <div className="text-gray-400">20-80</div>
          </div>
          <div className="bg-green-900/20 rounded p-2 text-center">
            <div className="text-green-400 font-medium">Oversold</div>
            <div className="text-gray-400">&lt; 20</div>
          </div>
        </div>

        <div className="bg-gray-900/30 rounded-lg p-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>0</span>
            <span>20</span>
            <span>50</span>
            <span>80</span>
            <span>100</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 relative">
            {/* Background gradient */}
            <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-30" />
            {/* %K line */}
            <div 
              className="absolute top-0 w-1 h-2 bg-blue-400 rounded-full transform -translate-x-1/2"
              style={{ left: `${Math.min(100, Math.max(0, percentK))}%` }}
            />
            {/* %D line */}
            <div 
              className="absolute top-0 w-1 h-2 bg-purple-400 rounded-full transform -translate-x-1/2"
              style={{ left: `${Math.min(100, Math.max(0, percentD))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span className="text-blue-400">%K: {percentK.toFixed(1)}</span>
            <span className="text-purple-400">%D: {percentD.toFixed(1)}</span>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center">
          StochRSI combines RSI momentum with Stochastic sensitivity
        </div>
      </div>
    </div>
  );
};

export default StochRSINumeric;