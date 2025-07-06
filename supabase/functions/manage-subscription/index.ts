import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@14.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Initialize Supabase client with the user's JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    // Get the user's session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request method and path
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'get'

    // Handle different operations based on action
    if (req.method === 'GET' && action === 'get') {
      // Get subscription details
      const { data: subscription, error: subscriptionError } = await supabaseClient
        .from('subscriptions')
        .select(`
          id,
          status,
          current_period_start,
          current_period_end,
          canceled_at,
          stripe_subscription_id,
          subscription_plans (
            id,
            name,
            description,
            price,
            interval,
            features
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

      if (subscriptionError) {
        return new Response(
          JSON.stringify({ error: 'Error fetching subscription' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get available plans
      const { data: availablePlans, error: plansError } = await supabaseClient
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true })

      if (plansError) {
        return new Response(
          JSON.stringify({ error: 'Error fetching plans' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          subscription: subscription || null,
          availablePlans: availablePlans || []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else if (req.method === 'POST' && action === 'cancel') {
      // Cancel subscription at period end
      const { data: subscription, error: subscriptionError } = await supabaseClient
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

      if (subscriptionError || !subscription) {
        return new Response(
          JSON.stringify({ error: 'No active subscription found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Initialize Stripe with your secret key
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
        apiVersion: '2023-10-16',
      })

      // Cancel the subscription at period end via Stripe
      await stripe.subscriptions.update(
        subscription.stripe_subscription_id,
        { cancel_at_period_end: true }
      )

      // Update the local subscription record
      await supabaseClient
        .from('subscriptions')
        .update({ canceled_at: new Date().toISOString() })
        .eq('stripe_subscription_id', subscription.stripe_subscription_id)

      return new Response(
        JSON.stringify({ success: true, message: 'Subscription will be canceled at the end of the billing period' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else if (req.method === 'POST' && action === 'reactivate') {
      // Reactivate a subscription that was set to cancel
      const { data: subscription, error: subscriptionError } = await supabaseClient
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .not('canceled_at', 'is', null)
        .maybeSingle()

      if (subscriptionError || !subscription) {
        return new Response(
          JSON.stringify({ error: 'No subscription found that is set to cancel' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Initialize Stripe with your secret key
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
        apiVersion: '2023-10-16',
      })

      // Reactivate the subscription via Stripe
      await stripe.subscriptions.update(
        subscription.stripe_subscription_id,
        { cancel_at_period_end: false }
      )

      // Update the local subscription record
      await supabaseClient
        .from('subscriptions')
        .update({ canceled_at: null })
        .eq('stripe_subscription_id', subscription.stripe_subscription_id)

      return new Response(
        JSON.stringify({ success: true, message: 'Subscription reactivated successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else if (req.method === 'POST' && action === 'portal') {
      // Create a customer portal session for plan changes and payment updates
      const customerId = await getStripeCustomerId(user.id)
      
      // Initialize Stripe with your secret key
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
        apiVersion: '2023-10-16',
      })
      
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${Deno.env.get('FRONTEND_URL') || 'http://localhost:3000'}/profile`,
      })

      return new Response(
        JSON.stringify({ url: session.url }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error managing subscription:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process subscription request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper function to get or create a Stripe customer ID for a user
async function getStripeCustomerId(userId: string): Promise<string> {
  // Initialize Supabase admin client
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Get user profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()
  
  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id
  }
  
  // Get user email from auth
  const { data: user } = await supabaseAdmin
    .auth.admin.getUserById(userId)
  
  if (!user?.user?.email) {
    throw new Error('User email not found')
  }
  
  // Initialize Stripe with your secret key
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
  })
  
  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.user.email,
    metadata: {
      user_id: userId
    }
  })
  
  // Save Stripe customer ID to profile
  await supabaseAdmin
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId)
  
  return customer.id
}