import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTradingEngine } from '../utils/enhancedTradingEngine';
import { MarketDataManager } from '../utils/marketDataManager';
import { TrendingUp, TrendingDown, Minus, Clock, Target, Shield, Brain } from 'lucide-react';

const StructuredTradingSignals = ({ autoRefresh, refreshInterval }) => {
  const [signals, setSignals] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [loading, setLoading] = useState(false);
  const [tradingEngine] = useState(() => new EnhancedTradingEngine());
  const [dataManager] = useState(() => new MarketDataManager());

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];

  useEffect(() => {
    // Initialize with some default symbols
    const symbols = dataManager.getAvailableSymbols();
    const defaultSelection = [
      ...symbols.stocks.slice(0, 2),
      ...symbols.forex.slice(0, 2),
      ...symbols.crypto.slice(0, 2)
    ];
    setSelectedSymbols(defaultSelection);
  }, [dataManager]);

  useEffect(() => {
    if (selectedSymbols.length > 0) {
      generateSignals();
    }
  }, [selectedSymbols, selectedTimeframe]);

  useEffect(() => {
    let interval;
    if (autoRefresh && selectedSymbols.length > 0) {
      interval = setInterval(() => {
        generateSignals();
      }, refreshInterval * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, selectedSymbols, selectedTimeframe]);

  const generateSignals = async () => {
    setLoading(true);
    try {
      const newSignals = [];
      
      for (const symbol of selectedSymbols) {
        const marketData = await dataManager.getCachedOrFetch(symbol);
        if (marketData && marketData.data) {
          const signal = tradingEngine.generateStructuredSignal(
            symbol,
            marketData.data,
            selectedTimeframe
          );
          newSignals.push(signal);
        }
      }
      
      setSignals(newSignals);
    } catch (error) {
      console.error('Error generating signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSignalIcon = (signalType) => {
    switch (signalType) {
      case 'BUY':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'SELL':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getSignalColor = (signalType) => {
    switch (signalType) {
      case 'BUY':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'SELL':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 75) return 'text-green-400';
    if (confidence >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatSignalOutput = (signal) => {
    return `[Signal] ${signal.signal}
[Asset] ${signal.asset}
[Timeframe] ${signal.timeframe}
[Contract Period] ${signal.contractPeriod}
[Entry Zone] ${signal.entryZone}
[Target] ${signal.target}
[Stop Loss] ${signal.stopLoss}
[Confidence] ${signal.confidence}%
[Reasoning] ${signal.reasoning}`;
  };

  const SymbolSelector = () => {
    const symbols = dataManager.getAvailableSymbols();

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(symbols).map(([category, symbolList]) => (
            <Card key={category} className="bg-slate-800/30 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300 capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {symbolList.slice(0, 4).map(symbol => (
                  <Button
                    key={symbol}
                    variant={selectedSymbols.includes(symbol) ? "default" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      if (selectedSymbols.includes(symbol)) {
                        setSelectedSymbols(prev => prev.filter(s => s !== symbol));
                      } else {
                        setSelectedSymbols(prev => [...prev, symbol]);
                      }
                    }}
                  >
                    {dataManager.getSymbolDisplayName(symbol)}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Enhanced Trading Signals - Structured Format
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(tf => (
                  <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={generateSignals} 
              disabled={loading || selectedSymbols.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Generating...' : 'Generate Signals'}
            </Button>
            <div className="text-sm text-gray-400">
              {selectedSymbols.length} symbols selected
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Symbol Selection */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg">Select Trading Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <SymbolSelector />
        </CardContent>
      </Card>

      {/* Trading Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {signals.map((signal, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  {getSignalIcon(signal.signal)}
                  {signal.asset}
                </CardTitle>
                <Badge variant="outline" className={getSignalColor(signal.signal)}>
                  {signal.signal}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Structured Signal Display */}
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm">
                <pre className="text-gray-300 whitespace-pre-wrap">
                  {formatSignalOutput(signal)}
                </pre>
              </div>

              {/* Visual Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Timeframe: {signal.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Target: {signal.target}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">Stop Loss: {signal.stopLoss}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-300">Confidence: </span>
                    <span className={`font-bold ${getConfidenceColor(signal.confidence)}`}>
                      {signal.confidence}%
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-300">Period: </span>
                    <span className="text-blue-400">{signal.contractPeriod}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-300">Entry: </span>
                    <span className="text-yellow-400">{signal.entryZone}</span>
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-slate-900/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Analysis Reasoning:</h4>
                <p className="text-xs text-gray-400">{signal.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No signals message */}
      {signals.length === 0 && !loading && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="text-center py-8">
            <p className="text-gray-400">
              Select symbols and click "Generate Signals" to see structured trading recommendations.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
              <p className="text-gray-400">Generating trading signals...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StructuredTradingSignals;