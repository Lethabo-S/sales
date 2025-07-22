export interface User {
  id: string;
  name: string;
  role: 'sales' | 'procurement' | 'admin';
  email: string;
  avatar?: string;
}

export interface SalesData {
  id: string;
  date: string;
  revenue: number;
  leads: number;
  conversions: number;
  region: string;
  product: string;
  salesPerson: string;
}

export interface ProcurementData {
  id: string;
  date: string;
  supplier: string;
  category: string;
  amount: number;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  deliveryDate: string;
  riskScore: number;
}

export interface KPIData {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export interface AIInsight {
  id: string;
  type: 'forecast' | 'anomaly' | 'recommendation' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  date: string;
}

export interface DashboardView {
  id: string;
  name: string;
  role: string;
  icon: string;
}