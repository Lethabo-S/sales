import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPIData } from '../../types';

interface KPICardProps {
  data: KPIData;
}

const KPICard: React.FC<KPICardProps> = ({ data }) => {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{data.title}</h3>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {data.change > 0 ? '+' : ''}{data.change}%
          </span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-2">{data.value}</div>
      
      <div className="text-xs text-gray-500">
        vs. previous period
      </div>
    </div>
  );
};

export default KPICard;