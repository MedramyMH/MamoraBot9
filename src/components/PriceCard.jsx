import React from 'react';
import { formatPrice, formatPriceChange } from '../utils/priceFormatter';
import { getTokenDecimals } from '../utils/technicalIndicators';

const PriceCard = ({ title, currentPrice, priceChangePercent, priceChangeValue, timestamp, symbol }) => {
  // Determine if price change is positive or negative
  const isPositive = parseFloat(priceChangePercent) >= 0;
  
  // Format percentage to always display 2 decimal places
  const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0.00';
    return value.toFixed(2);
  };
  
  // Use the imported formatPrice function instead of local one
  // const formatPrice = (price) => {
  //   if (!price || typeof price !== 'number') return '0';
  //   const decimals = getTokenDecimals(symbol);
  //   return price.toFixed(decimals);
  // };
  
  return (
    <div className="chart-container relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Live indicator */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-gray-700/50 backdrop-blur-sm rounded-full px-3 py-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-300">
          {timestamp ? new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}) : 'Live'}
        </span>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <span>{title}</span>
        </h2>
        
        <div className="flex items-end space-x-4 mb-4">
          <div className="flex-1">
            <div className="text-4xl font-bold text-white mb-2 font-mono">
              ${formatPrice(currentPrice)}
            </div>
            
            <div className={`flex items-center space-x-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={isPositive 
                    ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" 
                    : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"}
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="text-lg font-bold">
                  {isPositive ? '+' : ''}{formatPercentage(priceChangePercent)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">24h Change</div>
            <div className={`text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}${formatPriceChange(priceChangeValue)}
            </div>
          </div>
        </div>
        
        {/* Price trend visualization */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>Live Price Feed</span>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {Array.from({length: 5}).map((_, i) => (
                <div key={i} className="w-1 bg-blue-500 rounded-full animate-pulse" style={{
                  height: `${Math.random() * 16 + 8}px`,
                  animationDelay: `${i * 200}ms`
                }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;