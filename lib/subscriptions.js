import { supabase } from './supabase';

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'Basic access to content discovery',
    features: [
      'Access to basic content',
      'Limited search results',
      'Community support'
    ],
    limits: {
      searches: 10,
      downloads: 5,
      api_calls: 100
    }
  },
  STANDARD: {
    id: 'standard',
    name: 'Standard',
    price: 9.99,
    interval: 'month',
    description: 'Enhanced content discovery and recommendations',
    features: [
      'Unlimited content access',
      'Advanced search filters',
      'AI-powered recommendations',
      'Priority support',
      'Export capabilities'
    ],
    limits: {
      searches: 1000,
      downloads: 100,
      api_calls: 10000
    }
  },
  PRO: {
    id: 'pro',
    name: 'Professional',
    price: 29.99,
    interval: 'month',
    description: 'Professional tools for content creators and researchers',
    features: [
      'Everything in Standard',
      'Custom scraping tools',
      'Advanced analytics',
      'API access',
      'White-label options',
      'Dedicated support'
    ],
    limits: {
      searches: 10000,
      downloads: 1000,
      api_calls: 100000
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    interval: 'month',
    description: 'Enterprise-grade content discovery platform',
    features: [
      'Everything in Professional',
      'Custom integrations',
      'Advanced security',
      'SLA guarantees',
      'On-premise options',
      '24/7 support'
    ],
    limits: {
      searches: 100000,
      downloads: 10000,
      api_calls: 1000000
    }
  }
};

export class SubscriptionManager {
  constructor() {
    this.isConnected = false;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const { data, error } = await supabase.from('notebooks').select('count').limit(1);
      this.isConnected = !error;
    } catch (error) {
      this.isConnected = false;
      console.warn('Subscription Manager: Running in demo mode');
    }
  }

  getStatus() {
    return {
      supabase: this.isConnected ? 'connected' : 'demo',
      billing: this.isConnected ? 'functional' : 'demo',
      plans: 'available'
    };
  }

  // Get user's current subscription
  async getUserSubscription(userId) {
    if (!this.isConnected) {
      return this.demoUserSubscription(userId);
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || {
        user_id: userId,
        plan_id: 'free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return this.demoUserSubscription(userId);
    }
  }

  // Create or update subscription
  async createSubscription(userId, planId, paymentMethodId = null) {
    if (!this.isConnected) {
      return this.demoCreateSubscription(userId, planId);
    }

    try {
      const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()];
      if (!plan) {
        throw new Error(`Invalid plan: ${planId}`);
      }

      const subscription = {
        user_id: userId,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
        payment_method_id: paymentMethodId
      };

      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert(subscription)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return this.demoCreateSubscription(userId, planId);
    }
  }

  // Cancel subscription
  async cancelSubscription(userId) {
    if (!this.isConnected) {
      return this.demoCancelSubscription(userId);
    }

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true, message: 'Subscription will be cancelled at the end of the current period' };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return this.demoCancelSubscription(userId);
    }
  }

  // Reactivate subscription
  async reactivateSubscription(userId) {
    if (!this.isConnected) {
      return this.demoReactivateSubscription(userId);
    }

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          cancel_at_period_end: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true, message: 'Subscription reactivated successfully' };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      return this.demoReactivateSubscription(userId);
    }
  }

  // Get subscription usage
  async getSubscriptionUsage(userId) {
    if (!this.isConnected) {
      return this.demoUsage(userId);
    }

    try {
      const subscription = await this.getUserSubscription(userId);
      const plan = SUBSCRIPTION_PLANS[subscription.plan_id.toUpperCase()];

      // Get usage from various tables
      const { data: searches } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', 'search')
        .gte('created_at', subscription.current_period_start);

      const { data: downloads } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', 'download')
        .gte('created_at', subscription.current_period_start);

      const { data: apiCalls } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', 'api_call')
        .gte('created_at', subscription.current_period_start);

      return {
        plan: plan,
        usage: {
          searches: searches?.length || 0,
          downloads: downloads?.length || 0,
          api_calls: apiCalls?.length || 0
        },
        limits: plan.limits,
        percentage: {
          searches: Math.min((searches?.length || 0) / plan.limits.searches * 100, 100),
          downloads: Math.min((downloads?.length || 0) / plan.limits.downloads * 100, 100),
          api_calls: Math.min((apiCalls?.length || 0) / plan.limits.api_calls * 100, 100)
        }
      };
    } catch (error) {
      console.error('Error getting subscription usage:', error);
      return this.demoUsage(userId);
    }
  }

  // Check if user can perform action
  async canPerformAction(userId, action) {
    const usage = await this.getSubscriptionUsage(userId);
    const currentUsage = usage.usage[action] || 0;
    const limit = usage.limits[action] || 0;

    return currentUsage < limit;
  }

  // Track user activity
  async trackActivity(userId, action, metadata = {}) {
    if (!this.isConnected) {
      console.log(`Demo: Tracking ${action} for user ${userId}`);
      return true;
    }

    try {
      const { error } = await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          activity_type: action,
          metadata,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error tracking activity:', error);
      return false;
    }
  }

  // Demo functions
  demoUserSubscription(userId) {
    return {
      user_id: userId,
      plan_id: 'standard',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: false
    };
  }

  demoCreateSubscription(userId, planId) {
    return {
      user_id: userId,
      plan_id: planId,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: false
    };
  }

  demoCancelSubscription(userId) {
    return { success: true, message: 'Subscription will be cancelled at the end of the current period' };
  }

  demoReactivateSubscription(userId) {
    return { success: true, message: 'Subscription reactivated successfully' };
  }

  demoUsage(userId) {
    const plan = SUBSCRIPTION_PLANS.STANDARD;
    return {
      plan: plan,
      usage: {
        searches: 45,
        downloads: 12,
        api_calls: 234
      },
      limits: plan.limits,
      percentage: {
        searches: 4.5,
        downloads: 12,
        api_calls: 2.34
      }
    };
  }
}

export const subscriptionManager = new SubscriptionManager();

// Export convenience functions
export const getUserSubscription = (userId) => subscriptionManager.getUserSubscription(userId);
export const createSubscription = (userId, planId, paymentMethodId) => subscriptionManager.createSubscription(userId, planId, paymentMethodId);
export const cancelSubscription = (userId) => subscriptionManager.cancelSubscription(userId);
export const reactivateSubscription = (userId) => subscriptionManager.reactivateSubscription(userId);
export const getSubscriptionUsage = (userId) => subscriptionManager.getSubscriptionUsage(userId);
export const canPerformAction = (userId, action) => subscriptionManager.canPerformAction(userId, action);
export const trackActivity = (userId, action, metadata) => subscriptionManager.trackActivity(userId, action, metadata);