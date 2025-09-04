import React, { useState, useEffect } from 'react';

const AlertNotifications = ({ alerts = [] }) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    // Filter out dismissed alerts and show new ones
    const newAlerts = alerts.filter(alert => 
      !dismissedAlerts.has(`${alert.symbol}-${alert.type}-${alert.timeframe || 'global'}-${alert.message}`)
    );
    setVisibleAlerts(newAlerts);
  }, [alerts, dismissedAlerts]);

  const dismissAlert = (alert) => {
    const alertKey = `${alert.symbol}-${alert.type}-${alert.timeframe || 'global'}-${alert.message}`;
    setDismissedAlerts(prev => new Set([...prev, alertKey]));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 border-red-500/40 text-red-300';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300';
      case 'low':
        return 'bg-blue-500/20 border-blue-500/40 text-blue-300';
      default:
        return 'bg-gray-500/20 border-gray-500/40 text-gray-300';
    }
  };

  const getAlertIcon = (alert) => {
    switch (alert.type) {
      case 'cross':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
      case 'stochRSI':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'macd':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
        );
      case 'fearGreed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {visibleAlerts.slice(0, 5).map((alert, index) => (
        <div
          key={`${alert.symbol}-${alert.type}-${alert.timeframe || 'global'}-${index}`}
          className={`p-4 rounded-lg border backdrop-blur-sm shadow-lg animate-slideIn ${getSeverityColor(alert.severity)}`}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">
                  {alert.symbol}
                </div>
                <div className="text-xs mt-1 opacity-90">
                  {alert.message}
                </div>
                {alert.daysAgo !== undefined && (
                  <div className="text-xs mt-1 opacity-70">
                    {alert.daysAgo === 0 ? 'Today' : `${alert.daysAgo} days ago`}
                  </div>
                )}
                {alert.daysUntil !== undefined && (
                  <div className="text-xs mt-1 opacity-70">
                    In {Math.round(alert.daysUntil)} days
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => dismissAlert(alert)}
              className="flex-shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      {visibleAlerts.length > 5 && (
        <div className="p-2 text-center text-xs text-gray-400 bg-gray-800/50 rounded-lg backdrop-blur-sm">
          +{visibleAlerts.length - 5} more alerts
        </div>
      )}
    </div>
  );
};

export default AlertNotifications;