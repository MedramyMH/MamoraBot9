import React from 'react';

/**
 * Reusable Alert Icon Component
 * Shows warning/info icons for various alert conditions
 */
const AlertIcon = ({ 
  type = 'warning', 
  size = 'sm', 
  animate = true, 
  tooltip = '',
  severity = 'medium',
  onClick = null 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const severityClasses = {
    low: 'text-yellow-400',
    medium: 'text-orange-400', 
    high: 'text-red-400'
  };

  const iconClass = `${sizeClasses[size]} ${severityClasses[severity]} ${animate ? 'animate-pulse' : ''} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`;

  const renderIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20" onClick={onClick}>
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'cross':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20" onClick={onClick}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'alert':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20" onClick={onClick}>
            <path d="M10 2L3 7v11c0 .55.45 1 1 1h3v-8h6v8h3c.55 0 1-.45 1-1V7l-7-5zM8.5 12.5c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5z"/>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20" onClick={onClick}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="relative group">
      {renderIcon()}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default AlertIcon;