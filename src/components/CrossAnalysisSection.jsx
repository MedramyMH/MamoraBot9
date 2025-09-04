import React from 'react';
import ChartComponent from './ChartComponent';
import CrossAnalysisCard from './CrossAnalysisCard';
import AlertIcon from './AlertIcon';

/**
 * Cross Analysis Section Component
 * Displays MA cross charts and analysis for all timeframes with alert icons
 */
const CrossAnalysisSection = ({ 
  maaCrosses, 
  selectedSymbol, 
  chartData 
}) => {
  // Generate cross alerts for the header
  const generateCrossAlerts = () => {
    const alerts = [];
    const timeframes = ['1h', '4h', 'daily'];
    const now = Date.now();
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    
    timeframes.forEach(timeframe => {
      const crosses = maaCrosses[timeframe];
      if (crosses) {
        // Check for recent Golden Cross
        if (crosses.lastGoldenCross && (now - crosses.lastGoldenCross.time) <= fiveDaysInMs) {
          const daysAgo = Math.floor((now - crosses.lastGoldenCross.time) / (24 * 60 * 60 * 1000));
          alerts.push({
            timeframe,
            type: 'golden_cross',
            daysAgo,
            timestamp: crosses.lastGoldenCross.time
          });
        }
        
        // Check for recent Death Cross
        if (crosses.lastDeathCross && (now - crosses.lastDeathCross.time) <= fiveDaysInMs) {
          const daysAgo = Math.floor((now - crosses.lastDeathCross.time) / (24 * 60 * 60 * 1000));
          alerts.push({
            timeframe,
            type: 'death_cross',
            daysAgo,
            timestamp: crosses.lastDeathCross.time
          });
        }
      }
    });
    
    return alerts;
  };

  const crossAlerts = generateCrossAlerts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-600 rounded"></div>
          <h2 className="text-2xl font-bold text-white">MA Cross Analysis (MA55 & MA200)</h2>
        </div>
        {crossAlerts.length > 0 && (
          <div className="flex items-center space-x-2">
            <AlertIcon 
              type={crossAlerts.some(a => a.type === 'death_cross') ? 'alert' : 'warning'}
              severity="medium"
              tooltip={`${crossAlerts.length} recent cross event(s) detected`}
              animate={true}
            />
            <span className="text-xs text-gray-400">
              {crossAlerts.length} alert{crossAlerts.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      
      {/* Cross Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CrossAnalysisCard 
          crossData={maaCrosses['1h']} 
          timeframe="1h" 
          symbol={selectedSymbol}
        />
        <CrossAnalysisCard 
          crossData={maaCrosses['4h']} 
          timeframe="4h" 
          symbol={selectedSymbol}
        />
        <CrossAnalysisCard 
          crossData={maaCrosses['daily']} 
          timeframe="daily" 
          symbol={selectedSymbol}
        />
      </div>
      
      {/* Cross Analysis Charts */}
      <div className="grid grid-cols-1 gap-8">
        <ChartComponent
          title="1 Hour MA Cross (MA55 & MA200)"
          data={chartData.cross1h}
          type="CROSS"
          crossData={maaCrosses['1h']}
          symbol={selectedSymbol}
        />
        <ChartComponent
          title="4 Hour MA Cross (MA55 & MA200)"
          data={chartData.cross4h}
          type="CROSS"
          crossData={maaCrosses['4h']}
          symbol={selectedSymbol}
        />
        <ChartComponent
          title="Daily MA Cross (MA55 & MA200)"
          data={chartData.crossDaily}
          type="CROSS"
          crossData={maaCrosses['daily']}
          symbol={selectedSymbol}
        />
      </div>
    </div>
  );
};

export default CrossAnalysisSection;