export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  isSystemRole: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  category: string;
  isPublic: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface AuditAction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed';
  errorMessage?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  location?: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  totalQueries: number;
  errorRate: number;
  systemUptime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
}

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  type: 'full' | 'incremental';
  status: 'completed' | 'in_progress' | 'failed';
  createdAt: string;
  downloadUrl?: string;
}