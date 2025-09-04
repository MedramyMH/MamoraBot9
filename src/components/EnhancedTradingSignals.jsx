import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AdvancedTradingAI } from '../utils/advancedTradingAI';

const EnhancedTradingSignals = ({ selectedSymbols, marketData, pocketOptionData, loading }) => {
  const [tradingAI] = useState(() => new AdvancedTradingAI());
  const [recommendations, setRecommendations] = useState({});
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    if (!loading && selectedSymbols.length > 0) {
      generateRecommendations();
    }
  }, [selectedSymbols, marketData, pocketOptionData, loading]);

  const generateRecommendations = () => {
    const newRecommendations = {};
    
    selectedSymbols.forEach(symbol => {
      const market = marketData[symbol];
      const pocket = pocketOptionData[symbol];
      
      if (market && pocket) {
        const recommendation = tradingAI.generateTradeRecommendation(symbol, market, pocket);
        newRecommendations[symbol] = recommendation;
      }
    });
    
    setRecommendations(newRecommendations);
  };

  const executeTradeSimulation = (symbol, recommendation) => {
    // Simulate trade execution
    const trade = {
      id: `sim_${Date.now()}`,
      symbol,
      action: recommendation.action,
      entryPrice: recommendation.entryPrice,
      timestamp: Date.now(),
      status: 'active',
      recommendation
    };
    
    setTradeHistory(prev => [trade, ...prev.slice(0, 9)]); // Keep last 10 trades
    
    // Simulate trade outcome after some time (for demo purposes)
    setTimeout(() => {
      const outcome = simulateTradeOutcome(trade);
      tradingAI.learnFromTrade(trade.id, outcome);
      
      setTradeHistory(prev => 
        prev.map(t => t.id === trade.id ? { ...t, outcome, status: 'completed' } : t)
      );
    }, 5000); // 5 seconds for demo
  };

  const simulateTradeOutcome = (trade) => {
    // Simple simulation - in reality this would be based on actual market movement
    const success = Math.random() > 0.4; // 60% success rate for demo
    const profitRange = success ? [0.5, 3.0] : [-2.0, -0.5];
    const profit = profitRange[0] + Math.random() * (profitRange[1] - profitRange[0]);
    
    return {
      profit: Math.round(profit * 100) / 100,
      holdTime: Math.round(1 + Math.random() * 6), // 1-7 hours
      success
    };
  };
  const signalStrength = 
  (marketIndicators.rsiSignal + marketIndicators.macdSignal + marketIndicators.trendScore) / 3;

  const getActionColor = (action) => {
    switch (action) {
      case 'BUY': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SELL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'BUY': return '📈';
      case 'SELL': return '📉';
      default: return '⏸️';
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">🧠 Advanced AI Trading Recommendations</h3>
        <p className="text-gray-400">
          Self-learning AI that improves recommendations based on trade outcomes
        </p>
      </div>

      {/* Trade History Summary */}
      {tradeHistory.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white">📊 Recent Trade Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{tradeHistory.length}</div>
                <div className="text-gray-400">Total Trades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {tradeHistory.filter(t => t.outcome?.success).length}
                </div>
                <div className="text-gray-400">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {tradeHistory.filter(t => t.outcome).length > 0 
                    ? Math.round((tradeHistory.filter(t => t.outcome?.success).length / tradeHistory.filter(t => t.outcome).length) * 100)
                    : 0}%
                </div>
                <div className="text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {tradeHistory.filter(t => t.status === 'active').length}
                </div>
                <div className="text-gray-400">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedSymbols.map(symbol => {
          const recommendation = recommendations[symbol];
          
          if (!recommendation) {
            return (
              <Card key={symbol} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">{symbol}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-red-400">❌ Unable to generate recommendation</div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={symbol} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getActionIcon(recommendation.action)} {symbol}
                  </span>
                  <Badge className={getActionColor(recommendation.action)}>
                    {recommendation.action}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {recommendation.confidence}%
                    </div>
                    <div className="text-xs text-gray-400">AI Confidence</div>
                    <Progress value={recommendation.confidence} className="mt-1 h-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {recommendation.successProbability}%
                    </div>
                    <div className="text-xs text-gray-400">Success Probability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {recommendation.riskRewardRatio}:1
                    </div>
                    <div className="text-xs text-gray-400">Risk:Reward</div>
                  </div>
                </div>

                {/* Trade Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <h5 className="text-gray-300 text-sm font-medium mb-2">📍 Entry Details</h5>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>Price: {formatPrice(recommendation.entryPrice)}</div>
                        <div>Best Time: {recommendation.bestEntryTime}</div>
                        <div>Window: {recommendation.entryWindow}</div>
                        <div>Position: {recommendation.positionSize}% (${recommendation.positionAmount})</div>
                      </div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <h5 className="text-gray-300 text-sm font-medium mb-2">🎯 Risk Management</h5>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>Stop Loss: {formatPrice(recommendation.stopLoss)}</div>
                        <div>Take Profit: {formatPrice(recommendation.takeProfit)}</div>
                        <div>Hold Time: {recommendation.estimatedHoldTime}</div>
                        <div>Risk Level: {recommendation.riskLevel}</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                    <h5 className="text-blue-300 text-sm font-medium mb-2">🤖 AI Analysis</h5>
                    <div className="text-xs text-blue-200 space-y-1">
                      <div>Signal Strength: {recommendation.signalStrength}%</div>
                      <div>Pattern Match: {recommendation.patternMatch}%</div>
                      <div>Exit Strategy: {recommendation.exitStrategy}</div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="bg-slate-700/20 rounded-lg p-3">
                    <h5 className="text-gray-300 text-sm font-medium mb-2">💭 AI Reasoning</h5>
                    <div className="text-xs text-gray-400">
                      {recommendation.reasoning}
                    </div>
                  </div>

                  {/* Action Button */}
                  {recommendation.action !== 'HOLD' && (
                    <Button
                      onClick={() => executeTradeSimulation(symbol, recommendation)}
                      className={`w-full ${
                        recommendation.action === 'BUY' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      🚀 Execute {recommendation.action} Trade (Simulation)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Trades */}
      {tradeHistory.filter(t => t.status === 'active').length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">⚡ Active Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tradeHistory.filter(t => t.status === 'active').map(trade => (
                <div key={trade.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getActionColor(trade.action)}>
                      {getActionIcon(trade.action)} {trade.action}
                    </Badge>
                    <span className="text-white font-medium">{trade.symbol}</span>
                    <span className="text-gray-400">{formatPrice(trade.entryPrice)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {Math.round((Date.now() - trade.timestamp) / 60000)}m ago
                    </div>
                    <div className="text-xs text-blue-400">Processing...</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Trades */}
      {tradeHistory.filter(t => t.status === 'completed').length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">📋 Recent Completed Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tradeHistory.filter(t => t.status === 'completed').slice(0, 5).map(trade => (
                <div key={trade.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getActionColor(trade.action)}>
                      {getActionIcon(trade.action)} {trade.action}
                    </Badge>
                    <span className="text-white font-medium">{trade.symbol}</span>
                    <span className="text-gray-400">{formatPrice(trade.entryPrice)}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      trade.outcome?.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.outcome?.success ? '✅' : '❌'} {trade.outcome?.profit > 0 ? '+' : ''}{trade.outcome?.profit}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {trade.outcome?.holdTime}h hold
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedTradingSignals;
