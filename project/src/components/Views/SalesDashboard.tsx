import React from 'react';
import KPICard from '../UI/KPICard';
import LineChart from '../Charts/LineChart';
import PieChart from '../Charts/PieChart';
import { salesKPIs, revenueChartData, regionData, salesData } from '../../data/mockData';

const SalesDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesKPIs.map((kpi, index) => (
          <KPICard key={index} data={kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={revenueChartData}
          title="Revenue Trend"
          color="#2563eb"
        />
        <PieChart
          data={regionData}
          title="Sales by Region"
          colors={['#2563eb', '#7c3aed', '#dc2626']}
        />
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Sales</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sales Person</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Region</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{sale.salesPerson}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{sale.product}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{sale.region}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                    ${sale.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                    {sale.conversions}
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

export default SalesDashboard;