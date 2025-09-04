import React from 'react';
import AlertIcon from './AlertIcon';

/**
 * Technical Indicator Card Component - displays StochRSI and MACD with alerts
 * Shows overbought/oversold conditions with alert icons
 */
const TechnicalIndicatorCard = ({ 
  title, 
  timeframe, 
  stochRSIData, 
  macdData, 
  symbol 
}) => {
  const getLatestStochRSI = () => {
    if (!stochRSIData || stochRSIData.length === 0) return null;
    return stochRSIData[stochRSIData.length - 1];
  };

  const getLatestMACD = () => {
    if (!macdData || macdData.length === 0) return null;
    return macdData[macdData.length - 1];
  };

  const getStochRSICondition = (value) => {
    if (value >= 80) return { condition: 'overbought', severity: 'high' };
    if (value <= 20) return { condition: 'oversold', severity: 'high' };
    return null;
  };

  const getMACDCondition = (macdData) => {
    if (!macdData || macdData.length < 10) return null;
    
    const latest = macdData[macdData.length - 1];
    const histogram = latest.histogram || 0;
    
    // Get recent histogram values for context
    const recentHistograms = macdData.slice(-10).map(d => d.histogram);
    const maxHistogram = Math.max(...recentHistograms);
    const minHistogram = Math.min(...recentHistograms);
    const histogramRange = maxHistogram - minHistogram;
    
    // Consider overbought if histogram is in top 10% of recent range
    if (histogramRange > 0 && histogram >= (maxHistogram - histogramRange * 0.1)) {
      return { condition: 'overbought', severity: 'medium' };
    }
    // Consider oversold if histogram is in bottom 10% of recent range
    else if (histogramRange > 0 && histogram <= (minHistogram + histogramRange * 0.1)) {
      return { condition: 'oversold', severity: 'medium' };
    }
    
    return null;
  };

  const formatValue = (value, decimals = 2) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toFixed(decimals);
  };

  const latestStochRSI = getLatestStochRSI();
  const latestMACD = getLatestMACD();
  const stochCondition = latestStochRSI ? getStochRSICondition(latestStochRSI.stochRSI || 0) : null;
  const macdCondition = getMACDCondition(macdData);

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-300">{title} - {timeframe.toUpperCase()}</h4>
        {(stochCondition || macdCondition) && (
          <AlertIcon 
            type="warning" 
            severity={stochCondition?.severity || macdCondition?.severity || 'medium'} 
            tooltip="Overbought/Oversold condition detected"
          />
        )}
      </div>

      <div className="space-y-4">
        {/* Stochastic RSI Section */}
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-sm font-medium text-purple-300">Stochastic RSI</span>
            </div>
            {stochCondition && (
              <AlertIcon 
                type="warning" 
                severity={stochCondition.severity} 
                size="sm"
                tooltip={`StochRSI ${stochCondition.condition}`}
              />
            )}
          </div>
          
          {latestStochRSI ? (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">%K:</span>
                <span className={`text-sm font-mono ${stochCondition ? 
                  (stochCondition.condition === 'overbought' ? 'text-red-400' : 'text-green-400') 
                  : 'text-white'}`}>
                  {formatValue(latestStochRSI.stochRSI)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">%D:</span>
                <span className="text-sm font-mono text-white">
                  {formatValue(latestStochRSI.stochRSID)}
                </span>
              </div>
              {stochCondition && (
                <div className={`text-xs font-medium ${
                  stochCondition.condition === 'overbought' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {stochCondition.condition.toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-400">No StochRSI data</div>
          )}
        </div>

        {/* MACD Section */}
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-300">MACD</span>
            </div>
            {macdCondition && (
              <AlertIcon 
                type="warning" 
                severity={macdCondition.severity} 
                size="sm"
                tooltip={`MACD ${macdCondition.condition}`}
              />
            )}
          </div>
          
          {latestMACD ? (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">MACD:</span>
                <span className="text-sm font-mono text-white">
                  {formatValue(latestMACD.macd, 6)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Signal:</span>
                <span className="text-sm font-mono text-white">
                  {formatValue(latestMACD.signal, 6)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Histogram:</span>
                <span className={`text-sm font-mono ${macdCondition ? 
                  (macdCondition.condition === 'overbought' ? 'text-red-400' : 'text-green-400') 
                  : 'text-white'}`}>
                  {formatValue(latestMACD.histogram, 6)}
                </span>
              </div>
              {macdCondition && (
                <div className={`text-xs font-medium ${
                  macdCondition.condition === 'overbought' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {macdCondition.condition.toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-400">No MACD data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicatorCard;