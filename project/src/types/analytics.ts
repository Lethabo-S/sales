export interface AnalyticsData {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  metadata: Record<string, any>;
  responseTime?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface UsageMetrics {
  totalQueries: number;
  averageResponseTime: number;
  activeUsers: number;
  peakHours: { hour: number; count: number }[];
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface ReportConfig {
  id: string;
  name: string;
  type: 'usage' | 'engagement' | 'sentiment' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  filters: Record<string, any>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
}

export interface HeatmapData {
  hour: number;
  day: number;
  value: number;
}