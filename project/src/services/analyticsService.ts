// import { AnalyticsData, UsageMetrics, HeatmapData, ReportConfig } from '../types/analytics';

// class AnalyticsService {
//   private analytics: AnalyticsData[] = [
//     {
//       id: '1',
//       timestamp: new Date(Date.now() - 3600000).toISOString(),
//       userId: '1',
//       action: 'ai_query',
//       metadata: { query: 'How to reset password?', category: 'support' },
//       responseTime: 1200,
//       sentiment: 'neutral',
//     },
//     {
//       id: '2',
//       timestamp: new Date(Date.now() - 7200000).toISOString(),
//       userId: '2',
//       action: 'message_sent',
//       metadata: { channelId: '1', messageLength: 45 },
//       responseTime: 800,
//       sentiment: 'positive',
//     },
//     // Add more mock data...
//   ];

//   async getUsageMetrics(dateRange: { start: string; end: string }): Promise<UsageMetrics> {
//     const filteredData = this.analytics.filter(
//       item => item.timestamp >= dateRange.start && item.timestamp <= dateRange.end
//     );

//     const totalQueries = filteredData.filter(item => item.action === 'ai_query').length;
//     const responseTimes = filteredData
//       .filter(item => item.responseTime)
//       .map(item => item.responseTime!);
//     const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;

//     const uniqueUsers = new Set(filteredData.map(item => item.userId)).size;

//     // Generate peak hours data
//     const hourCounts: Record<number, number> = {};
//     filteredData.forEach(item => {
//       const hour = new Date(item.timestamp).getHours();
//       hourCounts[hour] = (hourCounts[hour] || 0) + 1;
//     });

//     const peakHours = Object.entries(hourCounts)
//       .map(([hour, count]) => ({ hour: parseInt(hour), count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);

//     // Calculate sentiment distribution
//     const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
//     filteredData.forEach(item => {
//       if (item.sentiment) {
//         sentimentCounts[item.sentiment]++;
//       }
//     });

//     return {
//       totalQueries,
//       averageResponseTime: Math.round(averageResponseTime),
//       activeUsers: uniqueUsers,
//       peakHours,
//       sentimentDistribution: sentimentCounts,
//     };
//   }

//   async getHeatmapData(dateRange: { start: string; end: string }): Promise<HeatmapData[]> {
//     const data: HeatmapData[] = [];
    
//     // Generate mock heatmap data for 7 days x 24 hours
//     for (let day = 0; day < 7; day++) {
//       for (let hour = 0; hour < 24; hour++) {
//         data.push({
//           day,
//           hour,
//           value: Math.floor(Math.random() * 100),
//         });
//       }
//     }

//     return data;
//   }

//   async createReport(config: ReportConfig): Promise<string> {
//     // Mock report generation
//     console.log('Creating report:', config);
//     return 'report-id-123';
//   }

//   async exportData(format: 'csv' | 'json' | 'pdf', filters?: any): Promise<Blob> {
//     const data = this.analytics.filter(item => {
//       // Apply filters if provided
//       return true;
//     });

//     if (format === 'json') {
//       return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//     }

//     if (format === 'csv') {
//       const csv = this.convertToCSV(data);
//       return new Blob([csv], { type: 'text/csv' });
//     }

//     // For PDF, return mock blob
//     return new Blob(['PDF content'], { type: 'application/pdf' });
//   }

//   private convertToCSV(data: any[]): string {
//     if (data.length === 0) return '';
    
//     const headers = Object.keys(data[0]);
//     const csvContent = [
//       headers.join(','),
//       ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
//     ].join('\n');
    
//     return csvContent;
//   }

//   async trackEvent(event: Omit<AnalyticsData, 'id' | 'timestamp'>): Promise<void> {
//     const newEvent: AnalyticsData = {
//       ...event,
//       id: Date.now().toString(),
//       timestamp: new Date().toISOString(),
//     };
    
//     this.analytics.push(newEvent);
//   }
// }

// export const analyticsService = new AnalyticsService();
import { AnalyticsData, UsageMetrics, HeatmapData, ReportConfig } from '../types/analytics';

class AnalyticsService {
  private analytics: AnalyticsData[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: '1',
      action: 'ai_query',
      metadata: { query: 'How to reset password?', category: 'support' },
      responseTime: 1200,
      sentiment: 'neutral',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      userId: '2',
      action: 'message_sent',
      metadata: { channelId: '1', messageLength: 45 },
      responseTime: 800,
      sentiment: 'positive',
    },
    // Add more mock data...
  ];

  async getUsageMetrics(dateRange: { start: string; end: string }): Promise<UsageMetrics> {
    const filteredData = this.analytics.filter(
      item => item.timestamp >= dateRange.start && item.timestamp <= dateRange.end
    );

    const totalQueries = filteredData.filter(item => item.action === 'ai_query').length;
    const responseTimes = filteredData
      .filter(item => item.responseTime)
      .map(item => item.responseTime!);
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;

    const uniqueUsers = new Set(filteredData.map(item => item.userId)).size;

    // Generate peak hours data
    const hourCounts: Record<number, number> = {};
    filteredData.forEach(item => {
      const hour = new Date(item.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate sentiment distribution
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    filteredData.forEach(item => {
      if (item.sentiment) {
        sentimentCounts[item.sentiment]++;
      }
    });

    return {
      totalQueries,
      averageResponseTime: Math.round(averageResponseTime),
      activeUsers: uniqueUsers,
      peakHours,
      sentimentDistribution: sentimentCounts,
    };
  }

  async getHeatmapData(dateRange: { start: string; end: string }): Promise<HeatmapData[]> {
    const data: HeatmapData[] = [];
    
    // Generate mock heatmap data for 7 days x 24 hours
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        data.push({
          day,
          hour,
          value: Math.floor(Math.random() * 100),
        });
      }
    }

    return data;
  }

  async createReport(config: ReportConfig): Promise<string> {
    // Mock report generation
    console.log('Creating report:', config);
    return 'report-id-123';
  }

  async exportData(format: 'csv' | 'json' | 'pdf', filters?: any): Promise<Blob> {
    const data = this.analytics.filter(item => {
      // Apply filters if provided
      return true;
    });

    if (format === 'json') {
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }

    if (format === 'csv') {
      const csv = this.convertToCSV(data);
      return new Blob([csv], { type: 'text/csv' });
    }

    // For PDF, return mock blob
    return new Blob(['PDF content'], { type: 'application/pdf' });
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');
    
    return csvContent;
  }

  async trackEvent(event: Omit<AnalyticsData, 'id' | 'timestamp'>): Promise<void> {
    const newEvent: AnalyticsData = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    this.analytics.push(newEvent);
  }
}

export const analyticsService = new AnalyticsService();