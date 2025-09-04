import React from 'react';
import TechnicalIndicatorEnhanced from './TechnicalIndicatorEnhanced';
import ChartComponent from './ChartComponent';

/**
 * Bollinger Bands Section Component
 * Displays BB indicators and charts for all timeframes
 */
const BollingerBandsSection = ({ 
  bbData, 
  priceData, 
  closestBBLevels, 
  selectedSymbol, 
  chartData 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-teal-600 rounded"></div>
        <h2 className="text-2xl font-bold text-white">Bollinger Bands</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TechnicalIndicatorEnhanced
          title="Bollinger Bands"
          type="BB"
          timeframe="1 Hour"
          levels={bbData['1h'].length > 0 ? {
            'Upper': bbData['1h'][bbData['1h'].length - 1].upper,
            'Middle': bbData['1h'][bbData['1h'].length - 1].middle,
            'Lower': bbData['1h'][bbData['1h'].length - 1].lower
          } : {}}
          currentPrice={priceData.price}
          closestLevel={closestBBLevels['1h']}
          symbol={selectedSymbol}
        />
        <TechnicalIndicatorEnhanced
          title="Bollinger Bands"
          type="BB"
          timeframe="4 Hours"
          levels={bbData['4h'].length > 0 ? {
            'Upper': bbData['4h'][bbData['4h'].length - 1].upper,
            'Middle': bbData['4h'][bbData['4h'].length - 1].middle,
            'Lower': bbData['4h'][bbData['4h'].length - 1].lower
          } : {}}
          currentPrice={priceData.price}
          closestLevel={closestBBLevels['4h']}
          symbol={selectedSymbol}
        />
        <TechnicalIndicatorEnhanced
          title="Bollinger Bands"
          type="BB"
          timeframe="Daily"
          levels={bbData['daily'].length > 0 ? {
            'Upper': bbData['daily'][bbData['daily'].length - 1].upper,
            'Middle': bbData['daily'][bbData['daily'].length - 1].middle,
            'Lower': bbData['daily'][bbData['daily'].length - 1].lower
          } : {}}
          currentPrice={priceData.price}
          closestLevel={closestBBLevels['daily']}
          symbol={selectedSymbol}
        />
      </div>
      
      {/* Bollinger Bands Charts */}
      <div className="grid grid-cols-1 gap-8">
        <ChartComponent
          title="1 Hour Bollinger Bands"
          data={chartData.bb1h}
          type="BB"
          symbol={selectedSymbol}
        />
        <ChartComponent
          title="4 Hour Bollinger Bands"
          data={chartData.bb4h}
          type="BB"
          symbol={selectedSymbol}
        />
        <ChartComponent
          title="Daily Bollinger Bands"
          data={chartData.bbDaily}
          type="BB"
          symbol={selectedSymbol}
        />
      </div>
    </div>
  );
};

export default BollingerBandsSection;