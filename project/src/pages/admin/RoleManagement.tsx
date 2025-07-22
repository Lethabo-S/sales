import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { Role, Permission } from '../../types/admin';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const RoleManagement: React.FC = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        adminService.getRoles(),
        adminService.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load roles and permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      const selectedPermissions = permissions.filter(p => formData.permissions.includes(p.id));
      const newRole = await adminService.createRole({
        name: formData.name,
        description: formData.description,
        permissions: selectedPermissions,
        isDefault: false,
        isSystemRole: false,
      });
      setRoles(prev => [...prev, newRole]);
      setShowCreateModal(false);
      resetForm();
      toast.success('Role created successfully');
    } catch (error) {
      console.error('Failed to create role:', error);
      toast.error('Failed to create role');
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      const selectedPermissions = permissions.filter(p => formData.permissions.includes(p.id));
      const updatedRole = await adminService.updateRole(editingRole.id, {
        name: formData.name,
        description: formData.description,
        permissions: selectedPermissions,
      });
      setRoles(prev => prev.map(r => r.id === editingRole.id ? updatedRole : r));
      setEditingRole(null);
      resetForm();
      toast.success('Role updated successfully');
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (role.isSystemRole) {
      toast.error('Cannot delete system roles');
      return;
    }

    if (role.userCount > 0) {
      toast.error('Cannot delete role with assigned users');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      await adminService.deleteRole(roleId);
      setRoles(prev => prev.filter(r => r.id !== roleId));
      toast.success('Role deleted successfully');
    } catch (error) {
      console.error('Failed to delete role:', error);
      toast.error('Failed to delete role');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(p => p.id),
    });
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
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
            Role Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage roles and permissions for your organization
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </motion.div>

      {/* Roles Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {role.name}
                  </h3>
                  {role.isSystemRole && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                      System Role
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(role)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                {!role.isSystemRole && (
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {role.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                {role.userCount} users
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {role.permissions.length} permissions
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Permissions:</div>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((permission) => (
                  <span
                    key={permission.id}
                    className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded"
                  >
                    {permission.name}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingRole) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingRole ? 'Edit Role' : 'Create Role'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingRole(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Role Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter role name"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Permissions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {permission.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {permission.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingRole(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={editingRole ? handleUpdateRole : handleCreateRole}
                disabled={!formData.name.trim() || !formData.description.trim()}
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;