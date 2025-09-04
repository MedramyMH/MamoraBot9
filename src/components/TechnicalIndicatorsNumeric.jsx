import React, { useState } from 'react';
import RSINumeric from './RSINumeric';
import MACDNumeric from './MACDNumeric';

const TechnicalIndicatorsNumeric = ({ candleData, symbol }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('4h');
  
  const timeframes = [
    { key: '1h', label: '1H', data: candleData['1h'] },
    { key: '4h', label: '4H', data: candleData['4h'] },
    { key: 'daily', label: 'Daily', data: candleData['daily'] }
  ];

  const currentTimeframeData = timeframes.find(tf => tf.key === selectedTimeframe)?.data || [];

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
        <RSINumeric 
          data={currentTimeframeData}
          timeframe={selectedTimeframe.toUpperCase()}
          symbol={symbol}
        />
        
        <MACDNumeric 
          data={currentTimeframeData}
          timeframe={selectedTimeframe.toUpperCase()}
          symbol={symbol}
        />
      </div>
    </div>
  );
};

export default TechnicalIndicatorsNumeric;