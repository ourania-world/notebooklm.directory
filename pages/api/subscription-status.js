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

    // In a real implementation, this would fetch the user's subscription from the database
    // For now, we'll return a mock subscription
    
    const mockSubscription = {
      subscription: null,
      plan: {
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
          count: 0,
          limit: 5,
          remaining: 5,
          unlimited: false 
        },
        submitted: {
          count: 0,
          limit: -1,
          remaining: -1,
          unlimited: true
        },
        hasPremiumAccess: false
      }
    };

    res.status(200).json(mockSubscription);
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: error.message });
  }
}