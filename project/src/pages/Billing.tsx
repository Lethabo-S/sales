import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { billingService } from '../services/billingService';
import { Plan, Subscription, PaymentMethod, Invoice, UsageAlert } from '../types/billing';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import PaymentMethodList from '../components/billing/PaymentMethodList';

const Billing: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [alerts, setAlerts] = useState<UsageAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    if (!user) return;

    try {
      const [plansData, subData, paymentData, invoiceData, alertData] = await Promise.all([
        billingService.getPlans(),
        billingService.getCurrentSubscription(user.id),
        billingService.getPaymentMethods(user.id),
        billingService.getInvoices(user.id),
        billingService.getUsageAlerts(user.id),
      ]);

      setPlans(plansData);
      setSubscription(subData);
      setPaymentMethods(paymentData);
      setInvoices(invoiceData);
      setAlerts(alertData);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanUpgrade = async (planId: string) => {
    setSelectedPlan(planId);
    try {
      // Handle plan upgrade logic
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setSelectedPlan(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'past_due':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const getUsagePercentage = () => {
    if (!subscription) return 0;
    if (subscription.usage.limit === -1) return 0;
    return (subscription.usage.queries / subscription.usage.limit) * 100;
  };

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
            Billing & Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription, billing, and usage
          </p>
        </div>
      </motion.div>

      {/* Usage Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
            >
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {alert.message}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Current usage: {alert.currentUsage}% of limit
                  </p>
                </div>
                <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Current Subscription */}
      {subscription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Subscription
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
              {subscription.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {plans.find(p => p.id === subscription.planId)?.name || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Next Billing</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usage This Month</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {subscription.usage.queries.toLocaleString()}
                  {subscription.usage.limit !== -1 && ` / ${subscription.usage.limit.toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Available Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 ${
                plan.popular
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  /{plan.interval}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={subscription?.planId === plan.id ? 'outline' : 'primary'}
                className="w-full"
                disabled={subscription?.planId === plan.id || selectedPlan === plan.id}
                loading={selectedPlan === plan.id}
                onClick={() => handlePlanUpgrade(plan.id)}
              >
                {subscription?.planId === plan.id ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Methods
          </h2>
          <Button variant="outline" size="sm">
            Add Payment Method
          </Button>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <CreditCardIcon className="w-6 h-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {method.type === 'card' ? `**** **** **** ${method.last4}` : 'PayPal'}
                  </p>
                  {method.type === 'card' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {method.brand?.toUpperCase()} • Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  )}
                </div>
                {method.isDefault && (
                  <span className="ml-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Invoice History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Invoice History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Invoice
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {invoice.number}
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    ${invoice.amount} {invoice.currency}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : invoice.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                      <DocumentArrowDownIcon className="w-4 h-4 inline mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <PaymentMethodList
          onAddMethod={() => console.log('Add payment method')}
          onEditMethod={(method) => console.log('Edit payment method:', method)}
        />
      </motion.div>
    </div>
  );
};

export default Billing;