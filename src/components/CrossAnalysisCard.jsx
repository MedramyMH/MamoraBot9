import React from 'react';
import AlertIcon from './AlertIcon';

/**
 * Cross Analysis Card Component - displays MA cross data with alerts
 * Shows golden/death crosses with alert icons for recent events
 */
const CrossAnalysisCard = ({ crossData, timeframe, symbol }) => {
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

  const getDaysAgo = (timestamp) => {
    const now = Date.now();
    return Math.round((now - timestamp) / (1000 * 60 * 60 * 24));
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

  if (!crossData) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-4">Cross Analysis - {timeframe.toUpperCase()}</h4>
        <div className="text-gray-400 text-sm">No cross data available</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-300">Cross Analysis - {timeframe.toUpperCase()}</h4>
        {/* Alert icon if any recent crosses (7 days) or upcoming crosses (14 days) */}
        {((crossData.lastGoldenCross && isWithin7Days(crossData.lastGoldenCross.time)) ||
          (crossData.lastDeathCross && isWithin7Days(crossData.lastDeathCross.time)) ||
          (crossData.nextCrossEstimate && isWithin14Days(crossData.nextCrossEstimate.daysUntil))) && (
          <AlertIcon 
            type="cross" 
            severity="high" 
            tooltip="Recent or upcoming MA cross detected"
          />
        )}
      </div>
      
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
  );
};

export default CrossAnalysisCard;