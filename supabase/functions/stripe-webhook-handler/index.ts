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
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
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
        Deno.env.get('STRIPE_WEBHOOK_SECRET')!
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
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.subscription_data?.metadata?.userId || session.metadata?.userId
        const planId = session.subscription_data?.metadata?.planId || session.metadata?.planId
        
        if (!userId) {
          console.error('Missing userId in session metadata')
          return new Response(
            JSON.stringify({ error: 'Missing userId in session metadata' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Create or update subscription record
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            tier: planId || 'basic',
            status: 'active',
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
            subscription_tier: planId || 'basic',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          
        if (profileError) {
          console.error('Error updating profile:', profileError)
        }
        
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId
        
        // Get the subscription status and plan
        const status = subscription.status
        const planId = subscription.metadata?.planId
        
        // If we don't have userId in metadata, look it up by customer ID
        let userIdToUpdate = userId
        if (!userIdToUpdate) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .single()
            
          if (profile) {
            userIdToUpdate = profile.id
          }
        }
        
        if (!userIdToUpdate) {
          console.error('Could not find user for subscription update')
          break
        }
        
        // Update subscription record
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .update({
            status: status,
            tier: planId,
            current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userIdToUpdate)
          
        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError)
        }
        
        // Update user's profile with subscription tier if active
        if (status === 'active') {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              subscription_tier: planId || 'basic',
              updated_at: new Date().toISOString()
            })
            .eq('id', userIdToUpdate)
            
          if (profileError) {
            console.error('Error updating profile:', profileError)
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
              tier: 'free',
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
              tier: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', subscriptionData.user_id)
            
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