import React from 'react';
import KPICard from '../UI/KPICard';
import AIInsightCard from '../UI/AIInsightCard';
import LineChart from '../Charts/LineChart';
import { salesKPIs, procurementKPIs, aiInsights, revenueChartData } from '../../data/mockData';

const OverviewDashboard: React.FC = () => {
  // Combine sales and procurement KPIs for overview
  const overviewKPIs = [
    salesKPIs[0], // Total Revenue
    procurementKPIs[0], // Total Spend
    salesKPIs[1], // Conversion Rate
    procurementKPIs[1], // Supplier Performance
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewKPIs.map((kpi, index) => (
          <KPICard key={index} data={kpi} />
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live Analysis</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={revenueChartData}
          title="Revenue Performance"
          color="#2563eb"
        />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Metrics Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Monthly Revenue Growth</span>
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Procurement Efficiency</span>
              <span className="text-sm font-medium text-blue-600">94.2%</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Cost Optimization</span>
              <span className="text-sm font-medium text-green-600">$45K saved</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Risk Assessment</span>
              <span className="text-sm font-medium text-yellow-600">Medium</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600">AI Prediction Accuracy</span>
              <span className="text-sm font-medium text-purple-600">87%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;