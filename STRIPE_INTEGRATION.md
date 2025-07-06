# Stripe Integration Guide for NotebookLM Directory

This guide explains how to set up and manage the Stripe integration for your subscription-based features.

## Overview

The NotebookLM Directory uses Stripe to handle payments and subscriptions for the following plans:

1. **Explorer** (Free) - Basic features
2. **Standard** ($9.99/month) - Enhanced features
3. **Professional** ($9.99/month) - Premium features with advanced analytics
4. **Enterprise** ($99/user/month) - Team features (Coming Soon)

## Setup Requirements

1. Stripe account
2. Supabase project with Edge Functions
3. Environment variables configured

## Implementation Components

### 1. Edge Functions

Three Edge Functions handle the Stripe integration:

- **create-checkout-session**: Creates a Stripe Checkout session for new subscriptions
- **manage-subscription**: Handles subscription management (cancel, reactivate, customer portal)
- **stripe-webhook-handler**: Processes webhook events from Stripe

### 2. Database Tables

The subscription system uses these tables:

- **subscription_plans**: Defines available plans and their features
- **subscriptions**: Tracks user subscriptions
- **profiles**: Contains user profile data including subscription tier
- **payments**: Records payment history

### 3. Frontend Components

- **SubscriptionModal**: Displays available plans and initiates checkout
- **SubscriptionManager**: Allows users to manage their subscription
- **UpgradePrompt**: Shown when users try to access premium features

## Setup Instructions

### Step 1: Create Products in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create products for each plan:
   - Standard Plan ($9.99/month)
   - Professional Plan ($9.99/month)
   - Enterprise Plan ($99/user/month)
3. Note the Price IDs for each plan

### Step 2: Configure Environment Variables

In your Supabase project, set these environment variables:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STANDARD_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
FRONTEND_URL=https://your-domain.com
```

### Step 3: Set Up Webhook Endpoint

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://[YOUR_PROJECT_REF].supabase.co/functions/v1/stripe-webhook-handler`
3. Subscribe to these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the signing secret to your environment variables

### Step 4: Deploy Edge Functions

```bash
supabase functions deploy create-checkout-session
supabase functions deploy manage-subscription
supabase functions deploy stripe-webhook-handler
```

## Usage Guide

### Creating a Subscription

```javascript
import { createCheckoutSession } from '../lib/subscriptions';

// In your component
async function handleSubscribe(planId) {
  try {
    const successUrl = `${window.location.origin}/subscription/success`;
    const cancelUrl = `${window.location.origin}/subscription/cancel`;
    
    const { url } = await createCheckoutSession(
      user.id,
      planId,
      successUrl,
      cancelUrl
    );
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
  }
}
```

### Managing a Subscription

```javascript
import { getCustomerPortalUrl, cancelSubscription } from '../lib/subscriptions';

// Redirect to customer portal
async function handleManageSubscription() {
  try {
    const returnUrl = `${window.location.origin}/account`;
    const url = await getCustomerPortalUrl(returnUrl);
    window.location.href = url;
  } catch (error) {
    console.error('Error getting portal URL:', error);
  }
}

// Cancel subscription
async function handleCancelSubscription(subscriptionId) {
  try {
    await cancelSubscription(subscriptionId);
    // Handle successful cancellation
  } catch (error) {
    console.error('Error canceling subscription:', error);
  }
}
```

### Checking Subscription Status

```javascript
import { getUserSubscription, checkSubscriptionLimit } from '../lib/subscriptions';

// Get user's subscription
async function checkSubscription(userId) {
  const subscription = await getUserSubscription(userId);
  
  // Check if user has premium access
  const hasPremiumAccess = subscription?.subscription_plans?.limits?.premiumContent === true;
  
  // Check if user can perform specific actions
  const { allowed, limit, current, remaining } = await checkSubscriptionLimit(
    userId,
    'savedNotebooks',
    currentSavedCount
  );
}
```

## Testing

Use these test cards in Stripe's test mode:

- **Success**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Decline**: 4000 0000 0000 0002

## Troubleshooting

### Common Issues

1. **Webhook Events Not Processing**
   - Check webhook endpoint URL
   - Verify webhook secret is correct
   - Check Supabase logs for errors

2. **Checkout Session Creation Fails**
   - Verify Stripe API key is correct
   - Check that price IDs exist in Stripe
   - Ensure user is authenticated

3. **Subscription Status Not Updating**
   - Check webhook events in Stripe Dashboard
   - Verify database queries in webhook handler
   - Check for errors in Supabase logs

## Going Live

Before going live:

1. Complete Stripe's account activation process
2. Update environment variables with live API keys
3. Test the complete subscription flow
4. Set up monitoring for webhook events
5. Configure email notifications for subscription events

## Support

If you encounter issues:

1. Check Stripe Dashboard for event logs
2. Review Supabase Edge Function logs
3. Test webhook delivery using Stripe's webhook tester
4. Contact Stripe support for payment-related issues