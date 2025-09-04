import React, { useState, useEffect } from 'react';
import StochRSINumeric from './StochRSINumeric';
import MACDNumeric from './MACDNumeric';
import FearGreedIndex from './FearGreedIndex';
import { formatPrice, formatPriceChange } from '../utils/priceFormatter';

const PriceDashboard = ({ 
  priceData, 
  selectedSymbol, 
  candleData,
  binanceMACDData = null
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('4h');

  // Debug logging for tab switching
  useEffect(() => {
    console.log('PriceDashboard - selectedTimeframe changed to:', selectedTimeframe);
    console.log('PriceDashboard - available candleData keys:', Object.keys(candleData || {}));
  }, [selectedTimeframe, candleData]);
  
  const timeframes = [
    { key: '1h', label: '1H', data: candleData['1h'] || [] },
    { key: '4h', label: '4H', data: candleData['4h'] || [] },
    { key: 'daily', label: 'Daily', data: candleData['daily'] || [] }
  ];

  const currentTimeframeData = timeframes.find(tf => tf.key === selectedTimeframe)?.data || [];

  // Format price change color
  const priceChangeColor = priceData.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400';
  const priceChangeBg = priceData.priceChangePercent >= 0 ? 'bg-green-900/20' : 'bg-red-900/20';

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6 space-y-6">
      {/* Price Section */}
      <div className="text-center pb-4 border-b border-gray-700/50">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-2xl font-bold text-white">{selectedSymbol}</h2>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
          <div className="text-4xl font-bold text-white">
            ${priceData.price ? priceData.price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8
            }).replace(/\.?0+$/, '') : '0'}
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <div className={`px-3 py-1 rounded-lg ${priceChangeBg}`}>
              <span className={`text-sm font-medium ${priceChangeColor}`}>
                {priceData.priceChangePercent >= 0 ? '+' : ''}{priceData.priceChangePercent?.toFixed(2) || '0.00'}%
              </span>
            </div>
            <div className={`text-sm ${priceChangeColor}`}>
              {priceData.priceChangePercent >= 0 ? '+' : ''}{formatPriceChange(priceData.priceChange)}
            </div>
          </div>
          
          {priceData.lastUpdate && (
            <div className="text-xs text-gray-400">
              Last updated: {new Date(priceData.lastUpdate).toLocaleTimeString('en-GB', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>

      {/* Technical Indicators Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-600 rounded"></div>
            <h3 className="text-lg font-bold text-white">Technical Indicators</h3>
          </div>

          {/* Timeframe Selector */}
          <div className="bg-gray-700/50 rounded-lg p-1 flex relative z-10">
            {timeframes.map((tf) => (
              <button
                key={tf.key}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Button clicked - switching to timeframe:', tf.key);
                  console.log('Current timeframe before switch:', selectedTimeframe);
                  setSelectedTimeframe(tf.key);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer relative z-10 ${
                  selectedTimeframe === tf.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                style={{ pointerEvents: 'auto' }}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Debug info */}
        <div className="text-xs text-gray-500">
          Current: {selectedTimeframe} | Data points: {currentTimeframeData.length}
        </div>

        {/* Technical Indicators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StochRSINumeric 
            data={currentTimeframeData}
            timeframe={selectedTimeframe.toUpperCase()}
            symbol={selectedSymbol}
          />
          
          <MACDNumeric 
            data={currentTimeframeData}
            timeframe={selectedTimeframe.toUpperCase()}
            symbol={selectedSymbol}
            binanceMACD={binanceMACDData?.[selectedTimeframe]}
          />

          <FearGreedIndex height={180} />
        </div>
      </div>
    </div>
  );
};

export default PriceDashboard;