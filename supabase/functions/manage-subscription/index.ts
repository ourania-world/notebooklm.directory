import { createClient } from 'npm:@supabase/supabase-js@2.39.7'
import Stripe from 'npm:stripe@14.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const { action, returnUrl } = await req.json()
    
    // Validate required parameters
    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get the user's JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Initialize Supabase client with the user's JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get the user's subscription information
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      
    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      return new Response(
        JSON.stringify({ error: 'Error fetching subscription' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Initialize Stripe with your secret key
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })
    
    switch (action) {
      case 'portal': {
        // Create a customer portal session
        if (!subscription?.stripe_customer_id) {
          return new Response(
            JSON.stringify({ error: 'No active subscription found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const session = await stripe.billingPortal.sessions.create({
          customer: subscription.stripe_customer_id,
          return_url: returnUrl || `${Deno.env.get('FRONTEND_URL')}/account`
        })
        
        return new Response(
          JSON.stringify({ url: session.url }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'cancel': {
        // Cancel subscription at period end
        if (!subscription?.stripe_subscription_id) {
          return new Response(
            JSON.stringify({ error: 'No active subscription found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true
        })
        
        // Update local record
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            cancel_at_period_end: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          
        if (updateError) {
          console.error('Error updating subscription:', updateError)
        }
        
        return new Response(
          JSON.stringify({ message: 'Subscription will be canceled at the end of the current period' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'reactivate': {
        // Reactivate a subscription that was set to cancel
        if (!subscription?.stripe_subscription_id) {
          return new Response(
            JSON.stringify({ error: 'No active subscription found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: false
        })
        
        // Update local record
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            cancel_at_period_end: false,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          
        if (updateError) {
          console.error('Error updating subscription:', updateError)
        }
        
        return new Response(
          JSON.stringify({ message: 'Subscription reactivated successfully' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error managing subscription:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})