import React from 'react';
import KPICard from '../UI/KPICard';
import PieChart from '../Charts/PieChart';
import { procurementKPIs, spendChartData, procurementData } from '../../data/mockData';

const ProcurementDashboard: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {procurementKPIs.map((kpi, index) => (
          <KPICard key={index} data={kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={spendChartData}
          title="Spend by Category"
          colors={['#2563eb', '#7c3aed', '#dc2626', '#ea580c', '#059669']}
        />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Supplier Risk Analysis</h3>
          <div className="space-y-4">
            {procurementData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.supplier}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getRiskColor(item.riskScore)}`}>
                    Risk: {item.riskScore}/5
                  </div>
                  <div className="text-xs text-gray-500">${item.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Procurement Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Procurement</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Supplier</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Risk</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {procurementData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{item.supplier}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{item.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                    ${item.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-sm font-medium ${getRiskColor(item.riskScore)}`}>
                      {item.riskScore}/5
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(item.deliveryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcurementDashboard;