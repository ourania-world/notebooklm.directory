import { supabase } from './supabase'

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: { 
    id: 'free',
    name: 'Explorer',
    price: 0,
    interval: null, 
    features: [
      'Access to all public notebooks',
      'Browse curated collections',
      'Basic search features',
      'Community access',
      'Save unlimited notebooks',
      'Submit unlimited notebooks'
    ],
    limits: {
      savedNotebooks: -1,
      submittedNotebooks: -1,
      premiumContent: false
    }
  },
  STANDARD: { 
    id: 'standard',
    name: 'Standard',
    price: 9.99,
    interval: 'month',
    stripeId: 'price_standard_monthly',
    features: [ 
      'Everything in Explorer', 
      'Save unlimited notebooks',
      'Submit unlimited notebooks',
      'Advanced search features', 
      'Email notifications', 
      'Basic analytics' 
    ],
    limits: {
      savedNotebooks: -1,
      submittedNotebooks: -1,
      premiumContent: false
    }
  },
  PROFESSIONAL: { 
    id: 'professional',
    name: 'Professional',
    price: 19.99,
    interval: 'month',
    stripeId: 'price_professional_monthly',
    features: [ 
      'Everything in Standard', 
      'Unlimited saved notebooks',
      'Submit unlimited notebooks',
      'AI-powered search & recommendations',
      'Performance metrics',
      'Priority support',
      'API access (1000 calls/month)',
      'Export & integration tools'
    ],
    limits: {
      savedNotebooks: -1,
      submittedNotebooks: -1,
      premiumContent: true
    }
  },
  ENTERPRISE: { 
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'user/month', 
    stripeId: 'price_enterprise_monthly',
    features: [ 
      'Everything in Professional', 
      'Team collaboration tools',
      'Advanced analytics dashboard',
      'Custom reporting',
      'White-label options',
      'Dedicated account manager',
      'API access (10,000 calls/month)',
      'Custom integrations'
    ],
    limits: {
      savedNotebooks: -1,
      submittedNotebooks: -1,
      premiumContent: true
    }
  }
}

// Get user's current subscription
export async function getUserSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data || null
  } catch (error) {
    console.error('Error fetching user subscription:', error)
    return null
  }
}

// Check if user can perform action based on subscription
export async function checkSubscriptionLimit(userId, action, currentCount = 0) {
  try {
    const subscription = await getUserSubscription(userId)
    const plan = subscription?.subscription_plans || SUBSCRIPTION_PLANS.FREE
    
    const limit = plan.limits[action]
    
    // -1 means unlimited
    if (limit === -1) return { allowed: true, limit: -1, current: currentCount }
    
    return {
      allowed: currentCount < limit,
      limit,
      current: currentCount,
      remaining: Math.max(0, limit - currentCount)
    }
  } catch (error) {
    console.error('Error checking subscription limit:', error)
    return { allowed: false, limit: 0, current: currentCount }
  }
}

// Create checkout session
export async function createCheckoutSession(userId, planId, successUrl, cancelUrl) {
  try {
    // Call the API endpoint instead of the Edge Function
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: planId,
        successUrl,
        cancelUrl
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }
    
    const data = await response.json();

    return data
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription() {
  try {
    const { data, error } = await supabase.functions.invoke('manage-subscription', {
      body: { 
        action: 'cancel',
        returnUrl: window.location.origin + '/subscription/manage'
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

// Reactivate subscription
export async function reactivateSubscription() {
  try {
    const { data, error } = await supabase.functions.invoke('manage-subscription', {
      body: { 
        action: 'reactivate',
        returnUrl: window.location.origin + '/subscription/manage'
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    throw error
  }
}

// Get customer portal URL
export async function getCustomerPortalUrl(returnUrl) {
  try {
    const { data, error } = await supabase.functions.invoke('manage-subscription', { 
      body: {
        action: 'portal', 
        returnUrl: returnUrl || window.location.origin + '/subscription/manage' 
      } 
    }) 

    if (error) throw error
    return data.url
  } catch (error) {
    console.error('Error getting customer portal URL:', error)
    throw error
  }
}

// Get user's payment history
export async function getPaymentHistory(userId) {
  try {
    const { data, error } = await supabase 
      .from('payments') 
      .select('*') 
      .eq('user_id', userId) 
      .order('created_at', { ascending: false }) 

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return []
  }
}