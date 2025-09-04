import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const PriceComparison = ({ selectedSymbols, marketData, pocketOptionData, loading }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedSymbols.map(symbol => (
          <Card key={symbol} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-6 w-20 bg-slate-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full bg-slate-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">💰 Price Comparison: Market vs Pocket Option</h3>
        <p className="text-gray-400">
          Real-time price comparison between market data and Pocket Option values
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedSymbols.map(symbol => {
          const market = marketData[symbol];
          const pocket = pocketOptionData[symbol];

          if (!market || !pocket) {
            return (
              <Card key={symbol} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">{symbol}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-red-400">❌ Unable to fetch data for {symbol}</div>
                </CardContent>
              </Card>
            );
          }

          const priceDifference = market.currentPrice - pocket.price;
          const priceDiscrepancy = Math.abs(priceDifference) / market.currentPrice * 100;

          return (
            <Card key={symbol} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    📊 {symbol}
                  </span>
                  <Badge className={`${
                    priceDiscrepancy > 2 ? 'bg-red-500/20 text-red-400' : 
                    priceDiscrepancy > 1 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {priceDiscrepancy.toFixed(2)}% diff
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Comparison Chart */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="text-center">
                      <div className="text-sm text-blue-300 mb-2">Market Price</div>
                      <div className="text-2xl font-bold text-white">
                        {formatPrice(market.currentPrice)}
                      </div>
                      <div className={`text-sm mt-1 ${market.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(market.priceChange)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="text-center">
                      <div className="text-sm text-purple-300 mb-2">Pocket Option</div>
                      <div className="text-2xl font-bold text-white">
                        {formatPrice(pocket.price)}
                      </div>
                      <div className={`text-sm mt-1 ${priceDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPrice(priceDifference)} diff
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Price Bar */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Price Visualization</h4>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Lower</span>
                      <span className="text-xs text-gray-400">Higher</span>
                    </div>
                    <div className="relative h-8 bg-slate-700 rounded-lg overflow-hidden">
                      {/* Market price bar */}
                      <div 
                        className="absolute top-0 left-0 h-4 bg-blue-500 rounded"
                        style={{ 
                          width: `${Math.min(market.currentPrice / Math.max(market.currentPrice, pocket.price) * 100, 100)}%` 
                        }}
                      />
                      {/* Pocket Option price bar */}
                      <div 
                        className="absolute bottom-0 left-0 h-4 bg-purple-500 rounded"
                        style={{ 
                          width: `${Math.min(pocket.price / Math.max(market.currentPrice, pocket.price) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-gray-400">Market</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span className="text-gray-400">Pocket Option</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discrepancy Analysis */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Discrepancy Analysis</h4>
                  <div className={`rounded-lg p-3 border ${
                    priceDiscrepancy > 2 ? 'bg-red-500/10 border-red-500/20' :
                    priceDiscrepancy > 1 ? 'bg-yellow-500/10 border-yellow-500/20' :
                    'bg-green-500/10 border-green-500/20'
                  }`}>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Price Difference</div>
                        <div className={`font-semibold ${priceDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPrice(Math.abs(priceDifference))}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Percentage Diff</div>
                        <div className={`font-semibold ${
                          priceDiscrepancy > 2 ? 'text-red-400' :
                          priceDiscrepancy > 1 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {priceDiscrepancy.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {priceDiscrepancy > 2 && '⚠️ High discrepancy - Exercise caution in trading decisions'}
                      {priceDiscrepancy <= 2 && priceDiscrepancy > 1 && '⚡ Moderate discrepancy - Monitor closely'}
                      {priceDiscrepancy <= 1 && '✅ Low discrepancy - Prices are well aligned'}
                    </div>
                  </div>
                </div>

                {/* Trading Implications */}
                <div className="bg-slate-700/20 rounded-lg p-3">
                  <h5 className="text-gray-300 text-sm font-medium mb-2">💡 Trading Implications</h5>
                  <div className="text-xs text-gray-400 space-y-1">
                    {market.currentPrice > pocket.price ? (
                      <div>• Market price is higher - Consider Pocket Option for potential value</div>
                    ) : (
                      <div>• Pocket Option price is higher - Market may offer better entry</div>
                    )}
                    <div>• Price discrepancy: {priceDiscrepancy.toFixed(2)}% affects signal confidence</div>
                    <div>• Volume: {market.volume?.toLocaleString() || 'N/A'} shares traded</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PriceComparison;