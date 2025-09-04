import React, { useState, useEffect } from 'react';
import AlertIcon from './AlertIcon';

/**
 * Change Notifications Component
 * Shows notifications when timeframe or trading pair changes
 * Also displays active alert conditions
 */
const ChangeNotifications = ({ 
  selectedSymbol, 
  alerts = [], 
  onDismiss = null 
}) => {
  const [notifications, setNotifications] = useState([]);
  const [previousSymbol, setPreviousSymbol] = useState(selectedSymbol);

  // Add notification when symbol changes
  useEffect(() => {
    if (previousSymbol && selectedSymbol && previousSymbol !== selectedSymbol) {
      const newNotification = {
        id: Date.now(),
        type: 'symbol_change',
        message: `Trading pair changed to ${selectedSymbol}`,
        timestamp: Date.now(),
        severity: 'info'
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only 5 notifications
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }
    setPreviousSymbol(selectedSymbol);
  }, [selectedSymbol, previousSymbol]);

  // Add notifications for new alerts
  useEffect(() => {
    if (alerts.length > 0) {
      // Get the latest alert to show as notification
      const latestAlert = alerts[alerts.length - 1];
      
      const alertNotification = {
        id: `alert_${Date.now()}`,
        type: 'alert',
        message: latestAlert.message,
        timestamp: Date.now(),
        severity: latestAlert.severity,
        alertType: latestAlert.type
      };
      
      setNotifications(prev => {
        // Check if we already have this alert notification
        const exists = prev.some(n => n.message === alertNotification.message);
        if (exists) return prev;
        
        return [alertNotification, ...prev.slice(0, 4)];
      });
    }
  }, [alerts]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (onDismiss) onDismiss(id);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'symbol_change': return 'alert';
      case 'cross': return 'cross';
      case 'stochRSI': 
      case 'macd': 
      case 'fearGreed': return 'warning';
      default: return 'alert';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            p-3 rounded-lg border backdrop-blur-sm animate-slide-in-right
            ${getSeverityColor(notification.severity)}
          `}
        >
          <div className="flex items-start justify-between space-x-3">
            <div className="flex items-start space-x-2 flex-1">
              <AlertIcon 
                type={getTypeIcon(notification.type)} 
                severity={notification.severity}
                size="sm"
                animate={notification.type === 'alert'}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white break-words">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChangeNotifications;