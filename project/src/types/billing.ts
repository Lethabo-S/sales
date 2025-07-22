export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  usage: {
    queries: number;
    limit: number;
  };
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    queries: number;
    users: number;
    storage: number;
  };
  popular?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'crypto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  dueDate: string;
  downloadUrl: string;
}

export interface UsageAlert {
  id: string;
  type: 'overage' | 'approaching_limit' | 'unusual_activity';
  threshold: number;
  currentUsage: number;
  message: string;
  createdAt: string;
}