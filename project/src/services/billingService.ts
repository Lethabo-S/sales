import { Subscription, Plan, PaymentMethod, Invoice, UsageAlert } from '../types/billing';

class BillingService {
  private plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      price: 9.99,
      currency: 'USD',
      interval: 'month',
      features: [
        '1,000 AI queries per month',
        'Basic analytics',
        'Email support',
        '5 team members',
      ],
      limits: {
        queries: 1000,
        users: 5,
        storage: 1, // GB
      },
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For growing businesses',
      price: 29.99,
      currency: 'USD',
      interval: 'month',
      features: [
        '10,000 AI queries per month',
        'Advanced analytics',
        'Priority support',
        '25 team members',
        'Custom integrations',
      ],
      limits: {
        queries: 10000,
        users: 25,
        storage: 10,
      },
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 99.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Unlimited AI queries',
        'Custom analytics',
        '24/7 phone support',
        'Unlimited team members',
        'SSO integration',
        'Dedicated account manager',
      ],
      limits: {
        queries: -1, // unlimited
        users: -1,
        storage: 100,
      },
    },
  ];

  private mockSubscription: Subscription = {
    id: 'sub_123',
    userId: '1',
    planId: 'professional',
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    usage: {
      queries: 2450,
      limit: 10000,
    },
  };

  async getPlans(): Promise<Plan[]> {
    return this.plans;
  }

  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    return this.mockSubscription;
  }

  async upgradePlan(userId: string, planId: string): Promise<Subscription> {
    // Mock upgrade logic
    const updatedSubscription = {
      ...this.mockSubscription,
      planId,
    };
    return updatedSubscription;
  }

  async cancelSubscription(userId: string, immediate: boolean = false): Promise<void> {
    // Mock cancellation logic
    console.log(`Cancelling subscription for user ${userId}, immediate: ${immediate}`);
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return [
      {
        id: 'pm_123',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
      {
        id: 'pm_456',
        type: 'paypal',
        isDefault: false,
      },
    ];
  }

  async addPaymentMethod(userId: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    return {
      ...paymentMethod,
      id: `pm_${Date.now()}`,
    };
  }

  async getInvoices(userId: string): Promise<Invoice[]> {
    return [
      {
        id: 'inv_123',
        number: 'INV-2024-001',
        amount: 29.99,
        currency: 'USD',
        status: 'paid',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        downloadUrl: '/invoices/inv_123.pdf',
      },
      {
        id: 'inv_124',
        number: 'INV-2024-002',
        amount: 29.99,
        currency: 'USD',
        status: 'pending',
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        downloadUrl: '/invoices/inv_124.pdf',
      },
    ];
  }

  async getUsageAlerts(userId: string): Promise<UsageAlert[]> {
    return [
      {
        id: 'alert_1',
        type: 'approaching_limit',
        threshold: 80,
        currentUsage: 85,
        message: 'You have used 85% of your monthly query limit',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async calculateCost(queries: number, planId: string): Promise<number> {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) return 0;

    if (plan.limits.queries === -1) return plan.price; // unlimited
    if (queries <= plan.limits.queries) return plan.price;

    // Calculate overage
    const overage = queries - plan.limits.queries;
    const overageRate = 0.01; // $0.01 per extra query
    return plan.price + (overage * overageRate);
  }
}

export const billingService = new BillingService();