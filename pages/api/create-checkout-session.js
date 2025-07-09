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

    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required. Please select a plan.' });
    }

    // In a real implementation, this would create a Stripe checkout session
    // For now, we'll just simulate success
    
    // Simulate a checkout URL
    const checkoutUrl = successUrl || `${req.headers.origin}/subscription/success`;

    // Log the checkout for debugging
    console.log('Creating checkout session:', {
      userId: session.user.id,
      priceId,
      successUrl: successUrl || `${req.headers.origin}/subscription/success`,
      cancelUrl: cancelUrl || `${req.headers.origin}/subscription/cancel`
    });

    // Create a mock subscription in the database
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: session.user.id,
        plan_id: priceId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      });

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      // Continue anyway for demo purposes
    }

    // Update user's profile with subscription tier
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ subscription_tier: priceId })
      .eq('id', session.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      // Continue anyway for demo purposes
    }

    // Create a mock payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: session.user.id,
        amount: priceId === 'standard' ? 999 : priceId === 'professional' ? 1999 : 9900,
        currency: 'usd',
        status: 'succeeded',
        description: `Subscription to ${priceId} plan`
      });

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // Continue anyway for demo purposes
    }

    // Create a mock payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: session.user.id,
        amount: priceId === 'standard' ? 999 : priceId === 'professional' ? 1999 : 9900,
        currency: 'usd',
        status: 'succeeded',
        description: `Subscription to ${priceId} plan`
      });

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // Continue anyway for demo purposes
    }

    res.status(200).json({ url: checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}