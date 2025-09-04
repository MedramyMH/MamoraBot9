import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar
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

// Custom Candlestick Component
const Candlestick = (props) => {
  const { payload, x, y, width, height } = props;
  
  if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) {
    return null;
  }
  
  const { open, close, high, low } = payload;
  const isGreen = close >= open;
  const color = isGreen ? '#22c55e' : '#ef4444';
  
  const candleWidth = Math.max(1, width * 0.6);
  const candleX = x + (width - candleWidth) / 2;
  
  // Calculate positions
  const highY = y;
  const lowY = y + height;
  const openY = y + ((high - open) / (high - low)) * height;
  const closeY = y + ((high - close) / (high - low)) * height;
  
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.abs(openY - closeY);
  
  return (
    <g>
      {/* Wick line */}
      <line
        x1={x + width / 2}
        y1={highY}
        x2={x + width / 2}
        y2={lowY}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body rectangle */}
      <rect
        x={candleX}
        y={bodyTop}
        width={candleWidth}
        height={Math.max(1, bodyHeight)}
        fill={isGreen ? '#22c55e' : '#ef4444'}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

const CandlestickChart = ({ title, data, type, crossData, symbol, height = 400 }) => {
  // State for visible lines based on chart type
  const [visibleLines, setVisibleLines] = useState(() => {
    if (type === 'MA') {
      return { 9: true, 21: true, 55: false, 100: false, 200: false };
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const candleData = payload.find(p => p.payload.open);
      
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg border border-gray-600 shadow-xl">
          <p className="font-medium text-gray-200 mb-2 text-xs">{formatTime(label)}</p>
          
          {candleData && (
            <div className="mb-2 space-y-1">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-gray-400">O:</span><span className="text-blue-400">${formatPrice(candleData.payload.open)}</span>
                <span className="text-gray-400">H:</span><span className="text-green-400">${formatPrice(candleData.payload.high)}</span>
                <span className="text-gray-400">L:</span><span className="text-red-400">${formatPrice(candleData.payload.low)}</span>
                <span className="text-gray-400">C:</span><span className="text-white">${formatPrice(candleData.payload.close)}</span>
              </div>
            </div>
          )}
          
          {payload.filter(p => p.dataKey !== 'open' && p.dataKey !== 'high' && p.dataKey !== 'low' && p.dataKey !== 'close').map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
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
        { key: 'upper', name: 'Upper', color: '#f59e0b', dataKey: 'upper', strokeDasharray: '3 3' },
        { key: 'middle', name: 'Middle', color: '#8b5cf6', dataKey: 'middle' },
        { key: 'lower', name: 'Lower', color: '#10b981', dataKey: 'lower', strokeDasharray: '3 3' }
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

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
      {/* Compact Header */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        
        {type === 'CROSS' && crossData?.lastGoldenCross && (
          <div className="px-2 py-1 rounded-md text-xs bg-green-500/20 text-green-400">
            Last Golden: {formatTime(crossData.lastGoldenCross.time)}
          </div>
        )}
      </div>

      {/* Compact Line Toggle Controls */}
      <div className="mb-3 p-2 bg-gray-900/50 rounded-md">
        <div className="flex flex-wrap gap-2">
          {lineConfigs.map(config => (
            <label key={config.key} className="flex items-center space-x-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={visibleLines[config.key]}
                onChange={() => toggleLine(config.key)}
                className="w-3 h-3 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-1"
              />
              <span className="text-gray-300" style={{ color: config.color }}>
                {config.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Compact Chart */}
      <div className="bg-gray-900/30 rounded-md p-2" style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 15, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time"
              tickFormatter={formatTimestamp}
              angle={-45}
              textAnchor="end"
              height={50}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={{ stroke: '#4b5563' }}
              tickLine={{ stroke: '#4b5563' }}
            />
            <YAxis 
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(value) => `$${formatPrice(value)}`}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={{ stroke: '#4b5563' }}
              tickLine={{ stroke: '#4b5563' }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10, fontSize: '12px' }}
              iconType="line"
            />
            
            {/* Candlesticks using Bar component */}
            <Bar
              dataKey={() => 1}
              shape={<Candlestick />}
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
                  strokeWidth={1.5}
                  strokeDasharray={config.strokeDasharray}
                  dot={false}
                  name={config.name}
                  isAnimationActive={false}
                />
              ) : null
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandlestickChart;