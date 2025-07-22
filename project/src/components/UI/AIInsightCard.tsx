import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';
import { AIInsight } from '../../types';

interface AIInsightCardProps {
  insight: AIInsight;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'forecast':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      case 'anomaly':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-green-500" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = () => {
    switch (insight.impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{insight.title}</h3>
            <p className="text-xs text-gray-500 capitalize">{insight.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor()}`}>
            {insight.impact}
          </span>
          <span className="text-xs text-gray-500">{insight.confidence}%</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mb-4">{insight.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">AI Confidence: {insight.confidence}%</span>
        </div>
        <span className="text-xs text-gray-500">{insight.date}</span>
      </div>
    </div>
  );
};

export default AIInsightCard;