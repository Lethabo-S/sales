import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const [notificationSettings, setNotificationSettings] = useState(
    user?.preferences.notifications || {
      email: true,
      push: true,
      marketing: false,
      security: true,
    }
  );

  const [privacySettings, setPrivacySettings] = useState(
    user?.preferences.privacy || {
      profileVisibility: 'public' as const,
      showOnlineStatus: true,
      allowDirectMessages: true,
    }
  );

  const tabs = [
    { name: 'Profile', icon: UserIcon },
    { name: 'Notifications', icon: BellIcon },
    { name: 'Privacy', icon: ShieldCheckIcon },
    { name: 'Appearance', icon: PaintBrushIcon },
    { name: 'Security', icon: KeyIcon },
  ];

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({
        ...user!,
        ...profileData,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      await updateProfile({
        ...user!,
        preferences: {
          ...user!.preferences,
          notifications: notificationSettings,
        },
      });
    } catch (error) {
      console.error('Failed to update notifications:', error);
    }
  };

  const handlePrivacyUpdate = async () => {
    try {
      await updateProfile({
        ...user!,
        preferences: {
          ...user!.preferences,
          privacy: privacySettings,
        },
      });
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
    }
  };

  const handleThemeUpdate = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    try {
      await updateProfile({
        ...user!,
        preferences: {
          ...user!.preferences,
          theme: newTheme,
        },
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 dark:border-gray-700">
              <Tab.List className="flex flex-col p-4 space-y-1">
                {tabs.map((tab, index) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                        selected
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            {/* Content */}
            <div className="flex-1">
              <Tab.Panels>
                {/* Profile Tab */}
                <Tab.Panel className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Profile Information
                      </h3>
                      <div className="space-y-4">
                        <Input
                          label="Full Name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, name: e.target.value })
                          }
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({ ...profileData, email: e.target.value })
                          }
                        />
                        <Input
                          label="Avatar URL"
                          value={profileData.avatar}
                          onChange={(e) =>
                            setProfileData({ ...profileData, avatar: e.target.value })
                          }
                          helperText="Enter a URL for your profile picture"
                        />
                      </div>
                      <div className="mt-6">
                        <Button onClick={handleProfileUpdate} variant="primary">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Notifications Tab */}
                <Tab.Panel className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Notification Preferences
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(notificationSettings).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()} Notifications
                              </label>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receive {key} notifications
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  [key]: e.target.checked,
                                })
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Button onClick={handleNotificationUpdate} variant="primary">
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Privacy Tab */}
                <Tab.Panel className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Privacy Settings
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Visibility
                          </label>
                          <select
                            value={privacySettings.profileVisibility}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                profileVisibility: e.target.value as 'public' | 'private',
                              })
                            }
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Show Online Status
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Let others see when you're online
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showOnlineStatus}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                showOnlineStatus: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Allow Direct Messages
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Allow other users to send you direct messages
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.allowDirectMessages}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                allowDirectMessages: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button onClick={handlePrivacyUpdate} variant="primary">
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Appearance Tab */}
                <Tab.Panel className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Theme Preferences
                      </h3>
                      <div className="space-y-3">
                        {[
                          { value: 'light', label: 'Light Mode', description: 'Use light theme' },
                          { value: 'dark', label: 'Dark Mode', description: 'Use dark theme' },
                          { value: 'system', label: 'System', description: 'Follow system preference' },
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              theme === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleThemeUpdate(option.value as any)}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                checked={theme === option.value}
                                onChange={() => handleThemeUpdate(option.value as any)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <div className="ml-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {option.label}
                                </label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Security Tab */}
                <Tab.Panel className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Security Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Change Password
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Update your password to keep your account secure.
                          </p>
                          <Button variant="outline" size="sm" className="mt-3">
                            Change Password
                          </Button>
                        </div>

                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Add an extra layer of security to your account.
                          </p>
                          <Button variant="outline" size="sm" className="mt-3">
                            Enable 2FA
                          </Button>
                        </div>

                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            Permanently delete your account and all associated data.
                          </p>
                          <Button variant="danger" size="sm" className="mt-3">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </div>
        </Tab.Group>
      </motion.div>
    </div>
  );
};

export default Settings;