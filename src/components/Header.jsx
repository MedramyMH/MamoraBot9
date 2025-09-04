import React from 'react';

const Header = ({ symbol }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center">
          <div className="text-xl font-bold text-indigo-600">Binance Crypto Dashboard</div>
          {symbol && (
            <div className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md">
              {symbol}
            </div>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span>Live data via Binance WebSocket API</span>
        </div>
      </div>
    </header>
  );
};

export default Header;