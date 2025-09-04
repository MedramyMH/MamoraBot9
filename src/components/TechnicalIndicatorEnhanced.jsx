import React from 'react';
import { getTokenDecimals } from '../utils/technicalIndicators';
import AlertIcon from './AlertIcon';

const TechnicalIndicatorEnhanced = ({ 
  title, 
  type, 
  timeframe, 
  levels, 
  currentPrice, 
  closestLevel,
  crossData,
  symbol
}) => {
  
  // Format timestamp to human-readable format
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  // Format remaining time to human-readable format
  const formatRemainingTime = (days) => {
    if (!days || days < 0) return 'N/A';
    
    if (days < 1) {
      const hours = Math.round(days * 24);
      return `~${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (days < 30) {
      const roundedDays = Math.round(days);
      return `~${roundedDays} day${roundedDays !== 1 ? 's' : ''}`;
    } else {
      const months = Math.round(days / 30);
      return `~${months} month${months !== 1 ? 's' : ''}`;
    }
  };

  // Format percentages to always have 2 decimal places
  const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0.00';
    return value.toFixed(2);
  };

  // Format price with appropriate decimals for the token
  const formatPrice = (price) => {
    if (!price || typeof price !== 'number') return '0';
    const decimals = getTokenDecimals(symbol);
    return price.toFixed(decimals);
  };

  // Check if cross occurred within 7 days (for past crosses)
  const isWithin7Days = (timestamp) => {
    if (!timestamp) return false;
    const now = Date.now();
    const daysDiff = Math.abs(now - timestamp) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  };

  // Check if estimated cross is within 14 days (for future crosses)
  const isWithin14Days = (daysUntil) => {
    return daysUntil !== null && daysUntil !== undefined && daysUntil <= 14;
  };

  const getDaysAgo = (timestamp) => {
    const now = Date.now();
    return Math.round((now - timestamp) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="chart-container group hover:shadow-2xl transition-all duration-300">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              type === 'MA' ? 'bg-blue-500' : 'bg-green-500'
            }`}></div>
            <span>{title}</span>
          </h3>
          <div className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30">
            <span className="text-sm font-medium text-blue-300">{timeframe}</span>
          </div>
        </div>
        
        {/* Closest level indicator */}
        {closestLevel && closestLevel.level !== null && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-300 font-medium">
                Closest {type}: {closestLevel.name}
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                closestLevel.distance && closestLevel.distance.isAbove 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={closestLevel.distance && closestLevel.distance.isAbove
                    ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  } clipRule="evenodd" />
                </svg>
                <span>{formatPercentage(closestLevel.distance?.percentage || 0)}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              ${formatPrice(closestLevel.level)}
            </div>
          </div>
        )}
        
        {/* All levels display */}
        {levels && Object.keys(levels).length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">{type} Levels:</h4>
            <div className="space-y-3">
              {Object.entries(levels).map(([name, level]) => {
                if (!level) return null;
                
                // Calculate distance from current price to this level
                const distance = level - currentPrice;
                const percentage = Math.abs((distance / currentPrice) * 100);
                const isAbove = distance > 0;
                const isClosest = closestLevel && name === closestLevel.name;
                
                return (
                  <div key={name} className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 ${
                    isClosest 
                      ? 'bg-blue-500/20 border border-blue-500/40' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isClosest ? 'bg-blue-400' : 'bg-gray-500'}`}></div>
                      <span className="text-sm font-medium text-gray-200">{name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-white font-mono">
                        ${formatPrice(level)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isAbove ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isAbove ? '+' : '-'}{formatPercentage(percentage)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Cross data display */}
        {crossData && (
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-4">Cross Analysis:</h4>
            
            <div className="space-y-4">
              {/* Last Golden Cross */}
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div>
                    <div className="text-xs text-green-300">Last Golden Cross</div>
                    <div className="text-sm font-medium text-white">
                      {crossData.lastGoldenCross ? formatDate(crossData.lastGoldenCross.time) : 'None detected'}
                    </div>
                  </div>
                </div>
                {crossData.lastGoldenCross && isWithin7Days(crossData.lastGoldenCross.time) && (
                  <AlertIcon 
                    type="cross" 
                    severity="high" 
                    size="sm"
                    tooltip={`Golden Cross ${getDaysAgo(crossData.lastGoldenCross.time)} days ago`}
                  />
                )}
              </div>
              
              {/* Last Death Cross */}
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div>
                    <div className="text-xs text-red-300">Last Death Cross</div>
                    <div className="text-sm font-medium text-white">
                      {crossData.lastDeathCross ? formatDate(crossData.lastDeathCross.time) : 'None detected'}
                    </div>
                  </div>
                </div>
                {crossData.lastDeathCross && isWithin7Days(crossData.lastDeathCross.time) && (
                  <AlertIcon 
                    type="cross" 
                    severity="high" 
                    size="sm"
                    tooltip={`Death Cross ${getDaysAgo(crossData.lastDeathCross.time)} days ago`}
                  />
                )}
              </div>
              
              {/* Next Cross Estimate */}
              {crossData.nextCrossEstimate && (
                <div className={`p-3 rounded-lg border ${
                  crossData.nextCrossEstimate.type === 'golden' 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        crossData.nextCrossEstimate.type === 'golden' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <div>
                        <div className="text-xs text-gray-300">Estimated Next Cross</div>
                        <div className="text-sm font-medium text-white">
                          {crossData.nextCrossEstimate.type === 'golden' ? 'Golden' : 'Death'} Cross in {formatRemainingTime(crossData.nextCrossEstimate.daysUntil)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Est. date: {formatDate(crossData.nextCrossEstimate.estimatedTime)}
                        </div>
                      </div>
                    </div>
                    {isWithin14Days(crossData.nextCrossEstimate.daysUntil) && (
                      <AlertIcon 
                        type="warning" 
                        severity="medium" 
                        size="sm"
                        tooltip={`Upcoming ${crossData.nextCrossEstimate.type} cross in ${Math.round(crossData.nextCrossEstimate.daysUntil)} days`}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {(!levels || Object.keys(levels).length === 0) && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="text-gray-400 text-sm">Loading data...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalIndicatorEnhanced;