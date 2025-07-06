import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'npm:stripe@14.18.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const { userId, planId, successUrl, cancelUrl } = await req.json()

    if (!userId || !planId) {
      throw new Error('Missing required parameters')
    }

    // Plan configuration
    const plans = {
      standard: {
        priceId: Deno.env.get('STRIPE_STANDARD_PRICE_ID'),
        name: 'Standard Plan'
      },
      professional: {
        priceId: Deno.env.get('STRIPE_PROFESSIONAL_PRICE_ID'),
        name: 'Professional Plan'
      },
      enterprise: {
        priceId: Deno.env.get('STRIPE_ENTERPRISE_PRICE_ID'),
        name: 'Enterprise Plan'
      }
    }

    const selectedPlan = plans[planId]
    if (!selectedPlan) {
      throw new Error('Invalid plan selected')
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: undefined, // Will be filled by Stripe
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planId,
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})