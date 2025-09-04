import React from 'react';
import TechnicalIndicatorCard from './TechnicalIndicatorCard';
import FearGreedCard from './FearGreedCard';

/**
 * Technical Indicators Section Component
 * Displays StochRSI, MACD, and Fear & Greed Index with alert icons
 */
const TechnicalIndicatorsSection = ({ 
  chartData, 
  selectedSymbol, 
  fearGreedIndex 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded"></div>
        <h2 className="text-2xl font-bold text-white">Technical Indicators & Market Sentiment</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* StochRSI & MACD Cards for each timeframe */}
        <TechnicalIndicatorCard 
          title="Technical Indicators"
          timeframe="1h"
          stochRSIData={chartData.stochRSI1h}
          macdData={chartData.macd1h}
          symbol={selectedSymbol}
        />
        <TechnicalIndicatorCard 
          title="Technical Indicators"
          timeframe="4h"
          stochRSIData={chartData.stochRSI4h}
          macdData={chartData.macd4h}
          symbol={selectedSymbol}
        />
        <TechnicalIndicatorCard 
          title="Technical Indicators"
          timeframe="daily"
          stochRSIData={chartData.stochRSIDaily}
          macdData={chartData.macdDaily}
          symbol={selectedSymbol}
        />
        
        {/* Fear & Greed Index Card */}
        <FearGreedCard fearGreedIndex={fearGreedIndex} />
      </div>
    </div>
  );
};

export default TechnicalIndicatorsSection;