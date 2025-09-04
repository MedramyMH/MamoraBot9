import React from 'react';
import TechnicalIndicatorEnhanced from './TechnicalIndicatorEnhanced';
import ChartComponent from './ChartComponent';

/**
 * Moving Averages Section Component
 * Displays MA indicators and charts for all timeframes
 */
const MovingAveragesSection = ({ 
  maData, 
  priceData, 
  closestMALevels, 
  maaCrosses, 
  selectedSymbol, 
  chartData 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded"></div>
        <h2 className="text-2xl font-bold text-white">Moving Averages</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TechnicalIndicatorEnhanced
          title="Moving Averages"
          type="MA"
          timeframe="1 Hour"
          levels={maData['1h'] ? Object.fromEntries(
            Object.entries(maData['1h']).map(([period, data]) => 
              [`MA${period}`, data.length > 0 ? data[data.length - 1].value : null]
            )
          ) : {}}
          currentPrice={priceData.price}
          closestLevel={closestMALevels['1h']}
          crossData={maaCrosses['1h']}
          symbol={selectedSymbol}
        />
        <TechnicalIndicatorEnhanced
          title="Moving Averages"
          type="MA"
          timeframe="4 Hours"
          levels={maData['4h'] ? Object.fromEntries(
            Object.entries(maData['4h']).map(([period, data]) => 
              [`MA${period}`, data.length > 0 ? data[data.length - 1].value : null]
            )
          ) : {}}
          currentPrice={priceData.price}
          closestLevel={closestMALevels['4h']}
          crossData={maaCrosses['4h']}
          symbol={selectedSymbol}
        />
        <TechnicalIndicatorEnhanced
          title="Moving Averages"
          type="MA"
          timeframe="Daily"
          levels={maData['daily'] ? Object.fromEntries(
            Object.entries(maData['daily']).map(([period, data]) => 
              [`MA${period}`, data.length > 0 ? data[data.length - 1].value : null]
            )
          ) : {}}
          currentPrice={priceData.price}
          closestLevel={closestMALevels['daily']}
          crossData={maaCrosses['daily']}
          symbol={selectedSymbol}
        />
      </div>
      
      {/* Moving Average Charts */}
      <div className="grid grid-cols-1 gap-8">
        <ChartComponent
          title="1 Hour Moving Averages"
          data={chartData.ma1h}
          type="MA"
          symbol={selectedSymbol}
        />
        <ChartComponent
          title="4 Hour Moving Averages"
          data={chartData.ma4h}
          type="MA"
          symbol={selectedSymbol}
        />
        <ChartComponent
          title="Daily Moving Averages"
          data={chartData.maDaily}
          type="MA"
          symbol={selectedSymbol}
        />
      </div>
    </div>
  );
};

export default MovingAveragesSection;