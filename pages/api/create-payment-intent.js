import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, currency = 'usd', description } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // In a real implementation, this would create a Stripe payment intent
    // For now, we'll just simulate success
    
    // Simulate a payment intent ID
    const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 15)}`;
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(2, 15)}`;

    res.status(200).json({ 
      clientSecret,
      paymentIntentId,
      amount,
      currency,
      description
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
}