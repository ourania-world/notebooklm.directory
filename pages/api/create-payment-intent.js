import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from session
    const { data: { session } } = await supabase.auth.getSession();
    
    // For testing purposes, we'll allow requests without authentication
    // In production, you would want to require authentication
    const user = session?.user;
    if (!user && process.env.NODE_ENV === 'production') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, currency = 'usd', description, planId } = req.body;

    if (!amount && !planId) {
      return res.status(400).json({ error: 'Amount or plan ID is required' });
    }

    // In a real implementation, this would create a Stripe payment intent
    // For now, we'll just simulate success with a mock client secret
    
    // Generate a mock client secret
    const clientSecret = `pi_mock_${Math.random().toString(36).substring(2, 15)}_secret_${Math.random().toString(36).substring(2, 15)}`;

    // Log the mock payment intent for debugging
    console.log('Created mock payment intent:', {
      clientSecret: clientSecret.substring(0, 10) + '...',
      amount: amount || 1999,
      planId
    });

    res.status(200).json({ 
      clientSecret,
      amount: amount || 1999, // Default to $19.99 if not specified
      currency: currency || 'usd',
      description: description || 'Subscription payment'
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
}