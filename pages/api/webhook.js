import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionDeleted(subscription);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const subscriptionId = session.subscription;

  if (!userId || !subscriptionId) {
    console.error('Missing userId or subscriptionId in session metadata');
    return;
  }

  try {
    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;
    
    // Determine plan ID based on price ID
    let planId;
    if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
      planId = 'professional';
    } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
      planId = 'enterprise';
    } else {
      planId = 'explorer'; // Default
    }

    // Create or update subscription in database
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: session.customer,
        plan_id: planId,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      });

    if (error) {
      console.error('Error saving subscription:', error);
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription:', error);
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription to canceled:', error);
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}