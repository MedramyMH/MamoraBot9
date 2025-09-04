import React, { useState } from 'react';
import StochasticRSI from './StochasticRSI';
import MACD from './MACD';

const TechnicalIndicatorSelector = ({ data, symbol }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('4h');
  
  const timeframes = [
    { key: '1h', label: '1H' },
    { key: '4h', label: '4H' },
    { key: 'daily', label: 'Daily' }
  ];

  return (
    <div className="space-y-4">
      {/* Timeframe Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-800/50 rounded-lg p-1 flex">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setSelectedTimeframe(tf.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === tf.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Technical Indicators Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Stochastic RSI */}
        <StochasticRSI 
          data={data[`stochRSI${selectedTimeframe === 'daily' ? 'Daily' : selectedTimeframe.toUpperCase()}`]} 
          symbol={symbol}
          height={200}
          timeframe={selectedTimeframe}
        />
        
        {/* MACD */}
        <MACD 
          data={data[`macd${selectedTimeframe === 'daily' ? 'Daily' : selectedTimeframe.toUpperCase()}`]} 
          symbol={symbol}
          height={200}
          timeframe={selectedTimeframe}
        />
      </div>
    </div>
  );
};

export default TechnicalIndicatorSelector;