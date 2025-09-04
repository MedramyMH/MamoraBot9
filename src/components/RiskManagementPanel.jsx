import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Settings, Target, DollarSign, Percent } from 'lucide-react';

const RiskManagementPanel = ({ 
  riskProfile = 'balanced',
  portfolioValue = 10000,
  currentPositions = [],
  onRiskProfileChange,
  onPortfolioValueChange,
  performanceMetrics = {}
}) => {
  const [selectedProfile, setSelectedProfile] = useState(riskProfile);
  const [customSettings, setCustomSettings] = useState({
    maxRisk: 0.05,
    minConfidence: 0.7,
    positionSize: 0.2,
    stopLoss: 0.05,
    takeProfit: 0.1
  });
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  
  const calcPositionSize = (accountRisk, stopLossPct) => {
    return (portfolioValue * accountRisk) / stopLossPct;
  };

  const riskProfiles = {
    conservative: {
      name: 'Conservative',
      description: 'Low risk, steady growth',
      maxRisk: 0.02,
      minConfidence: 0.8,
      positionSize: 0.1,
      stopLoss: 0.03,
      takeProfit: 0.06,
      color: 'text-green-400 bg-green-500/20 border-green-500/50'
    },
    balanced: {
      name: 'Balanced',
      description: 'Moderate risk, balanced returns',
      maxRisk: 0.05,
      minConfidence: 0.7,
      positionSize: calcPositionSize,
      stopLoss: 0.05,
      takeProfit: 0.1,
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/50'
    },
    aggressive: {
      name: 'Aggressive',
      description: 'High risk, high reward potential',
      maxRisk: 0.1,
      minConfidence: 0.6,
      positionSize: 0.3,
      stopLoss: 0.08,
      takeProfit: 0.15,
      color: 'text-red-400 bg-red-500/20 border-red-500/50'
    }
  };

  useEffect(() => {
    if (riskProfiles[selectedProfile]) {
      setCustomSettings(riskProfiles[selectedProfile]);
    }
  }, [selectedProfile]);

  const handleProfileChange = (profile) => {
    setSelectedProfile(profile);
    if (onRiskProfileChange) {
      onRiskProfileChange(profile);
    }
  };

  const calculatePortfolioRisk = () => {
    if (!currentPositions?.length) return 0;
    const totalRisk = currentPositions.reduce((sum, position) => {
      const volatilityFactor = position.volatility || 1; // add ATR or std-dev
      const confidenceFactor = position.confidence || 0.7;
      return sum + (position.size * position.riskScore * volatilityFactor * (1 - confidenceFactor));
    }, 0);
    return (totalRisk / portfolioValue) * 100;
  };

  const calculateExposure = () => {
    if (!currentPositions || currentPositions.length === 0) return 0;
    
    const totalExposure = currentPositions.reduce((sum, position) => {
      return sum + position.size;
    }, 0);
    
    return (totalExposure / portfolioValue) * 100;
  };

  const getRiskLevel = (riskPercentage) => {
    if (riskPercentage < 2) return { level: 'Low', color: 'text-green-400' };
    if (riskPercentage < 5) return { level: 'Medium', color: 'text-yellow-400' };
    if (riskPercentage < 10) return { level: 'High', color: 'text-orange-400' };
    return { level: 'Very High', color: 'text-red-400' };
  };

  const portfolioRisk = calculatePortfolioRisk();
  const portfolioExposure = calculateExposure();
  const riskLevel = getRiskLevel(portfolioRisk);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-400" />
          Risk Management
        </h3>
        <button
          onClick={() => setShowCustomSettings(!showCustomSettings)}
          className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Portfolio Value</span>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-lg font-bold text-white">
            ${portfolioValue.toLocaleString()}
          </div>
          <input
            type="number"
            value={portfolioValue}
            onChange={(e) => onPortfolioValueChange && onPortfolioValueChange(Number(e.target.value))}
            className="w-full mt-2 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
            placeholder="Portfolio Value"
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Current Risk</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className={`text-lg font-bold ${riskLevel.color}`}>
            {portfolioRisk.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-400">
            {riskLevel.level} Risk
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Exposure</span>
            <Percent className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-400">
            {portfolioExposure.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">
            Of Portfolio
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Win Rate</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-400">
            {performanceMetrics.winRate || 0}%
          </div>
          <div className="text-xs text-gray-400">
            Success Rate
          </div>
        </div>
      </div>

      {/* Risk Profile Selection */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4">Risk Profile</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(riskProfiles).map(([key, profile]) => (
            <div
              key={key}
              onClick={() => handleProfileChange(key)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedProfile === key 
                  ? profile.color 
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <h5 className="font-semibold text-white mb-1">{profile.name}</h5>
                <p className="text-sm text-gray-400 mb-3">{profile.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Risk:</span>
                    <span className="text-white">{(profile.maxRisk * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Position Size:</span>
                    <span className="text-white">{(profile.positionSize * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Confidence:</span>
                    <span className="text-white">{(profile.minConfidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
      {showCustomSettings && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Custom Risk Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Maximum Risk per Trade (%)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="20"
                value={(customSettings.maxRisk * 100).toFixed(1)}
                onChange={(e) => setCustomSettings({
                  ...customSettings,
                  maxRisk: Number(e.target.value) / 100
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Minimum Confidence (%)</label>
              <input
                type="number"
                step="1"
                min="50"
                max="95"
                value={(customSettings.minConfidence * 100).toFixed(0)}
                onChange={(e) => setCustomSettings({
                  ...customSettings,
                  minConfidence: Number(e.target.value) / 100
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Default Position Size (%)</label>
              <input
                type="number"
                step="1"
                min="1"
                max="50"
                value={(customSettings.positionSize * 100).toFixed(0)}
                onChange={(e) => setCustomSettings({
                  ...customSettings,
                  positionSize: Number(e.target.value) / 100
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="20"
                value={(customSettings.stopLoss * 100).toFixed(1)}
                onChange={(e) => setCustomSettings({
                  ...customSettings,
                  stopLoss: Number(e.target.value) / 100
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Current Positions */}
      {currentPositions && currentPositions.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Current Positions</h4>
          <div className="space-y-3">
            {currentPositions.map((position, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {position.action === 'BUY' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-medium text-white">{position.symbol}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    position.action === 'BUY' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.action}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Size: </span>
                    <span className="text-white">${position.size.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Risk: </span>
                    <span className="text-orange-400">{position.riskScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Entry: </span>
                    <span className="text-blue-400">${position.entryPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">P&L: </span>
                    <span className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Warnings */}
      {portfolioRisk > 10 && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-red-400">High Risk Warning</span>
          </div>
          <p className="text-sm text-red-300">
            Your current portfolio risk ({portfolioRisk.toFixed(2)}%) exceeds recommended levels. 
            Consider reducing position sizes or closing some positions to manage risk.
          </p>
        </div>
      )}

      {portfolioExposure > 80 && (
        <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">High Exposure Warning</span>
          </div>
          <p className="text-sm text-yellow-300">
            Your portfolio exposure ({portfolioExposure.toFixed(1)}%) is very high. 
            Consider keeping some cash reserves for new opportunities and risk management.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskManagementPanel;
