import { supabase } from '../lib/supabase';

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: { 
    id: 'free',
    name: 'Explorer',
    price: 0,
    interval: null, 
    description: 'Perfect for getting started',
    features: [
      'Access to all public notebooks',
      'Browse curated collections',
      'Basic search features',
      'Community access',
      'Save up to 5 notebooks',
      'Submit unlimited notebooks'
    ],
    limits: {
      savedNotebooks: 5,
      submittedNotebooks: -1,
      premiumContent: false
    }
  },
  STANDARD: { 
    id: 'standard',
    name: 'Standard',
    price: 9.99,
    interval: 'month',
    description: 'Great for regular users',
    features: [ 
      'Everything in Explorer', 
      'Unlimited saved notebooks',
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
    description: 'For power users and professionals',
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
    description: 'For teams & organizations',
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
};