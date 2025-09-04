import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EnhancedTradingSignals from './EnhancedTradingSignals';
import PriceComparison from './PriceComparison';
import TechnicalIndicators from './TechnicalIndicators';
import { TradingDataManager } from '../utils/tradingDataManager';

const RealTimeMarketAnalysis = ({ autoRefresh, refreshInterval, lastUpdate }) => {
  const [selectedSymbols, setSelectedSymbols] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA']);
  const [marketData, setMarketData] = useState({});
  const [pocketOptionData, setPocketOptionData] = useState({});
  const [loading, setLoading] = useState(false);

  const availableSymbols = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX',
    'SPY', 'QQQ', 'IWM', 'GLD', 'BTC-USD', 'ETH-USD'
  ];

  const dataManager = new TradingDataManager();

  // Simulate Pocket Option data with variations

  const generatePocketOptionData = (marketPrice, marketIndicators) => {
    const spread = 0.0015; // 0.15% realistic spread
    const directionBias = marketIndicators.trend === "bullish" ? 1 : -1;
    const pocketPrice = marketPrice * (1 + spread * directionBias);
    
    const pocketIndicators = {};
    Object.keys(marketIndicators).forEach(key => {
      if (typeof marketIndicators[key] === 'number') {
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        pocketIndicators[key] = marketIndicators[key] * (1 + variation);
      } else {
        pocketIndicators[key] = marketIndicators[key];
      }
    });

    return {
      price: pocketPrice,
      indicators: pocketIndicators,
      timestamp: new Date()
    };
  };

  // Fetch and update all data
  const updateAllData = async () => {
    if (selectedSymbols.length === 0) return;
    
    setLoading(true);
    const newMarketData = {};
    const newPocketOptionData = {};

  const updateAllData = async () => {
  if (selectedSymbols.length === 0) return;

  setLoading(true);

  try {
      // Run all fetches in parallel
      const marketResults = await Promise.all(
        selectedSymbols.map(symbol => dataManager.getMarketData(symbol))
      );
  
      const newMarketData = {};
      const newPocketOptionData = {};
  
      selectedSymbols.forEach((symbol, i) => {
        const marketInfo = marketResults[i];
        if (marketInfo) {
          newMarketData[symbol] = marketInfo;
  
          // Generate Pocket Option simulation
          newPocketOptionData[symbol] = generatePocketOptionData(
            marketInfo.currentPrice,
            marketInfo.technicalIndicators
          );
        }
      });
  
      setMarketData(newMarketData);
      setPocketOptionData(newPocketOptionData);
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };





  // Auto-refresh effect
  useEffect(() => {
    updateAllData();
  }, [selectedSymbols, lastUpdate]);

  // Manual refresh
  const handleManualRefresh = () => {
    updateAllData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              📊 Real-Time Market Analysis
            </span>
            <Button 
              onClick={handleManualRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
              className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
            >
              {loading ? '🔄 Updating...' : '🔄 Refresh Now'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Symbol Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Select Trading Symbols:</h4>
            <div className="flex flex-wrap gap-2">
              {availableSymbols.map(symbol => (
                <Badge
                  key={symbol}
                  variant={selectedSymbols.includes(symbol) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedSymbols.includes(symbol)
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                  onClick={() => {
                    if (selectedSymbols.includes(symbol)) {
                      setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
                    } else {
                      setSelectedSymbols([...selectedSymbols, symbol]);
                    }
                  }}
                >
                  {symbol}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-gray-400">Monitored Symbols</div>
              <div className="text-white font-semibold">{selectedSymbols.length}</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-gray-400">AI Recommendations</div>
              <div className="text-white font-semibold">{Object.keys(marketData).length}</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-gray-400">Data Sources</div>
              <div className="text-white font-semibold">Market + Pocket Option</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-gray-400">Update Status</div>
              <div className={`font-semibold ${autoRefresh ? 'text-green-400' : 'text-yellow-400'}`}>
                {autoRefresh ? 'Auto-Refresh ON' : 'Manual Mode'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Tabs */}
      {selectedSymbols.length > 0 ? (
        <Tabs defaultValue="ai-signals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
            <TabsTrigger 
              value="ai-signals" 
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              🧠 AI Trading Signals
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              💰 Price Comparison
            </TabsTrigger>
            <TabsTrigger 
              value="indicators" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              📈 Technical Indicators
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-signals" className="mt-6">
            <EnhancedTradingSignals
              selectedSymbols={selectedSymbols}
              marketData={marketData}
              pocketOptionData={pocketOptionData}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <PriceComparison
              selectedSymbols={selectedSymbols}
              marketData={marketData}
              pocketOptionData={pocketOptionData}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="indicators" className="mt-6">
            <TechnicalIndicators
              selectedSymbols={selectedSymbols}
              marketData={marketData}
              pocketOptionData={pocketOptionData}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">📊</div>
            <h3 className="text-white text-lg font-semibold mb-2">No Symbols Selected</h3>
            <p className="text-gray-400">Please select at least one trading symbol to begin AI analysis.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeMarketAnalysis;
