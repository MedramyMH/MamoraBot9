import React from 'react';

const Sidebar = ({ tradingPairs, selectedSymbol, onSymbolChange, isLoading }) => {
  return (
    <aside className="bg-white shadow-sm w-64 hidden md:block overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Trading Pairs</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <select 
                value={selectedSymbol} 
                onChange={(e) => onSymbolChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {tradingPairs.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1 mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Timeframes</h3>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium">1h</div>
                <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium">4h</div>
                <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium">Daily</div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Indicators</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Moving Averages
                </li>
                <li className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Bollinger Bands
                </li>
                <li className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Hourly Performance
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;