export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordlessEnabled: boolean;
  sessionTimeout: number; // minutes
  allowedIpRanges: string[];
  requirePasswordChange: boolean;
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActivity: string;
  isCurrentSession: boolean;
}