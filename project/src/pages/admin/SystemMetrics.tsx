import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CpuChipIcon,
  CircleStackIcon,
  ServerIcon,
  ClockIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { SystemMetrics, BackupInfo } from '../../types/admin';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const SystemMetricsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [metricsData, backupsData] = await Promise.all([
        adminService.getSystemMetrics(),
        adminService.getBackups(),
      ]);
      setMetrics(metricsData);
      setBackups(backupsData);
    } catch (error) {
      console.error('Failed to load system data:', error);
      toast.error('Failed to load system metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    setCreatingBackup(true);
    try {
      const backup = await adminService.createBackup(type);
      setBackups(prev => [backup, ...prev]);
      toast.success(`${type} backup started successfully`);
    } catch (error) {
      console.error('Failed to create backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setCreatingBackup(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
    if (value >= thresholds.warning) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
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
            System Metrics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor system performance and health
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          className="flex items-center"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </motion.div>

      {/* System Health Overview */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <CpuChipIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  CPU Usage
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {metrics.cpuUsage.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.cpuUsage > 80 ? 'bg-red-500' : 
                    metrics.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${metrics.cpuUsage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CircleStackIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Memory Usage
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {metrics.memoryUsage.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.memoryUsage > 85 ? 'bg-red-500' : 
                    metrics.memoryUsage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${metrics.memoryUsage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <ServerIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Disk Usage
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {metrics.diskUsage.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.diskUsage > 90 ? 'bg-red-500' : 
                    metrics.diskUsage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${metrics.diskUsage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Uptime
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {metrics.systemUptime.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last 30 days
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Metrics */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UsersIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {metrics.totalUsers.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {metrics.activeUsers.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {metrics.totalSessions.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Session Duration</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Math.round(metrics.averageSessionDuration / 60)}m
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Queries</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {metrics.totalQueries.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                <span className={`text-lg font-semibold ${
                  metrics.errorRate > 0.05 ? 'text-red-600' : 
                  metrics.errorRate > 0.02 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {(metrics.errorRate * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">System Status</span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Backup Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Backup Management
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCreateBackup('incremental')}
              loading={creatingBackup}
            >
              Incremental Backup
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCreateBackup('full')}
              loading={creatingBackup}
            >
              Full Backup
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Filename
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Type
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Size
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Created
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {backup.filename}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      backup.type === 'full' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {backup.type}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {formatBytes(backup.size)}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      backup.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : backup.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {backup.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {new Date(backup.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    {backup.downloadUrl && backup.status === 'completed' && (
                      <a
                        href={backup.downloadUrl}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemMetricsPage;