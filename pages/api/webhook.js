import { buffer } from 'micro';
import { supabase } from '../../lib/supabase';

// Disable body parsing, we need the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the raw body as a buffer
    const rawBody = await buffer(req);
    const payload = rawBody.toString();
    
    // In a real implementation, you would verify the Stripe signature
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const signature = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(
    //   rawBody.toString(),
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // );

    // For now, we'll just parse the JSON body
    const event = JSON.parse(payload);

    // Log the webhook event (for demonstration purposes)
    console.log('Received webhook event:', event.type);

    // Process different event types
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful checkout
        const session = event.data.object;
        
        // Update user's subscription in database
        if (session.customer && session.subscription) {
          // Get the plan ID from metadata
          const planId = session.metadata?.planId || 'standard';
          
          // Create or update subscription record
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: session.metadata?.userId,
              plan_id: planId,
              stripe_subscription_id: session.subscription,
              stripe_customer_id: session.customer,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
            }, {
              onConflict: 'user_id'
            });
          
          if (subscriptionError) {
            console.error('Error updating subscription:', subscriptionError);
          }
          
          // Update user's profile with subscription tier
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              subscription_tier: planId,
              stripe_customer_id: session.customer
            })
            .eq('id', session.metadata?.userId);
          
          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
          
          // Create payment record
          const { error: paymentError } = await supabase
            .from('payments')
            .insert({
              user_id: session.metadata?.userId,
              stripe_payment_intent_id: session.payment_intent,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'succeeded',
              description: `Subscription to ${planId} plan`
            });
          
          if (paymentError) {
            console.error('Error creating payment record:', paymentError);
          }
        }
        break;
        
      case 'invoice.payment_succeeded':
        // Handle successful invoice payment
        const invoice = event.data.object;
        
        // Update subscription status
        if (invoice.subscription) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('id, user_id')
            .eq('stripe_subscription_id', invoice.subscription)
            .single();
          
          if (subscription) {
            // Create payment record
            const { error: paymentError } = await supabase
              .from('payments')
              .insert({
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                stripe_payment_intent_id: invoice.payment_intent,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: 'succeeded',
                description: 'Subscription renewal'
              });
            
            if (paymentError) {
              console.error('Error creating payment record:', paymentError);
            }
          }
        }
        break;
        
      case 'customer.subscription.updated':
        // Handle subscription updates
        const updatedSubscription = event.data.object;
        
        // Update subscription status in database
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: updatedSubscription.status,
            current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: updatedSubscription.cancel_at_period_end
          })
          .eq('stripe_subscription_id', updatedSubscription.id);
        
        if (updateError) {
          console.error('Error updating subscription:', updateError);
        }
        break;
        
      case 'customer.subscription.deleted':
        // Handle subscription cancellations
        const deletedSubscription = event.data.object;
        
        // Update subscription status in database
        const { error: deleteError } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', deletedSubscription.id);
        
        if (deleteError) {
          console.error('Error updating subscription:', deleteError);
        }
        
        // Get user ID from subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', deletedSubscription.id)
          .single();
        
        if (subData) {
          // Reset user's profile to free tier
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ subscription_tier: 'free' })
            .eq('id', subData.user_id);
          
          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }
        break;
        
      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Respond with success
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
}