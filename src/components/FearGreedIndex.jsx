import React, { useState, useEffect } from 'react';

const FearGreedIndex = ({ height = 200 }) => {
  const [fearGreedData, setFearGreedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        // Using alternative.me API for Fear & Greed Index
        const response = await fetch('https://api.alternative.me/fng/?limit=1');
        const data = await response.json();
        
        if (data && data.data && data.data[0]) {
          setFearGreedData(data.data[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Fear & Greed Index:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchFearGreedIndex();
    
    // Update every 30 minutes
    const interval = setInterval(fetchFearGreedIndex, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Fear & Greed Index</h4>
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fearGreedData) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Fear & Greed Index</h4>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400 text-sm">Unable to load Fear & Greed Index</div>
        </div>
      </div>
    );
  }

  const value = parseInt(fearGreedData.value);
  const timestamp = new Date(parseInt(fearGreedData.timestamp) * 1000);

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-white">Fear & Greed Index</h4>
        <span className="text-xs text-gray-400">
          Updated: {timestamp.toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {/* Circular Progress */}
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#374151"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#fearGreedGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(value / 100) * 251.33} 251.33`}
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
              <span className={`text-2xl font-bold ${getIndexColor(value)}`}>
                {value}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 pl-4">
          <div className="space-y-2">
            <div className={`text-lg font-semibold ${getIndexColor(value)}`}>
              {getIndexLabel(value)}
            </div>
            <div className="text-xs text-gray-400">
              Market Sentiment
            </div>
            
            {/* Scale indicators */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-red-400">0 - Extreme Fear</span>
                <span className="text-emerald-400">100 - Extreme Greed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getGradientColor(value)} transition-all duration-1000 ease-out`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 text-xs text-center">
        <div className="text-red-400">
          <div className="font-medium">0-25</div>
          <div>Extreme Fear</div>
        </div>
        <div className="text-orange-400">
          <div className="font-medium">25-45</div>
          <div>Fear</div>
        </div>
        <div className="text-yellow-400">
          <div className="font-medium">45-55</div>
          <div>Neutral</div>
        </div>
        <div className="text-green-400">
          <div className="font-medium">55-75</div>
          <div>Greed</div>
        </div>
        <div className="text-emerald-400">
          <div className="font-medium">75-100</div>
          <div>Extreme Greed</div>
        </div>
      </div>
    </div>
  );
};

export default FearGreedIndex;