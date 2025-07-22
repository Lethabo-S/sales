import { SalesData, ProcurementData, KPIData, AIInsight, ChartData } from '../types';

export const salesData: SalesData[] = [
  {
    id: '1',
    date: '2024-01-15',
    revenue: 125000,
    leads: 45,
    conversions: 12,
    region: 'North America',
    product: 'Enterprise Software',
    salesPerson: 'John Smith'
  },
  {
    id: '2',
    date: '2024-01-16',
    revenue: 98000,
    leads: 38,
    conversions: 9,
    region: 'Europe',
    product: 'Cloud Services',
    salesPerson: 'Sarah Johnson'
  },
  {
    id: '3',
    date: '2024-01-17',
    revenue: 156000,
    leads: 52,
    conversions: 15,
    region: 'Asia Pacific',
    product: 'Mobile Solutions',
    salesPerson: 'Mike Chen'
  },
  {
    id: '4',
    date: '2024-01-18',
    revenue: 89000,
    leads: 41,
    conversions: 8,
    region: 'North America',
    product: 'Analytics Platform',
    salesPerson: 'Emily Davis'
  },
  {
    id: '5',
    date: '2024-01-19',
    revenue: 203000,
    leads: 67,
    conversions: 18,
    region: 'Europe',
    product: 'Enterprise Software',
    salesPerson: 'David Wilson'
  }
];

export const procurementData: ProcurementData[] = [
  {
    id: '1',
    date: '2024-01-15',
    supplier: 'TechCorp Industries',
    category: 'Hardware',
    amount: 45000,
    status: 'delivered',
    deliveryDate: '2024-01-20',
    riskScore: 2
  },
  {
    id: '2',
    date: '2024-01-16',
    supplier: 'Global Software Solutions',
    category: 'Software',
    amount: 78000,
    status: 'approved',
    deliveryDate: '2024-01-25',
    riskScore: 1
  },
  {
    id: '3',
    date: '2024-01-17',
    supplier: 'Office Supplies Plus',
    category: 'Office Materials',
    amount: 12000,
    status: 'pending',
    deliveryDate: '2024-01-22',
    riskScore: 3
  },
  {
    id: '4',
    date: '2024-01-18',
    supplier: 'Industrial Components Ltd',
    category: 'Manufacturing',
    amount: 156000,
    status: 'delivered',
    deliveryDate: '2024-01-19',
    riskScore: 4
  },
  {
    id: '5',
    date: '2024-01-19',
    supplier: 'Cloud Infrastructure Co',
    category: 'Services',
    amount: 89000,
    status: 'approved',
    deliveryDate: '2024-01-30',
    riskScore: 2
  }
];

export const salesKPIs: KPIData[] = [
  {
    title: 'Total Revenue',
    value: '$671K',
    change: 12.5,
    trend: 'up',
    icon: 'DollarSign'
  },
  {
    title: 'Conversion Rate',
    value: '26.4%',
    change: 3.2,
    trend: 'up',
    icon: 'TrendingUp'
  },
  {
    title: 'Active Leads',
    value: '243',
    change: -2.1,
    trend: 'down',
    icon: 'Users'
  },
  {
    title: 'Avg Deal Size',
    value: '$13.4K',
    change: 8.7,
    trend: 'up',
    icon: 'Target'
  }
];

export const procurementKPIs: KPIData[] = [
  {
    title: 'Total Spend',
    value: '$380K',
    change: 5.3,
    trend: 'up',
    icon: 'ShoppingCart'
  },
  {
    title: 'Supplier Performance',
    value: '94.2%',
    change: 2.1,
    trend: 'up',
    icon: 'Award'
  },
  {
    title: 'Cost Savings',
    value: '$45K',
    change: 15.8,
    trend: 'up',
    icon: 'PiggyBank'
  },
  {
    title: 'Risk Score',
    value: '2.4',
    change: -0.3,
    trend: 'up',
    icon: 'Shield'
  }
];

export const aiInsights: AIInsight[] = [
  {
    id: '1',
    type: 'forecast',
    title: 'Q1 Revenue Forecast',
    description: 'Based on current trends, Q1 revenue is projected to reach $2.1M, exceeding target by 8%',
    confidence: 87,
    impact: 'high',
    date: '2024-01-19'
  },
  {
    id: '2',
    type: 'anomaly',
    title: 'Unusual Spending Pattern',
    description: 'Hardware procurement spend increased 35% this week, investigate potential bulk orders',
    confidence: 92,
    impact: 'medium',
    date: '2024-01-19'
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Supplier Consolidation',
    description: 'Consolidating office supplies to 2 suppliers could save $12K annually',
    confidence: 78,
    impact: 'medium',
    date: '2024-01-18'
  },
  {
    id: '4',
    type: 'trend',
    title: 'Mobile Solutions Growth',
    description: 'Mobile product sales up 45% month-over-month, consider expanding team',
    confidence: 85,
    impact: 'high',
    date: '2024-01-17'
  }
];

export const revenueChartData: ChartData[] = [
  { name: 'Jan', value: 671000 },
  { name: 'Feb', value: 589000 },
  { name: 'Mar', value: 723000 },
  { name: 'Apr', value: 856000 },
  { name: 'May', value: 945000 },
  { name: 'Jun', value: 1120000 }
];

export const spendChartData: ChartData[] = [
  { name: 'Hardware', value: 245000 },
  { name: 'Software', value: 189000 },
  { name: 'Services', value: 156000 },
  { name: 'Office Materials', value: 89000 },
  { name: 'Manufacturing', value: 334000 }
];

export const regionData: ChartData[] = [
  { name: 'North America', value: 45 },
  { name: 'Europe', value: 32 },
  { name: 'Asia Pacific', value: 23 }
];