import React from 'react';

const HourlyPerformance = ({ hourlyData, currentHourData }) => {
  // Format percentage to always display 2 decimal places
  const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0.00';
    return value.toFixed(2);
  };

  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <span>Hourly Performance</span>
        </h3>
        
        <div className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="text-gray-400">Loading hourly data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
        <span>Hourly Performance</span>
      </h3>
      
      {/* Current hour progress */}
      {currentHourData && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-lg border border-purple-500/30">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-200">
                Current Hour ({currentHourData.formattedHour})
              </span>
            </div>
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold ${
              parseFloat(currentHourData.percentChange) >= 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d={parseFloat(currentHourData.percentChange) >= 0
                  ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                } clipRule="evenodd" />
              </svg>
              <span>
                {parseFloat(currentHourData.percentChange) >= 0 ? '+' : ''}{formatPercentage(currentHourData.percentChange)}%
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="relative">
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  parseFloat(currentHourData.percentChange) >= 0 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, (currentHourData.minutesIntoHour / 60) * 100))}%` }}
              ></div>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <span className="text-xs text-gray-300 font-medium">
                {currentHourData.minutesIntoHour}min
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Previous hours */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Previous Hours</h4>
        
        {hourlyData.map((hourData, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-gray-300">
                  {hourData.formattedHour ? hourData.formattedHour.split(':')[0] : hourData.hour}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-200">
                {hourData.formattedHour || `${hourData.hour}:00`}
              </span>
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
              parseFloat(hourData.percentChange) >= 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d={parseFloat(hourData.percentChange) >= 0
                  ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                } clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm">
                {parseFloat(hourData.percentChange) >= 0 ? '+' : ''}{formatPercentage(hourData.percentChange)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyPerformance;