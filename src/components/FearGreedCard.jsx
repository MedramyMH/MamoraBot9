import React from 'react';
import AlertIcon from './AlertIcon';

/**
 * Fear & Greed Index Card Component - displays market sentiment with alerts
 * Shows extreme fear/greed conditions with alert icons
 */
const FearGreedCard = ({ fearGreedIndex }) => {
  const getIndexColor = (value) => {
    if (value <= 25) return 'text-red-400';
    if (value <= 45) return 'text-orange-400';
    if (value <= 55) return 'text-yellow-400';
    if (value <= 75) return 'text-green-400';
    return 'text-emerald-400';
  };

  const getIndexLabel = (value) => {
    if (value <= 25) return 'Extreme Fear';
    if (value <= 45) return 'Fear';
    if (value <= 55) return 'Neutral';
    if (value <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  const getGradientColor = (value) => {
    if (value <= 25) return 'from-red-600 to-red-400';
    if (value <= 45) return 'from-orange-600 to-orange-400';
    if (value <= 55) return 'from-yellow-600 to-yellow-400';
    if (value <= 75) return 'from-green-600 to-green-400';
    return 'from-emerald-600 to-emerald-400';
  };

  const getExtremeCondition = (value) => {
    if (value <= 20) return { condition: 'extreme_fear', severity: 'high' };
    if (value >= 85) return { condition: 'extreme_greed', severity: 'high' };
    return null;
  };

  if (fearGreedIndex === null || fearGreedIndex === undefined) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Fear & Greed Index</h4>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const value = parseInt(fearGreedIndex);
  const extremeCondition = getExtremeCondition(value);

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-300">Fear & Greed Index</h4>
        {extremeCondition && (
          <AlertIcon 
            type="warning" 
            severity={extremeCondition.severity} 
            tooltip={`${extremeCondition.condition === 'extreme_fear' ? 'Extreme Fear' : 'Extreme Greed'} detected`}
          />
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Circular Progress */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#374151"
              strokeWidth="6"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="url(#fearGreedGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(value / 100) * 219.91} 219.91`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="fearGreedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={value <= 25 ? '#ef4444' : value <= 45 ? '#f97316' : value <= 55 ? '#eab308' : value <= 75 ? '#22c55e' : '#10b981'} />
                <stop offset="100%" stopColor={value <= 25 ? '#dc2626' : value <= 45 ? '#ea580c' : value <= 55 ? '#ca8a04' : value <= 75 ? '#16a34a' : '#059669'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${getIndexColor(value)}`}>
              {value}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className={`text-base font-semibold ${getIndexColor(value)}`}>
              {getIndexLabel(value)}
            </div>
            {extremeCondition && (
              <AlertIcon 
                type="alert" 
                severity={extremeCondition.severity} 
                size="sm"
                animate={true}
              />
            )}
          </div>
          
          <div className="text-xs text-gray-400 mb-2">
            Market Sentiment
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-gray-700 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getGradientColor(value)} transition-all duration-1000 ease-out`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-red-400">0</span>
            <span className="text-emerald-400">100</span>
          </div>

          {extremeCondition && (
            <div className={`text-xs font-medium ${
              extremeCondition.condition === 'extreme_fear' ? 'text-red-400' : 'text-emerald-400'
            } animate-pulse`}>
              {extremeCondition.condition === 'extreme_fear' ? 'EXTREME FEAR' : 'EXTREME GREED'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FearGreedCard;