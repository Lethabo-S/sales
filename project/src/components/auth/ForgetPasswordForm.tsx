import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ForgotPasswordData {
  email: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
});

const ForgotPasswordForm: React.FC = () => {
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limited'>('idle');
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(schema),
  });

  const checkRateLimit = (): boolean => {
    const now = new Date();
    const maxAttempts = 3;
    const cooldownMinutes = 15;

    if (lastAttemptTime) {
      const timeDiff = (now.getTime() - lastAttemptTime.getTime()) / (1000 * 60);
      if (timeDiff < cooldownMinutes && attemptCount >= maxAttempts) {
        return false;
      }
      if (timeDiff >= cooldownMinutes) {
        setAttemptCount(0);
      }
    }

    return attemptCount < maxAttempts;
  };

  const getRemainingCooldownTime = (): number => {
    if (!lastAttemptTime) return 0;
    const now = new Date();
    const timeDiff = (now.getTime() - lastAttemptTime.getTime()) / (1000 * 60);
    return Math.max(0, 15 - timeDiff);
  };

  const onSubmit = async (data: ForgotPasswordData) => {
    if (!checkRateLimit()) {
      setSubmitStatus('rate-limited');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await resetPassword(data.email);
      setSubmitStatus('success');
      setAttemptCount(prev => prev + 1);
      setLastAttemptTime(new Date());
    } catch (error) {
      console.error('Password reset failed:', error);
      setSubmitStatus('error');
      setAttemptCount(prev => prev + 1);
      setLastAttemptTime(new Date());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = () => {
    const email = getValues('email');
    if (email && checkRateLimit()) {
      onSubmit({ email });
    }
  };

  const remainingCooldown = getRemainingCooldownTime();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <EnvelopeIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Success State */}
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                Check your email
              </h3>
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
              <p>
                We've sent a password reset link to <strong>{getValues('email')}</strong>
              </p>
              <p>
                If you don't see the email in your inbox, check your spam folder.
              </p>
              <p className="font-medium">
                The reset link will expire in 1 hour for security reasons.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendEmail}
                disabled={!checkRateLimit()}
                className="w-full"
              >
                {remainingCooldown > 0 
                  ? `Resend in ${Math.ceil(remainingCooldown)} minutes`
                  : 'Resend email'
                }
              </Button>
              <Link
                to="/login"
                className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to sign in
              </Link>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex items-center">
              <ExclamationCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Unable to send reset email
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Please check your email address and try again. If the problem persists, contact support.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rate Limited State */}
        {submitStatus === 'rate-limited' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
          >
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Too many attempts
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Please wait {Math.ceil(remainingCooldown)} minutes before trying again.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        {submitStatus !== 'success' && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
                disabled={submitStatus === 'rate-limited'}
              >
                {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to sign in
              </Link>
            </div>
          </form>
        )}

        {/* Security Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Security Information
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Reset links expire after 1 hour</li>
            <li>• You can only request 3 resets per 15 minutes</li>
            <li>• Check your spam folder if you don't see the email</li>
            <li>• Contact support if you continue having issues</li>
          </ul>
        </div>

        {/* Help Links */}
        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Need help?{' '}
            <Link
              to="/help"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;