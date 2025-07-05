import { supabase } from './supabase'

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      'Browse public notebooks',
      'Save up to 5 notebooks',
      'Basic search functionality',
      'Community access'
    ],
    limits: {
      savedNotebooks: 5,
      submittedNotebooks: 2,
      premiumContent: false
    }
  },
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    stripeId: 'price_basic_monthly',
    features: [
      'Everything in Free',
      'Save unlimited notebooks',
      'Submit up to 10 notebooks',
      'Advanced search & filters',
      'Email notifications',
      'Priority support'
    ],
    limits: {
      savedNotebooks: -1, // unlimited
      submittedNotebooks: 10,
      premiumContent: false
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    stripeId: 'price_premium_monthly',
    features: [
      'Everything in Basic',
      'Access to premium notebooks',
      'Unlimited notebook submissions',
      'Advanced analytics dashboard',
      'Custom notebook collections',
      'API access',
      'White-label options'
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
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        userId,
        planId,
        successUrl,
        cancelUrl
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId) {
  try {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error canceling subscription:', error)
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