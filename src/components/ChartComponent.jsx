import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { getTokenDecimals } from '../utils/technicalIndicators';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const formatTime = (time) => {
  if (!time) return '';
  return new Date(time).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const ChartComponent = ({ title, data, type, crossData, symbol, height = 500 }) => {
  // State for visible lines based on chart type
  const [visibleLines, setVisibleLines] = useState(() => {
    if (type === 'MA') {
      return { 9: true, 21: true, 55: true, 100: true, 200: true };
    } else if (type === 'BB') {
      return { upper: true, middle: true, lower: true };
    } else if (type === 'CROSS') {
      return { shortMA: true, longMA: true };
    }
    return {};
  });

  const toggleLine = (key) => {
    setVisibleLines(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Format price with appropriate decimals
  const formatPrice = (price) => {
    if (!price || typeof price !== 'number') return '0';
    const decimals = getTokenDecimals(symbol);
    return price.toFixed(decimals);
  };

  // Format percentage to 2 decimal places
  const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0.00';
    return value.toFixed(2);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-lg border border-gray-600">
          <p className="font-medium text-gray-200 mb-2">{formatTime(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              <span className="font-medium">{entry.name}: </span>
              <span>${formatPrice(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Get line configurations based on type
  const getLineConfigs = () => {
    if (type === 'MA') {
      return [
        { key: 9, name: 'MA 9', color: '#ef4444', dataKey: 'MA9' },
        { key: 21, name: 'MA 21', color: '#22c55e', dataKey: 'MA21' },
        { key: 55, name: 'MA 55', color: '#3b82f6', dataKey: 'MA55' },
        { key: 100, name: 'MA 100', color: '#a855f7', dataKey: 'MA100' },
        { key: 200, name: 'MA 200', color: '#06b6d4', dataKey: 'MA200' }
      ];
    } else if (type === 'BB') {
      return [
        { key: 'upper', name: 'Upper Band', color: '#f59e0b', dataKey: 'upper', strokeDasharray: '5 5' },
        { key: 'middle', name: 'Middle Band', color: '#8b5cf6', dataKey: 'middle' },
        { key: 'lower', name: 'Lower Band', color: '#10b981', dataKey: 'lower', strokeDasharray: '5 5' }
      ];
    } else if (type === 'CROSS') {
      return [
        { key: 'shortMA', name: 'MA 55', color: '#ef4444', dataKey: 'shortMA' },
        { key: 'longMA', name: 'MA 200', color: '#3b82f6', dataKey: 'longMA' }
      ];
    }
    return [];
  };

  const lineConfigs = getLineConfigs();
  const lastCrossEvent = crossData?.lastGoldenCross || crossData?.lastDeathCross;
  const lastCrossType = crossData?.lastGoldenCross ? 'golden' : 'death';

  return (
    <div className="chart-container" style={{ position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            type === 'MA' ? 'bg-blue-500' : 
            type === 'BB' ? 'bg-green-500' : 
            'bg-yellow-500'
          }`}></div>
          <span>{title}</span>
        </h3>
        
        {/* Last Cross Event Badge */}
        {type === 'CROSS' && lastCrossEvent && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            lastCrossType === 'golden' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            Last {lastCrossType === 'golden' ? 'Golden' : 'Death'} Cross: {formatTime(lastCrossEvent.time)}
          </div>
        )}
      </div>

      {/* Line Toggle Controls */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Toggle Indicators</h4>
        <div className="flex flex-wrap gap-3">
          {lineConfigs.map(config => (
            <label key={config.key} className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={visibleLines[config.key]}
                  onChange={() => toggleLine(config.key)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                  visibleLines[config.key] 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-500 hover:border-gray-400'
                }`}>
                  {visibleLines[config.key] && (
                    <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200" style={{ color: config.color }}>
                {config.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900/50 rounded-lg p-4" style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time"
              tickFormatter={formatTimestamp}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
              tickLine={{ stroke: '#4b5563' }}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${formatPrice(value)}`}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
              tickLine={{ stroke: '#4b5563' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 20 }}
              iconType="line"
            />
            
            {/* Price Line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
              name="Price"
              isAnimationActive={false}
            />
            
            {/* Dynamic Lines based on type and visibility */}
            {lineConfigs.map(config => 
              visibleLines[config.key] ? (
                <Line
                  key={config.key}
                  type="monotone"
                  dataKey={config.dataKey}
                  stroke={config.color}
                  strokeWidth={2}
                  strokeDasharray={config.strokeDasharray}
                  dot={false}
                  name={config.name}
                  isAnimationActive={false}
                />
              ) : null
            )}
            
            {/* Cross Reference Points */}
            {type === 'CROSS' && data.filter(point => point.crossType).map((point, index) => (
              <ReferenceDot
                key={`cross-${index}`}
                x={point.time}
                y={point.price}
                r={6}
                fill={point.crossType === 'golden' ? '#22c55e' : '#ef4444'}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;