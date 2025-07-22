import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCardIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { billingService } from '../../services/billingService';
import { PaymentMethod } from '../../types/billing';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface PaymentMethodListProps {
  onAddMethod?: () => void;
  onEditMethod?: (method: PaymentMethod) => void;
}

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  onAddMethod,
  onEditMethod,
}) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    if (!user) return;

    try {
      const methods = await billingService.getPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      // Update local state optimistically
      setPaymentMethods(prev =>
        prev.map(method => ({
          ...method,
          isDefault: method.id === methodId,
        }))
      );

      // In real implementation, call API to update default method
      toast.success('Default payment method updated');
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      toast.error('Failed to update default payment method');
      // Revert optimistic update
      loadPaymentMethods();
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    setDeletingId(methodId);
    try {
      // In real implementation, call API to delete method
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
      toast.success('Payment method deleted successfully');
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      toast.error('Failed to delete payment method');
    } finally {
      setDeletingId(null);
    }
  };

  const getPaymentMethodIcon = (type: string, brand?: string) => {
    if (type === 'card') {
      const brandLower = brand?.toLowerCase();
      switch (brandLower) {
        case 'visa':
          return (
            <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
          );
        case 'mastercard':
          return (
            <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">MC</span>
            </div>
          );
        case 'amex':
          return (
            <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">AMEX</span>
            </div>
          );
        default:
          return <CreditCardIcon className="w-6 h-6 text-gray-400" />;
      }
    }
    
    if (type === 'paypal') {
      return (
        <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">PP</span>
        </div>
      );
    }

    return <CreditCardIcon className="w-6 h-6 text-gray-400" />;
  };

  const formatExpiryDate = (month?: number, year?: number) => {
    if (!month || !year) return '';
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Methods
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your saved payment methods
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddMethod}
          className="flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Method
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No payment methods
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add a payment method to get started with your subscription.
          </p>
          <Button variant="primary" onClick={onAddMethod}>
            Add Payment Method
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`
                  flex items-center justify-between p-4 border rounded-lg transition-colors
                  ${method.isDefault 
                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  {getPaymentMethodIcon(method.type, method.brand)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {method.type === 'card' 
                          ? `**** **** **** ${method.last4}` 
                          : 'PayPal Account'
                        }
                      </p>
                      {method.isDefault && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                    {method.type === 'card' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {method.brand?.toUpperCase()} • Expires {formatExpiryDate(method.expiryMonth, method.expiryYear)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditMethod?.(method)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMethod(method.id)}
                    loading={deletingId === method.id}
                    disabled={method.isDefault}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {paymentMethods.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Payment Method Security
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Your payment information is encrypted and securely stored. We never store your full card details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodList;