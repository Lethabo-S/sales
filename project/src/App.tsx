import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

import AIAssistant from './components/ai/AIAssistant';
import Button from './components/ui/Button';

// Pages
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import NotificationCenter from './components/notifications/NotificationCenter';
import Settings from './pages/Settings';
import Help from './pages/Help';
import UserManagement from './pages/admin/UserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import SystemConfig from './pages/admin/SystemConfig';
import AuditLogs from './pages/admin/AuditLogs';
import SystemMetrics from './pages/admin/SystemMetrics';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';
import Security from './pages/Security';
import ForgotPasswordForm from './components/auth/ForgetPasswordForm';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />
        } />
        <Route path="/forgot-password" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPasswordForm />
        } />
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="billing" element={<Billing />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="security" element={<Security />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="admin/users" element={
            <ProtectedRoute adminOnly>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/roles" element={
            <ProtectedRoute adminOnly>
              <RoleManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/config" element={
            <ProtectedRoute adminOnly>
              <SystemConfig />
            </ProtectedRoute>
          } />
          <Route path="admin/audit" element={
            <ProtectedRoute adminOnly>
              <AuditLogs />
            </ProtectedRoute>
          } />
          <Route path="admin/metrics" element={
            <ProtectedRoute adminOnly>
              <SystemMetrics />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>

      {/* AI Assistant Toggle Button */}
      {isAuthenticated && (
        <>
          <Button
            onClick={() => setIsAIAssistantOpen(true)}
            variant="primary"
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-40"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </Button>

          <AnimatePresence>
            {isAIAssistantOpen && (
              <AIAssistant
                isOpen={isAIAssistantOpen}
                onClose={() => setIsAIAssistantOpen(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;