import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getTokenDecimals } from '../utils/technicalIndicators';

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

const MACD = ({ data, symbol, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">MACD</h4>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400 text-sm">Loading MACD...</div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg border border-gray-600 shadow-xl">
          <p className="font-medium text-gray-200 mb-2 text-xs">{formatTime(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              <span className="font-medium">{entry.name}: </span>
              <span>{entry.value?.toFixed(4)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const lastValue = data[data.length - 1];
  const macdLine = lastValue?.macd || 0;
  const signalLine = lastValue?.signal || 0;
  const histogram = lastValue?.histogram || 0;
  
  let signal = 'Neutral';
  let signalColor = 'text-gray-400';
  
  if (macdLine > signalLine && histogram > 0) {
    signal = 'Bullish';
    signalColor = 'text-green-400';
  } else if (macdLine < signalLine && histogram < 0) {
    signal = 'Bearish';
    signalColor = 'text-red-400';
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-white">MACD (12, 26, 9)</h4>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-300">
            MACD: <span className="text-white font-medium">{macdLine.toFixed(4)}</span>
          </span>
          <span className={`text-xs px-2 py-1 rounded ${signalColor} bg-gray-900/50`}>
            {signal}
          </span>
        </div>
      </div>

      <div className="bg-gray-900/30 rounded-md p-2" style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 15, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time"
              tickFormatter={(time) => new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={{ stroke: '#4b5563' }}
              tickLine={{ stroke: '#4b5563' }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={{ stroke: '#4b5563' }}
              tickLine={{ stroke: '#4b5563' }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 5, fontSize: '11px' }}
              iconType="line"
            />
            
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="1 1" strokeOpacity={0.4} />
            
            <Bar
              dataKey="histogram"
              fill="#8884d8"
              name="Histogram"
              opacity={0.7}
              isAnimationActive={false}
            />
            
            <Line
              type="monotone"
              dataKey="macd"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="MACD"
              isAnimationActive={false}
            />
            
            <Line
              type="monotone"
              dataKey="signal"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="Signal"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MACD;