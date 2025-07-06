import { createClient } from 'npm:@supabase/supabase-js@2.39.7'
import Stripe from 'npm:stripe@14.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe with your secret key
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })
    
    // Get the signature from the headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing Stripe signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get the raw body as text
    const body = await req.text()
    
    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      )
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId || session.subscription_data?.metadata?.userId
        const planId = session.metadata?.planId || session.subscription_data?.metadata?.planId
        
        if (!userId) {
          console.error('Missing userId in session metadata')
          return new Response(
            JSON.stringify({ error: 'Missing userId in session metadata' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Get subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        
        // Create or update subscription record
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan_id: planId || 'standard',
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
          
        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError)
        }
        
        // Update user's profile with subscription tier
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            subscription_tier: planId || 'standard',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          
        if (profileError) {
          console.error('Error updating profile:', profileError)
        }
        
        // Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            subscription_id: session.subscription,
            stripe_payment_intent_id: session.payment_intent,
            amount: session.amount_total || 0,
            currency: session.currency || 'usd',
            status: 'succeeded',
            description: `Subscription to ${planId || 'standard'} plan`
          })
          
        if (paymentError) {
          console.error('Error creating payment record:', paymentError)
        }
        
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        // Find the user with this subscription
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('user_id, plan_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()
          
        if (!subscriptionData) {
          // Try to find by customer ID
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .single()
            
          if (!profile) {
            console.error('Could not find user for subscription update')
            break
          }
          
          // Get plan ID from metadata or price
          let planId = subscription.metadata?.planId
          if (!planId) {
            const priceId = subscription.items.data[0].price.id
            if (priceId === Deno.env.get('STRIPE_STANDARD_PRICE_ID')) {
              planId = 'standard'
            } else if (priceId === Deno.env.get('STRIPE_PROFESSIONAL_PRICE_ID')) {
              planId = 'professional'
            } else if (priceId === Deno.env.get('STRIPE_ENTERPRISE_PRICE_ID')) {
              planId = 'enterprise'
            } else {
              planId = 'standard' // Default
            }
          }
          
          // Update subscription record
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: profile.id,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer,
              plan_id: planId,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            })
            
          // Update user's profile with subscription tier
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            await supabase
              .from('profiles')
              .update({ 
                subscription_tier: planId,
                updated_at: new Date().toISOString()
              })
              .eq('id', profile.id)
          }
        } else {
          // Update subscription record
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id)
            
          // Update user's profile with subscription tier if active
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            await supabase
              .from('profiles')
              .update({ 
                subscription_tier: subscriptionData.plan_id,
                updated_at: new Date().toISOString()
              })
              .eq('id', subscriptionData.user_id)
          }
        }
        
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Find the user with this subscription
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()
          
        if (!subscriptionData) {
          // Try to find by customer ID
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .single()
            
          if (!profile) {
            console.error('Could not find user for subscription deletion')
            break
          }
          
          // Update subscription record
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              canceled_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', profile.id)
            
          // Reset user's profile to free tier
          await supabase
            .from('profiles')
            .update({ 
              subscription_tier: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)
        } else {
          // Update subscription record
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              canceled_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id)
            
          // Reset user's profile to free tier
          await supabase
            .from('profiles')
            .update({ 
              subscription_tier: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('id', subscriptionData.user_id)
        }
        
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        if (invoice.subscription) {
          // This is a subscription invoice
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('id, user_id')
            .eq('stripe_subscription_id', invoice.subscription)
            .single()
            
          if (subscription) {
            // Create payment record
            await supabase
              .from('payments')
              .insert({
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                stripe_payment_intent_id: invoice.payment_intent,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: 'succeeded',
                description: `Invoice payment for subscription`
              })
          }
        }
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        if (invoice.subscription) {
          // Update subscription status to past_due
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)
        }
        break
      }
    }
    
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})