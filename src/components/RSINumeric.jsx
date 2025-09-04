import React, { useMemo, useEffect } from 'react';
import { calculateRSI } from '../utils/technicalIndicators';

const RSINumeric = ({ data, timeframe, symbol }) => {
  // Add debugging
  useEffect(() => {
    console.log('RSINumeric - Props changed:', { 
      timeframe, 
      symbol, 
      dataLength: data?.length || 0,
      dataFirst3: data?.slice(0, 3) || []
    });
  }, [data, timeframe, symbol]);

  const currentRSI = useMemo(() => {
    if (!data || data.length === 0) {
      console.log('RSINumeric - No data available');
      return 0;
    }

    const rsi = calculateRSI(data, 14);
    const rsiValue = rsi.length > 0 ? rsi[rsi.length - 1].rsi : 0;
    console.log('RSINumeric - Calculated RSI:', rsiValue, 'for timeframe:', timeframe);
    return rsiValue;
  }, [data, timeframe]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">RSI ({timeframe})</h4>
        <div className="text-gray-400 text-sm">Loading RSI...</div>
      </div>
    );
  }

  let signal = 'Neutral';
  let signalColor = 'text-gray-400';
  let bgColor = 'bg-gray-900/50';

  if (currentRSI > 70) {
    signal = 'Overbought';
    signalColor = 'text-red-400';
    bgColor = 'bg-red-900/20';
  } else if (currentRSI < 30) {
    signal = 'Oversold';
    signalColor = 'text-green-400';
    bgColor = 'bg-green-900/20';
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-white">RSI ({timeframe})</h4>
        <div className={`text-xs px-2 py-1 rounded ${signalColor} ${bgColor}`}>
          {signal}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {currentRSI.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">Current RSI</div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-red-900/20 rounded p-2 text-center">
            <div className="text-red-400 font-medium">Overbought</div>
            <div className="text-gray-400">&gt; 70</div>
          </div>
          <div className="bg-gray-900/20 rounded p-2 text-center">
            <div className="text-gray-400 font-medium">Neutral</div>
            <div className="text-gray-400">30-70</div>
          </div>
          <div className="bg-green-900/20 rounded p-2 text-center">
            <div className="text-green-400 font-medium">Oversold</div>
            <div className="text-gray-400">&lt; 30</div>
          </div>
        </div>

        <div className="bg-gray-900/30 rounded-lg p-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>30</span>
            <span>50</span>
            <span>70</span>
            <span>100</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              style={{ width: `${currentRSI}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSINumeric;