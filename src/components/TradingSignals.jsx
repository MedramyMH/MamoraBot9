import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Pause, Target, AlertTriangle, Brain, Zap } from 'lucide-react';

const TradingSignals = ({ 
  decision, 
  confidence, 
  marketAnalysis, 
  mlPrediction, 
  onExecuteTrade 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (decision) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [decision]);

  if (!decision) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2 animate-pulse" />
            <p>Analyzing market conditions...</p>
          </div>
        </div>
      </div>
    );
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'BUY': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'SELL': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="w-6 h-6" />;
      case 'SELL': return <TrendingDown className="w-6 h-6" />;
      default: return <Pause className="w-6 h-6" />;
    }
  };

  const getConfidenceLevel = (conf) => {
    if (conf >= 80) return { level: 'Very High', color: 'text-green-400' };
    if (conf >= 70) return { level: 'High', color: 'text-blue-400' };
    if (conf >= 60) return { level: 'Medium', color: 'text-yellow-400' };
    if (conf >= 50) return { level: 'Low', color: 'text-orange-400' };
    return { level: 'Very Low', color: 'text-red-400' };
  };

  const confidenceInfo = getConfidenceLevel(confidence);

  return (
    <div className="space-y-6">
      {/* Main Trading Signal */}
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 ${
        isAnimating ? 'animate-pulse' : ''
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Smart Trading Signal
          </h3>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">AI Powered</span>
          </div>
        </div>

        {/* Action Display */}
        <div className="flex items-center justify-center mb-6">
          <div className={`flex items-center gap-4 px-8 py-4 rounded-xl border-2 ${getActionColor(decision.action)}`}>
            {getActionIcon(decision.action)}
            <div className="text-center">
              <div className="text-2xl font-bold">{decision.action}</div>
              <div className="text-sm opacity-75">{decision.symbol}</div>
            </div>
          </div>
        </div>

        {/* Confidence and Risk */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">Confidence</div>
            <div className={`text-lg font-bold ${confidenceInfo.color}`}>
              {confidence}% ({confidenceInfo.level})
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">Risk Score</div>
            <div className="text-lg font-bold text-orange-400">
              {decision.riskScore}%
            </div>
          </div>
        </div>

        {/* Position Details */}
        {decision.action !== 'WAIT' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Position Size</div>
              <div className="text-lg font-bold text-white">
                ${decision.positionSize.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                ({decision.positionPercentage}% of portfolio)
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Risk/Reward</div>
              <div className="text-lg font-bold text-blue-400">
                1:{decision.riskRewardRatio}
              </div>
            </div>
          </div>
        )}

        {/* Timing Information */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Entry Strategy</span>
          </div>
          <div className="text-sm text-gray-300 mb-2">
            {decision.entryTiming.strategy}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Urgency: {decision.entryTiming.urgency}</span>
            <span>Window: {decision.entryTiming.timeWindow}</span>
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-gray-300 mb-2">AI Reasoning:</div>
          <div className="text-sm text-gray-400 leading-relaxed">
            {decision.reasoning}
          </div>
        </div>

        {/* ML Prediction Integration */}
        {mlPrediction && (
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Machine Learning Analysis</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-center">
                <div className="text-xs text-gray-400">Buy Probability</div>
                <div className="text-sm font-bold text-green-400">
                  {(mlPrediction.probabilities.buy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Sell Probability</div>
                <div className="text-sm font-bold text-red-400">
                  {(mlPrediction.probabilities.sell * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Wait Probability</div>
                <div className="text-sm font-bold text-yellow-400">
                  {(mlPrediction.probabilities.wait * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {mlPrediction.reasoning}
            </div>
          </div>
        )}

        {/* Execute Trade Button */}
        {decision.action !== 'WAIT' && onExecuteTrade && (
          <button
            onClick={() => onExecuteTrade(decision)}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              decision.action === 'BUY'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Execute {decision.action} Order
          </button>
        )}
      </div>

      {/* Market Conditions Summary */}
      {marketAnalysis && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Market Conditions
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Sentiment</div>
              <div className={`text-sm font-bold ${
                marketAnalysis.marketSentiment?.sentiment === 'bullish' ? 'text-green-400' :
                marketAnalysis.marketSentiment?.sentiment === 'bearish' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {marketAnalysis.marketSentiment?.sentiment?.toUpperCase() || 'NEUTRAL'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Volatility</div>
              <div className="text-sm font-bold text-orange-400">
                {marketAnalysis.volatility ? 'HIGH' : 'NORMAL'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Patterns</div>
              <div className="text-sm font-bold text-blue-400">
                {marketAnalysis.patterns?.length || 0} Detected
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Opportunities</div>
              <div className="text-sm font-bold text-purple-400">
                {marketAnalysis.opportunities?.length || 0} Found
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingSignals;