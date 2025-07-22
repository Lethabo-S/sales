import React from 'react';
import { ChartData } from '../../types';

interface LineChartProps {
  data: ChartData[];
  title: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, color = '#2563eb' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getYPosition = (value: number) => {
    return 200 - ((value - minValue) / range) * 180;
  };

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 400;
    const y = getYPosition(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="relative">
        <svg width="400" height="200" viewBox="0 0 400 200" className="w-full h-48">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g className="stroke-gray-200" strokeWidth="1">
            {[0, 50, 100, 150, 200].map(y => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} />
            ))}
          </g>
          
          {/* Area under the line */}
          <path
            d={`${pathData} L 400 200 L 0 200 Z`}
            fill="url(#gradient)"
          />
          
          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 400;
            const y = getYPosition(point.value);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="hover:r-6 transition-all cursor-pointer"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          {data.map((point, index) => (
            <span key={index}>{point.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;