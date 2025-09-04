import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const SmartTradingSignals = ({ selectedSymbols, marketData, pocketOptionData, smartSignals, loading }) => {
  const getSignalColor = (signalType) => {
    switch (signalType) {
      case 'BUY':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SELL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HOLD':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSignalIcon = (signalType) => {
    switch (signalType) {
      case 'BUY':
        return '🟢';
      case 'SELL':
        return '🔴';
      case 'HOLD':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const adjustedConfidence = (() => {
    let conf = signal.confidence;
  
    // Penalize confidence for price divergence
    if (priceDiscrepancy > 2) {
      conf *= 0.85;
    }
  
    // Penalize if RSI disagreement between sources
    const rsiDiff = Math.abs((market.technicalIndicators.rsi || 0) - (pocket.indicators.rsi || 0));
    if (rsiDiff > 10) {
      conf *= 0.9;
    }
  
    return Math.min(1, conf);
  })();

  const expectedReward = signal.expectedReward || 1.5; // from AI model or default
  const expectedRisk = signal.expectedRisk || 1; 
  
  const tradeQuality = ((adjustedConfidence * expectedReward) / expectedRisk).toFixed(2);


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
              <Skeleton className="h-4 w-full bg-slate-700" />
              <Skeleton className="h-4 w-3/4 bg-slate-700" />
              <Skeleton className="h-4 w-1/2 bg-slate-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">🧠 Intelligent Trading Signals</h3>
        <p className="text-gray-400">
          AI-powered signals considering both market data and Pocket Option variations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedSymbols.map(symbol => {
          const market = marketData[symbol];
          const pocket = pocketOptionData[symbol];
          const signal = smartSignals[symbol];

          if (!market || !pocket || !signal) {
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
                    📈 {symbol}
                  </span>
                  <Badge className={getSignalColor(signal.action)}>
                    {getSignalIcon(signal.action)} {signal.action}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Signal Overview */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(market.currentPrice)}
                    </div>
                    <div className="text-xs text-gray-400">Market Price</div>
                    <div className={`text-sm ${market.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercentage(market.priceChange)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {formatPrice(pocket.price)}
                    </div>
                    <div className="text-xs text-gray-400">Pocket Option</div>
                    <div className={`text-sm ${priceDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPrice(priceDifference)} diff
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {(adjustedConfidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-400">Confidence</div>
                    <Progress 
                      value={adjustedConfidence * 100} 
                      className="mt-1 h-2"
                    />
                  </div>
                </div>

                {/* Signal Analysis */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">📊 Signal Analysis</h4>
                  
                  {/* Price Discrepancy Warning */}
                  {priceDiscrepancy > 2 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="text-yellow-400 text-sm">
                        ⚠️ High price discrepancy detected: {priceDiscrepancy.toFixed(2)}%
                      </div>
                      <div className="text-yellow-300 text-xs mt-1">
                        Signal confidence adjusted for source divergence
                      </div>
                    </div>
                  )}

                  {/* Technical Indicators Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <h5 className="text-gray-300 text-sm font-medium mb-2">Market Indicators</h5>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>RSI: {market.technicalIndicators.rsi?.toFixed(1) || 'N/A'}</div>
                        <div>MACD: {market.technicalIndicators.macd?.toFixed(4) || 'N/A'}</div>
                        <div>SMA(20): {formatPrice(market.technicalIndicators.sma20 || 0)}</div>
                        <div>Volume: {market.volume?.toLocaleString() || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3">
                      <h5 className="text-purple-300 text-sm font-medium mb-2">Pocket Option Indicators</h5>
                      <div className="text-xs text-purple-200 space-y-1">
                        <div>RSI: {pocket.indicators.rsi?.toFixed(1) || 'N/A'}</div>
                        <div>MACD: {pocket.indicators.macd?.toFixed(4) || 'N/A'}</div>
                        <div>SMA(20): {formatPrice(pocket.indicators.sma20 || 0)}</div>
                        <div>Variation: {((pocket.price / market.currentPrice - 1) * 100).toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Signal Reasoning */}
                  <div className="bg-slate-700/20 rounded-lg p-3">
                    <h5 className="text-gray-300 text-sm font-medium mb-2">🤖 AI Analysis</h5>
                    <div className="text-xs text-gray-400">
                      {signal.reasoning || `Smart signal generated based on ${signal.factorsConsidered || 'multiple'} technical factors with ${(adjustedConfidence * 100).toFixed(0)}% confidence considering both market and Pocket Option data sources.`}
                    </div>
                  </div>

                  {/* Action Recommendation */}
                  <div className={`rounded-lg p-3 border ${
                    signal.action === 'BUY' ? 'bg-green-500/10 border-green-500/20' :
                    signal.action === 'SELL' ? 'bg-red-500/10 border-red-500/20' :
                    'bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                    <div className={`font-semibold text-sm ${
                      signal.action === 'BUY' ? 'text-green-400' :
                      signal.action === 'SELL' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      💡 Recommendation: {signal.action}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {signal.action === 'BUY' && 'Technical indicators suggest potential upward movement'}
                      {signal.action === 'SELL' && 'Technical indicators suggest potential downward movement'}
                      {signal.action === 'HOLD' && 'Mixed signals or insufficient momentum detected'}
                    </div>
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

export default SmartTradingSignals;
