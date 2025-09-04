import React from 'react';
import SearchableSelect from './SearchableSelect';

/**
 * Navigation Bar Component
 * Contains app branding, symbol selector, and live data indicator
 */
const NavigationBar = ({ 
  tradingPairs, 
  selectedSymbol, 
  onSymbolChange, 
  isLoading 
}) => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Binance Crypto Dashboard</h1>
                <div className="text-xs text-gray-400">Real-time Technical Analysis</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {tradingPairs.length > 0 ? (
              <SearchableSelect
                options={tradingPairs}
                value={selectedSymbol}
                onChange={(e) => onSymbolChange(e.target.value)}
                placeholder="Search trading pairs..."
              />
            ) : (
              <div className="text-gray-400 animate-pulse">
                {isLoading ? 'Loading pairs...' : 'No pairs available'}
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;