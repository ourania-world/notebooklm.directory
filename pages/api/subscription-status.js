import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans (
          id,
          name,
          price,
          interval,
          features,
          limits
        )
      `)
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }

    // Get user's usage stats
    const [savedCount, submittedCount] = await Promise.all([
      supabase
        .from('saved_notebooks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', session.user.id),
      supabase
        .from('notebooks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
    ]);

    // Default to explorer plan if no active subscription
    const planDetails = subscription?.subscription_plans || {
      id: 'explorer',
      name: 'Explorer',
      price: 0,
      interval: null,
      features: [
        'Browse 10,000+ curated notebooks',
        'Save up to 5 notebooks',
        'Basic search & filtering',
        'Community access',
        'Environmental impact tracking',
        'Mobile-optimized experience'
      ],
      limits: {
        savedNotebooks: 5,
        submittedNotebooks: 2,
        premiumContent: false
      }
    };

    // Calculate limits
    const savedLimit = planDetails.limits.savedNotebooks;
    const submittedLimit = planDetails.limits.submittedNotebooks;
    
    const savedRemaining = savedLimit === -1 ? -1 : Math.max(0, savedLimit - (savedCount.count || 0));
    const submittedRemaining = submittedLimit === -1 ? -1 : Math.max(0, submittedLimit - (submittedCount.count || 0));

    res.status(200).json({
      subscription: subscription || null,
      plan: planDetails,
      usage: {
        saved: {
          count: savedCount.count || 0,
          limit: savedLimit,
          remaining: savedRemaining,
          unlimited: savedLimit === -1
        },
        submitted: {
          count: submittedCount.count || 0,
          limit: submittedLimit,
          remaining: submittedRemaining,
          unlimited: submittedLimit === -1
        },
        hasPremiumAccess: planDetails.limits.premiumContent === true
      }
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: error.message });
  }
}