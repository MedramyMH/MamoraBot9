import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const TechnicalIndicators = ({ selectedSymbols, marketData, pocketOptionData, loading }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getIndicatorStatus = (value, type) => {
    switch (type) {
      case 'rsi':
        if (value > 70) return { status: 'Overbought', color: 'text-red-400' };
        if (value < 30) return { status: 'Oversold', color: 'text-green-400' };
        return { status: 'Neutral', color: 'text-gray-400' };
      case 'macd':
        return value > 0 
          ? { status: 'Bullish', color: 'text-green-400' }
          : { status: 'Bearish', color: 'text-red-400' };
      default:
        return { status: 'N/A', color: 'text-gray-400' };
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
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
        <h3 className="text-2xl font-bold text-white mb-2">📈 Technical Indicators Comparison</h3>
        <p className="text-gray-400">
          Side-by-side comparison of technical indicators between market data and Pocket Option
        </p>
      </div>

      <div className="space-y-6">
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

          const marketIndicators = market.technicalIndicators;
          const pocketIndicators = pocket.indicators;

          return (
            <Card key={symbol} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    📊 {symbol} - Technical Analysis
                  </span>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {formatPrice(market.currentPrice)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* RSI Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      📈 Market Indicators
                    </h4>
                    
                    {/* Market RSI */}
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">RSI (14)</span>
                        <span className={`text-sm font-semibold ${getIndicatorStatus(marketIndicators.rsi, 'rsi').color}`}>
                          {getIndicatorStatus(marketIndicators.rsi, 'rsi').status}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-2">
                        {marketIndicators.rsi?.toFixed(1) || 'N/A'}
                      </div>
                      <Progress 
                        value={marketIndicators.rsi || 0} 
                        className="h-2"
                        max={100}
                      />
                    </div>

                    {/* Market MACD */}
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">MACD</span>
                        <span className={`text-sm font-semibold ${getIndicatorStatus(marketIndicators.macd, 'macd').color}`}>
                          {getIndicatorStatus(marketIndicators.macd, 'macd').status}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {marketIndicators.macd?.toFixed(4) || 'N/A'}
                      </div>
                    </div>

                    {/* Market Moving Averages */}
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <h5 className="text-sm text-gray-300 mb-3">Moving Averages</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">SMA(20)</span>
                          <span className="text-white font-semibold">
                            {formatPrice(marketIndicators.sma20 || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">SMA(50)</span>
                          <span className="text-white font-semibold">
                            {formatPrice(marketIndicators.sma50 || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">EMA(12)</span>
                          <span className="text-white font-semibold">
                            {formatPrice(marketIndicators.ema12 || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      🎯 Pocket Option Indicators
                    </h4>
                    
                    {/* Pocket Option RSI */}
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-purple-300">RSI (14)</span>
                        <span className={`text-sm font-semibold ${getIndicatorStatus(pocketIndicators.rsi, 'rsi').color}`}>
                          {getIndicatorStatus(pocketIndicators.rsi, 'rsi').status}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-2">
                        {pocketIndicators.rsi?.toFixed(1) || 'N/A'}
                      </div>
                      <Progress 
                        value={pocketIndicators.rsi || 0} 
                        className="h-2"
                        max={100}
                      />
                    </div>

                    {/* Pocket Option MACD */}
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-purple-300">MACD</span>
                        <span className={`text-sm font-semibold ${getIndicatorStatus(pocketIndicators.macd, 'macd').color}`}>
                          {getIndicatorStatus(pocketIndicators.macd, 'macd').status}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {pocketIndicators.macd?.toFixed(4) || 'N/A'}
                      </div>
                    </div>

                    {/* Pocket Option Moving Averages */}
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <h5 className="text-sm text-purple-300 mb-3">Moving Averages</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-200">SMA(20)</span>
                          <span className="text-white font-semibold">
                            {formatPrice(pocketIndicators.sma20 || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">SMA(50)</span>
                          <span className="text-white font-semibold">
                            {formatPrice(pocketIndicators.sma50 || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">EMA(12)</span>
                          <span className="text-white font-semibold">
                            {formatPrice(pocketIndicators.ema12 || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-slate-700/20 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">📊 Indicator Comparison Table</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left text-gray-300 py-2">Indicator</th>
                          <th className="text-center text-blue-300 py-2">Market Value</th>
                          <th className="text-center text-purple-300 py-2">Pocket Option</th>
                          <th className="text-center text-gray-300 py-2">Difference</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 text-gray-300">RSI</td>
                          <td className="text-center text-white font-semibold">
                            {marketIndicators.rsi?.toFixed(1) || 'N/A'}
                          </td>
                          <td className="text-center text-white font-semibold">
                            {pocketIndicators.rsi?.toFixed(1) || 'N/A'}
                          </td>
                          <td className="text-center text-gray-400">
                            {marketIndicators.rsi && pocketIndicators.rsi 
                              ? `${(pocketIndicators.rsi - marketIndicators.rsi).toFixed(1)}`
                              : 'N/A'
                            }
                          </td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 text-gray-300">MACD</td>
                          <td className="text-center text-white font-semibold">
                            {marketIndicators.macd?.toFixed(4) || 'N/A'}
                          </td>
                          <td className="text-center text-white font-semibold">
                            {pocketIndicators.macd?.toFixed(4) || 'N/A'}
                          </td>
                          <td className="text-center text-gray-400">
                            {marketIndicators.macd && pocketIndicators.macd 
                              ? `${(pocketIndicators.macd - marketIndicators.macd).toFixed(4)}`
                              : 'N/A'
                            }
                          </td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 text-gray-300">SMA(20)</td>
                          <td className="text-center text-white font-semibold">
                            {formatPrice(marketIndicators.sma20 || 0)}
                          </td>
                          <td className="text-center text-white font-semibold">
                            {formatPrice(pocketIndicators.sma20 || 0)}
                          </td>
                          <td className="text-center text-gray-400">
                            {marketIndicators.sma20 && pocketIndicators.sma20 
                              ? formatPrice(pocketIndicators.sma20 - marketIndicators.sma20)
                              : 'N/A'
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="bg-slate-700/20 rounded-lg p-4">
                  <h5 className="text-gray-300 text-sm font-medium mb-2">🔍 Analysis Summary</h5>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>• RSI indicates {getIndicatorStatus(marketIndicators.rsi, 'rsi').status.toLowerCase()} conditions in market data</div>
                    <div>• MACD shows {getIndicatorStatus(marketIndicators.macd, 'macd').status.toLowerCase()} momentum</div>
                    <div>• Price vs SMA(20): {market.currentPrice > (marketIndicators.sma20 || 0) ? 'Above' : 'Below'} moving average</div>
                    <div>• Pocket Option indicators show {Math.abs(((pocketIndicators.rsi || 0) - (marketIndicators.rsi || 0))).toFixed(1)} point RSI variation</div>
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

export default TechnicalIndicators;