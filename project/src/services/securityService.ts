import { AuditLog, SecuritySettings, TwoFactorSetup,  } from '../types/security';
import QRCode from 'qrcode';

class SecurityService {
  [x: string]: any;
  private auditLogs: AuditLog[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Admin User',
      action: 'login',
      resource: 'authentication',
      details: { method: 'password' },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date().toISOString(),
      severity: 'low',
    },
    {
      id: '2',
      userId: '1',
      userName: 'Admin User',
      action: 'user_role_changed',
      resource: 'user_management',
      details: { targetUserId: '2', oldRole: 'user', newRole: 'moderator' },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: 'medium',
    },
  ];

  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    dateRange?: { start: string; end: string };
  }): Promise<AuditLog[]> {
    let logs = [...this.auditLogs];

    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }

    if (filters?.action) {
      logs = logs.filter(log => log.action.includes(filters.action!));
    }

    if (filters?.dateRange) {
      logs = logs.filter(log => 
        log.timestamp >= filters.dateRange!.start && 
        log.timestamp <= filters.dateRange!.end
      );
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async logAction(action: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const log: AuditLog = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.push(log);
  }

  // async getSecuritySettings(userId: string): Promise<SecuritySettings> {
  //   return {
  //     twoFactorEnabled: false,
  //     passwordlessEnabled: false,
  //     sessionTimeout: 60,
  //     allowedIpRanges: [],
  //     requirePasswordChange: false,
  //     passwordMinLength: 8,
  //     passwordRequireSpecialChars: true,
  //   };
  // }

  // async updateSecuritySettings(userId: string, settings: Partial<SecuritySettings>): Promise<void> {
  //   // Mock update
  //   console.log('Updating security settings for user:', userId, settings);
  // }

  // async setupTwoFactor(userId: string): Promise<TwoFactorSetup> {
  //   const secret = this.generateSecret();
  //   const qrCode = await QRCode.toDataURL(`otpauth://totp/MyApp:user@example.com?secret=${secret}&issuer=MyApp`);
    
  //   return {
  //     secret,
  //     qrCode,
  //     backupCodes: this.generateBackupCodes(),
  //   };
  // }

  // async verifyTwoFactor(userId: string, token: string): Promise<boolean> {
  //   // Mock verification - in real app, use libraries like speakeasy
  //   return token === '123456';
  // }

  // async getSessions(userId: string): Promise<Session[]> {
  //   return [
  //     {
  //       id: 'session_1',
  //       userId,
  //       device: 'Chrome on Windows',
  //       location: 'New York, NY',
  //       ipAddress: '192.168.1.1',
  //       lastActivity: new Date().toISOString(),
  //       isCurrentSession: true,
  //     },
  //     {
  //       id: 'session_2',
  //       userId,
  //       device: 'Safari on iPhone',
  //       location: 'San Francisco, CA',
  //       ipAddress: '192.168.1.2',
  //       lastActivity: new Date(Date.now() - 3600000).toISOString(),
  //       isCurrentSession: false,
  //     },
  //   ];
  // }

  // async revokeSession(sessionId: string): Promise<void> {
  //   console.log('Revoking session:', sessionId);
  // }

  // async revokeAllSessions(userId: string, exceptCurrent: boolean = true): Promise<void> {
  //   console.log('Revoking all sessions for user:', userId, 'except current:', exceptCurrent);
  // }
  async getSecuritySettings(userId: string): Promise<SecuritySettings> {
    // Actually use the userId parameter
    const userSpecificSettings: Partial<SecuritySettings> = userId === '1' ? {
      twoFactorEnabled: true,
      sessionTimeout: 30
    } : {};

    return {
      twoFactorEnabled: false,
      passwordlessEnabled: false,
      sessionTimeout: 60,
      allowedIpRanges: [],
      requirePasswordChange: false,
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      ...userSpecificSettings
    };
  }

  async updateSecuritySettings(userId: string, settings: Partial<SecuritySettings>): Promise<void> {
    await this.logAction({
      userId,
      userName: 'System',
      action: 'security_settings_updated',
      resource: 'security',
      details: settings,
      ipAddress: '127.0.0.1',
      userAgent: 'SecurityService',
      severity: 'high'
    });
  }

  async setupTwoFactor(userId: string): Promise<TwoFactorSetup> {
    const secret = this.generateSecret();
    const qrCode = await QRCode.toDataURL(
      `otpauth://totp/MyApp:${userId}?secret=${secret}&issuer=MyApp`
    );
    
    await this.logAction({
      userId,
      userName: 'System',
      action: 'two_factor_setup_initiated',
      resource: 'security',
      details: { method: 'TOTP' },
      ipAddress: '127.0.0.1',
      userAgent: 'SecurityService',
      severity: 'high'
    });

    return {
      secret,
      qrCode,
      backupCodes: this.generateBackupCodes(),
    };
  }

  async verifyTwoFactor(userId: string, token: string): Promise<boolean> {
    const isValid = token === '123456'; // In real app, verify against stored secret
    
    await this.logAction({
      userId,
      userName: 'System',
      action: isValid ? 'two_factor_verified' : 'two_factor_failed',
      resource: 'security',
      details: { token },
      ipAddress: '127.0.0.1',
      userAgent: 'SecurityService',
      severity: isValid ? 'medium' : 'high'
    });

    return isValid;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.logAction({
      userId: 'system',
      userName: 'System',
      action: 'session_revoked',
      resource: 'authentication',
      details: { sessionId },
      ipAddress: '127.0.0.1',
      userAgent: 'SecurityService',
      severity: 'medium'
    });
  }

  async revokeAllSessions(userId: string, exceptCurrent: boolean = true): Promise<void> {
    await this.logAction({
      userId,
      userName: 'System',
      action: 'all_sessions_revoked',
      resource: 'authentication',
      details: { exceptCurrent },
      ipAddress: '127.0.0.1',
      userAgent: 'SecurityService',
      severity: 'high'
    });
  }

  private generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }
}

export const securityService = new SecurityService();