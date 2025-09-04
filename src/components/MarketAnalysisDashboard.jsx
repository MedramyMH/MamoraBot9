import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, TrendingDown, AlertCircle, Eye, Zap, Target } from 'lucide-react';

const MarketAnalysisDashboard = ({ 
  marketAnalysis, 
  historicalAnalysis = [], 
  onPatternClick 
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [activeTab, setActiveTab] = useState('patterns');

  if (!marketAnalysis) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
            <p>Loading market analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  const getPatternIcon = (type) => {
    switch (type) {
      case 'bullish_breakout': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'bearish_breakdown': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'volume_spike': return <Zap className="w-4 h-4 text-blue-400" />;
      default: return <Target className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getPatternColor = (type) => {
    switch (type) {
      case 'bullish_breakout': return 'border-green-500/50 bg-green-500/10';
      case 'bearish_breakdown': return 'border-red-500/50 bg-red-500/10';
      case 'volume_spike': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-yellow-500/50 bg-yellow-500/10';
    }
  };

  const getVolatilityColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const formatPatternName = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Prepare chart data for historical analysis
  const chartData = historicalAnalysis.slice(-20).map((analysis, index) => ({
    time: new Date(analysis.timestamp).toLocaleTimeString(),
    sentiment: analysis.marketSentiment?.score || 0.5,
    patterns: analysis.patterns?.length || 0,
    opportunities: analysis.opportunities?.length || 0
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-400" />
          Real-Time Market Analysis
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Live</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {['patterns', 'volatility', 'opportunities', 'trends'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Market Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Market Sentiment</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className={`text-lg font-bold ${
            marketAnalysis.marketSentiment?.sentiment === 'bullish' ? 'text-green-400' :
            marketAnalysis.marketSentiment?.sentiment === 'bearish' ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {marketAnalysis.marketSentiment?.sentiment?.toUpperCase() || 'NEUTRAL'}
          </div>
          <div className="text-sm text-gray-400">
            Score: {((marketAnalysis.marketSentiment?.score || 0.5) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Active Patterns</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-400">
            {marketAnalysis.patterns?.length || 0}
          </div>
          <div className="text-sm text-gray-400">
            Detected Signals
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Opportunities</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-lg font-bold text-yellow-400">
            {marketAnalysis.opportunities?.length || 0}
          </div>
          <div className="text-sm text-gray-400">
            Trading Opportunities
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        {activeTab === 'patterns' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Detected Patterns</h4>
            {marketAnalysis.patterns && marketAnalysis.patterns.length > 0 ? (
              <div className="grid gap-3">
                {marketAnalysis.patterns.map((pattern, index) => (
                  <div
                    key={index}
                    onClick={() => onPatternClick && onPatternClick(pattern)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${getPatternColor(pattern.type)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getPatternIcon(pattern.type)}
                        <span className="font-medium text-white">
                          {formatPatternName(pattern.type)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {pattern.symbol}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Strength: {(pattern.strength * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        Confidence: {(pattern.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No patterns detected at the moment</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'volatility' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Market Volatility</h4>
            {marketAnalysis.volatility && Object.keys(marketAnalysis.volatility).length > 0 ? (
              <div className="grid gap-3">
                {Object.entries(marketAnalysis.volatility).map(([symbol, volData]) => (
                  <div key={symbol} className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{symbol}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getVolatilityColor(volData.level)}`}>
                        {volData.level.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Value: {(volData.value * 100).toFixed(2)}%
                      </span>
                      <span className="text-gray-400">
                        Trend: {volData.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No volatility data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Trading Opportunities</h4>
            {marketAnalysis.opportunities && marketAnalysis.opportunities.length > 0 ? (
              <div className="grid gap-3">
                {marketAnalysis.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium text-white">
                          {formatPatternName(opportunity.type)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">{opportunity.symbol}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Potential: </span>
                        <span className="text-green-400 font-medium">
                          {(opportunity.potential * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Risk: </span>
                        <span className={`font-medium ${
                          opportunity.risk === 'high' ? 'text-red-400' :
                          opportunity.risk === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {opportunity.risk.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Timeframe: </span>
                        <span className="text-blue-400 font-medium">
                          {opportunity.timeframe}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Confidence: </span>
                        <span className="text-purple-400 font-medium">
                          {(opportunity.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No trading opportunities found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Market Trends</h4>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-400 mb-2">Sentiment Trend</h5>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#9CA3AF" 
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        domain={[0, 1]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sentiment" 
                        stroke="#60A5FA" 
                        strokeWidth={2}
                        dot={{ fill: '#60A5FA', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-400 mb-2">Pattern Detection</h5>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#9CA3AF" 
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="patterns" fill="#A78BFA" />
                      <Bar dataKey="opportunities" fill="#FBBF24" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Collecting trend data...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketAnalysisDashboard;