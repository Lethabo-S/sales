import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import QRCode from 'qrcode';
import { securityService } from '../services/securityService';
import { SecuritySettings, TwoFactorSetup, Session, AuditLog } from '../types/security';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Security: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = async () => {
    if (!user) return;

    try {
      const [settingsData, sessionsData, logsData] = await Promise.all([
        securityService.getSecuritySettings(user.id),
        securityService.getSessions(user.id),
        securityService.getAuditLogs({ userId: user.id }),
      ]);

      setSettings(settingsData);
      setSessions(sessionsData);
      setAuditLogs(logsData.slice(0, 10)); // Show last 10 logs
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupTwoFactor = async () => {
    if (!user) return;

    try {
      const setup = await securityService.setupTwoFactor(user.id);
      setTwoFactorSetup(setup);
    } catch (error) {
      console.error('Failed to setup 2FA:', error);
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (!user || !verificationCode) return;

    try {
      const isValid = await securityService.verifyTwoFactor(user.id, verificationCode);
      if (isValid) {
        setSettings(prev => prev ? { ...prev, twoFactorEnabled: true } : null);
        setTwoFactorSetup(null);
        setVerificationCode('');
        setShowBackupCodes(true);
      } else {
        alert('Invalid verification code');
      }
    } catch (error) {
      console.error('Failed to verify 2FA:', error);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await securityService.revokeSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!user) return;

    try {
      await securityService.revokeAllSessions(user.id);
      setSessions(prev => prev.filter(s => s.isCurrentSession));
    } catch (error) {
      console.error('Failed to revoke all sessions:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account security and authentication
          </p>
        </div>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {settings?.twoFactorEnabled ? (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Enabled
              </span>
            ) : (
              <span className="flex items-center text-red-600 dark:text-red-400">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                Disabled
              </span>
            )}
          </div>
        </div>

        {!settings?.twoFactorEnabled && !twoFactorSetup && (
          <Button onClick={handleSetupTwoFactor} variant="primary">
            Enable Two-Factor Authentication
          </Button>
        )}

        {twoFactorSetup && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Scan this QR code with your authenticator app:
              </p>
              <div className="inline-block p-4 bg-white rounded-lg">
                <QRCode value={twoFactorSetup.qrCode} size={200} />
              </div>
            </div>
            <div className="max-w-md mx-auto">
              <Input
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <Button
                onClick={handleVerifyTwoFactor}
                variant="primary"
                className="w-full mt-4"
                disabled={verificationCode.length !== 6}
              >
                Verify and Enable
              </Button>
            </div>
          </div>
        )}

        {showBackupCodes && twoFactorSetup && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Backup Codes
            </h3>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-3">
              Save these codes in a safe place. You can use them to access your account if you lose your phone.
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {twoFactorSetup.backupCodes.map((code, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-2 rounded border">
                  {code}
                </div>
              ))}
            </div>
            <Button
              onClick={() => setShowBackupCodes(false)}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              I've saved these codes
            </Button>
          </div>
        )}
      </motion.div>

      {/* Active Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Active Sessions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your active login sessions
              </p>
            </div>
          </div>
          <Button onClick={handleRevokeAllSessions} variant="outline" size="sm">
            Revoke All Sessions
          </Button>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <ComputerDesktopIcon className="w-6 h-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.device}
                    {session.isCurrentSession && (
                      <span className="ml-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.location} • {session.ipAddress}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last active: {new Date(session.lastActivity).toLocaleString()}
                  </p>
                </div>
              </div>
              {!session.isCurrentSession && (
                <Button
                  onClick={() => handleRevokeSession(session.id)}
                  variant="ghost"
                  size="sm"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Settings */}
      {settings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-4">
            <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Preferences
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure your security settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Passwordless Login
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use magic links instead of passwords
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.passwordlessEnabled}
                onChange={(e) => setSettings({ ...settings, passwordlessEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Session Timeout
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically log out after inactivity
                </p>
              </div>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={240}>4 hours</option>
                <option value={480}>8 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Require Password Change
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Force password change on next login
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.requirePasswordChange}
                onChange={(e) => setSettings({ ...settings, requirePasswordChange: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Security Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Security Activity
        </h2>
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {log.ipAddress} • {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                {log.severity}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Security;