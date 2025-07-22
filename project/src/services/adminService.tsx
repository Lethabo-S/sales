import { User } from '../types/auth';
import { Role, Permission, SystemConfig, AuditAction, SystemMetrics, BackupInfo } from '../types/admin';

class AdminService {
  // Mock data
  private roles: Role[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: [],
      isDefault: false,
      isSystemRole: true,
      userCount: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access with user management',
      permissions: [],
      isDefault: false,
      isSystemRole: false,
      userCount: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Moderator',
      description: 'Content moderation and user support',
      permissions: [],
      isDefault: false,
      isSystemRole: false,
      userCount: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      name: 'User',
      description: 'Standard user access',
      permissions: [],
      isDefault: true,
      isSystemRole: true,
      userCount: 150,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  private permissions: Permission[] = [
    { id: '1', name: 'users.create', description: 'Create new users', resource: 'users', action: 'create', createdAt: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'users.read', description: 'View user information', resource: 'users', action: 'read', createdAt: '2024-01-01T00:00:00Z' },
    { id: '3', name: 'users.update', description: 'Update user information', resource: 'users', action: 'update', createdAt: '2024-01-01T00:00:00Z' },
    { id: '4', name: 'users.delete', description: 'Delete users', resource: 'users', action: 'delete', createdAt: '2024-01-01T00:00:00Z' },
    { id: '5', name: 'roles.manage', description: 'Manage roles and permissions', resource: 'roles', action: 'manage', createdAt: '2024-01-01T00:00:00Z' },
    { id: '6', name: 'system.config', description: 'Configure system settings', resource: 'system', action: 'config', createdAt: '2024-01-01T00:00:00Z' },
    { id: '7', name: 'audit.view', description: 'View audit logs', resource: 'audit', action: 'view', createdAt: '2024-01-01T00:00:00Z' },
    { id: '8', name: 'backup.manage', description: 'Manage system backups', resource: 'backup', action: 'manage', createdAt: '2024-01-01T00:00:00Z' },
  ];

  private systemConfigs: SystemConfig[] = [
    {
      id: '1',
      key: 'app.name',
      value: 'AI Assistant Platform',
      type: 'string',
      description: 'Application name displayed in the UI',
      category: 'General',
      isPublic: true,
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'admin@example.com',
    },
    {
      id: '2',
      key: 'auth.session_timeout',
      value: '3600',
      type: 'number',
      description: 'Session timeout in seconds',
      category: 'Security',
      isPublic: false,
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'admin@example.com',
    },
    {
      id: '3',
      key: 'features.ai_assistant',
      value: 'true',
      type: 'boolean',
      description: 'Enable AI assistant feature',
      category: 'Features',
      isPublic: true,
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'admin@example.com',
    },
  ];

  private auditLogs: AuditAction[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Admin User',
      userEmail: 'admin@example.com',
      action: 'user.create',
      resource: 'users',
      resourceId: '123',
      newValues: { name: 'John Doe', email: 'john@example.com' },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date().toISOString(),
      severity: 'medium',
      status: 'success',
    },
  ];

