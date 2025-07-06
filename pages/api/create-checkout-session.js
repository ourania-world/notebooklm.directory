import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required. Please select a plan.' });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        }
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/subscription/success`,
      cancel_url: cancelUrl || `${req.headers.origin}/subscription/cancel`,
      customer_email: session.user.email, // Pre-fill customer email
      metadata: {
        userId: session.user.id,
        planId: priceId.includes('standard') ? 'standard' : 
                priceId.includes('professional') ? 'professional' : 
                priceId.includes('enterprise') ? 'enterprise' : 'free'
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planId: priceId.includes('standard') ? 'standard' : 
                  priceId.includes('professional') ? 'professional' : 
                  priceId.includes('enterprise') ? 'enterprise' : 'free'
        },
        trial_period_days: 7 // Add a 7-day free trial
      }
    });

    res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}