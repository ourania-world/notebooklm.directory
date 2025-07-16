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

    // Get user's subscription from database
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      // Continue with mock data for demo
    }

    // Get user's saved notebooks count
    const { count: savedCount, error: savedError } = await supabase
      .from('saved_notebooks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id);
    
    if (savedError) {
      console.error('Error fetching saved count:', savedError);
      // Continue with mock data for demo
    }

    // Get user's submitted notebooks count
    const { count: submittedCount, error: submittedError } = await supabase
      .from('notebooks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id);
    
    if (submittedError) {
      console.error('Error fetching submitted count:', submittedError);
      // Continue with mock data for demo
    }

    // If no subscription found, return free plan
    if (!subscription) {
      const { data: freePlan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', 'free')
        .single();

      return res.status(200).json({
        subscription: null,
        plan: freePlan || {
          id: 'free',
          name: 'Explorer',
          price: 0,
          interval: null, 
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
        usage: {
          saved: {
            count: savedCount || 0,
            limit: 5,
            remaining: 5 - (savedCount || 0),
            unlimited: false 
          },
          submitted: {
            count: submittedCount || 0,
            limit: -1,
            remaining: -1,
            unlimited: true
          },
          hasPremiumAccess: false
        }
      });
    }

    // Return subscription with usage data
    const plan = subscription.subscription_plans;
    const savedLimit = plan?.limits?.savedNotebooks || 5;
    const submittedLimit = plan?.limits?.submittedNotebooks || -1;
    
    return res.status(200).json({
      subscription,
      plan,
      usage: {
        saved: {
          count: savedCount || 0,
          limit: savedLimit,
          remaining: savedLimit === -1 ? -1 : savedLimit - (savedCount || 0),
          unlimited: savedLimit === -1
        },
        submitted: {
          count: submittedCount || 0,
          limit: submittedLimit,
          remaining: submittedLimit === -1 ? -1 : submittedLimit - (submittedCount || 0),
          unlimited: submittedLimit === -1
        },
        hasPremiumAccess: plan?.limits?.premiumContent === true
      }
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: error.message });
  }
}