  // User Management
  async getUsers(filters?: { role?: string; status?: string; search?: string }): Promise<User[]> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    return newUser;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    // Mock implementation
    return {} as User;
  }

  async deleteUser(userId: string): Promise<void> {
    // Mock implementation
  }

  async bulkUpdateUsers(userIds: string[], updates: Partial<User>): Promise<void> {
    // Mock implementation
  }

  async exportUsers(format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
    const users = await this.getUsers();
    
    if (format === 'json') {
      return new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    }
    
    if (format === 'csv') {
      const csv = this.convertToCSV(users);
      return new Blob([csv], { type: 'text/csv' });
    }
    
    // PDF implementation would go here
    return new Blob(['PDF content'], { type: 'application/pdf' });
  }

  // Role Management
  async getRoles(): Promise<Role[]> {
    return this.roles;
  }

  async createRole(roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>): Promise<Role> {
    const newRole: Role = {
      ...roleData,
      id: Date.now().toString(),
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.roles.push(newRole);
    return newRole;
  }

  async updateRole(roleId: string, roleData: Partial<Role>): Promise<Role> {
    const index = this.roles.findIndex(r => r.id === roleId);
    if (index !== -1) {
      this.roles[index] = { ...this.roles[index], ...roleData, updatedAt: new Date().toISOString() };
      return this.roles[index];
    }
    throw new Error('Role not found');
  }

  async deleteRole(roleId: string): Promise<void> {
    const index = this.roles.findIndex(r => r.id === roleId);
    if (index !== -1) {
      this.roles.splice(index, 1);
    }
  }

  // Permission Management
  async getPermissions(): Promise<Permission[]> {
    return this.permissions;
  }

  async createPermission(permissionData: Omit<Permission, 'id' | 'createdAt'>): Promise<Permission> {
    const newPermission: Permission = {
      ...permissionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.permissions.push(newPermission);
    return newPermission;
  }

  // System Configuration
  async getSystemConfigs(): Promise<SystemConfig[]> {
    return this.systemConfigs;
  }

  async updateSystemConfig(configId: string, value: string, updatedBy: string): Promise<SystemConfig> {
    const index = this.systemConfigs.findIndex(c => c.id === configId);
    if (index !== -1) {
      this.systemConfigs[index] = {
        ...this.systemConfigs[index],
        value,
        updatedAt: new Date().toISOString(),
        updatedBy,
      };
      return this.systemConfigs[index];
    }
    throw new Error('Config not found');
  }

  async createSystemConfig(configData: Omit<SystemConfig, 'id' | 'updatedAt'>): Promise<SystemConfig> {
    const newConfig: SystemConfig = {
      ...configData,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
    };
    this.systemConfigs.push(newConfig);
    return newConfig;
  }

  // Audit Logs
  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    dateRange?: { start: string; end: string };
  }): Promise<AuditAction[]> {
    let logs = [...this.auditLogs];

    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }

    if (filters?.action) {
      logs = logs.filter(log => log.action.includes(filters.action!));
    }

    if (filters?.resource) {
      logs = logs.filter(log => log.resource === filters.resource);
    }

    if (filters?.dateRange) {
      logs = logs.filter(log => 
        log.timestamp >= filters.dateRange!.start && 
        log.timestamp <= filters.dateRange!.end
      );
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async logAuditAction(action: Omit<AuditAction, 'id' | 'timestamp'>): Promise<void> {
    const log: AuditAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.push(log);
  }

  // System Metrics
  async getSystemMetrics(): Promise<SystemMetrics> {
    return {
      totalUsers: 159,
      activeUsers: 42,
      totalSessions: 87,
      averageSessionDuration: 1847, // seconds
      totalQueries: 12543,
      errorRate: 0.02,
      systemUptime: 99.97,
      memoryUsage: 68.5,
      cpuUsage: 23.1,
      diskUsage: 45.8,
    };
  }

  // Backup Management
  async getBackups(): Promise<BackupInfo[]> {
    return [
      {
        id: '1',
        filename: 'backup_2024_01_19_full.sql',
        size: 1024 * 1024 * 50, // 50MB
        type: 'full',
        status: 'completed',
        createdAt: new Date().toISOString(),
        downloadUrl: '/api/backups/1/download',
      },
      {
        id: '2',
        filename: 'backup_2024_01_18_incremental.sql',
        size: 1024 * 1024 * 5, // 5MB
        type: 'incremental',
        status: 'completed',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        downloadUrl: '/api/backups/2/download',
      },
    ];
  }

  async createBackup(type: 'full' | 'incremental'): Promise<BackupInfo> {
    const backup: BackupInfo = {
      id: Date.now().toString(),
      filename: `backup_${new Date().toISOString().split('T')[0]}_${type}.sql`,
      size: 0,
      type,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    };

    // Simulate backup creation
    setTimeout(() => {
      backup.status = 'completed';
      backup.size = Math.random() * 1024 * 1024 * 100; // Random size up to 100MB
      backup.downloadUrl = `/api/backups/${backup.id}/download`;
    }, 3000);

    return backup;
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
}

export const adminService = new AdminService();