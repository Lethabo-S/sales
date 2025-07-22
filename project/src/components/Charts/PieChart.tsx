import React from 'react';
import { ChartData } from '../../types';

interface PieChartProps {
  data: ChartData[];
  title: string;
  colors?: string[];
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title, 
  colors = ['#2563eb', '#7c3aed', '#dc2626', '#ea580c', '#059669'] 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    
    cumulativePercentage += percentage;
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
    
    const pathData = [
      `M 100 100`,
      `L ${x1} ${y1}`,
      `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');
    
    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1),
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="flex items-center justify-between">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathData}
                fill={slice.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        
        <div className="space-y-3">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: slice.color }}
              ></div>
              <div>
                <div className="text-sm font-medium text-gray-900">{slice.name}</div>
                <div className="text-xs text-gray-500">
                  {slice.percentage}% (${slice.value.toLocaleString()})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;