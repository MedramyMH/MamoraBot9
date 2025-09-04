import React from 'react';

const TechnicalIndicator = ({ title, type, levels, currentPrice }) => {
  const calculateDistance = (level) => {
    if (!level || !currentPrice) return { percentage: 0, isAbove: true };
    
    const distance = level - currentPrice;
    const percentage = Math.abs((distance / currentPrice) * 100).toFixed(2);
    const isAbove = distance > 0;
    
    return { percentage, isAbove };
  };
  
  const getClosestLevel = () => {
    if (!levels || Object.keys(levels).length === 0 || !currentPrice) {
      return { name: '', level: null, distance: null };
    }
    
    let closestName = '';
    let closestLevel = null;
    let minDistance = Infinity;
    
    Object.entries(levels).forEach(([name, level]) => {
      const distance = Math.abs(currentPrice - level);
      if (distance < minDistance) {
        minDistance = distance;
        closestLevel = level;
        closestName = name;
      }
    });
    
    return {
      name: closestName,
      level: closestLevel,
      distance: calculateDistance(closestLevel)
    };
  };
  
  const closest = getClosestLevel();
  
  // Determine if there's a tooltip to show
  const hasTooltip = closest.level !== null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h2 className="text-lg font-medium text-gray-700 mb-4">{title}</h2>
      
      {/* Closest level indicator */}
      {hasTooltip && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800 font-medium mb-1">
            Closest {type}: {closest.name}
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {typeof closest.level === 'number' ? closest.level.toFixed(2) : closest.level}
          </div>
          <div className="mt-1 flex items-center">
            <span className={`text-sm font-medium ${closest.distance.isAbove ? 'text-green-600' : 'text-red-600'}`}>
              {closest.distance.isAbove ? 'Above' : 'Below'} by {closest.distance.percentage}%
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d={closest.distance.isAbove
                  ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                }
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
      
      {/* All levels display */}
      <div className="space-y-3">
        {levels && Object.entries(levels).map(([name, level]) => {
          const distance = calculateDistance(level);
          return (
            <div key={name} className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 
                    ${name === closest.name ? 'bg-blue-500' : 'bg-gray-300'}`}
                ></div>
                <span className="text-sm font-medium text-gray-600">{name}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-800 mr-2">
                  {typeof level === 'number' ? level.toFixed(2) : level}
                </span>
                <span className={`text-xs ${distance.isAbove ? 'text-green-600' : 'text-red-600'}`}>
                  ({distance.isAbove ? '+' : '-'}{distance.percentage}%)
                </span>
              </div>
            </div>
          );
        })}
        
        {(!levels || Object.keys(levels).length === 0) && (
          <div className="text-gray-500 text-center py-4">Loading data...</div>
        )}
      </div>
    </div>
  );
};

export default TechnicalIndicator;