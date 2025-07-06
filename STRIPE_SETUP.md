# Stripe Setup Guide for NotebookLM Directory

## 1. Create a Stripe Account

If you don't already have a Stripe account:
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete the verification process

## 2. Create Products and Prices in Stripe

### Create Products
1. Go to **Products** in your Stripe Dashboard
2. Create the following products:

#### Standard Plan
- **Name**: Standard Plan
- **Description**: Enhanced features for serious researchers
- **Price**: $9.99/month (recurring)
- **Billing period**: Monthly
- **Trial period**: 7 days (optional)
- Save the Price ID (starts with `price_`)

#### Professional Plan
- **Name**: Professional Plan
- **Description**: Accelerate Your Impact, Measure Your Footprint
- **Price**: $19.99/month (recurring)
- **Billing period**: Monthly
- **Trial period**: 7 days (optional)
- Save the Price ID (starts with `price_`)

#### Enterprise Plan
- **Name**: Enterprise Plan
- **Description**: Scale Your Innovation, Achieve Your ESG Goals
- **Price**: $99.00/user/month (recurring)
- **Billing period**: Monthly
- **Trial period**: 7 days (optional)
- Save the Price ID (starts with `price_`)

## 3. Set Up Webhook Endpoints

1. Go to **Developers > Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL: `https://[YOUR_PROJECT_REF].supabase.co/functions/v1/stripe-webhook-handler`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

## 4. Configure Environment Variables

In your Supabase project:
1. Go to **Settings > API**
2. Scroll down to **Project API keys** and copy the **service_role key**
3. Go to **Settings > Edge Functions**
4. Add the following environment variables:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STANDARD_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
FRONTEND_URL=https://your-domain.com (or http://localhost:3000 for development)
```

## 5. Deploy Edge Functions

Deploy the Edge Functions to your Supabase project:

```bash
supabase functions deploy stripe-webhook-handler
supabase functions deploy create-checkout-session
supabase functions deploy manage-subscription
```

## 6. Test the Integration

### Test Checkout Flow
1. Go to your pricing page
2. Select a plan and click the upgrade button
3. Complete the checkout using a test card:
   - **Success**: 4242 4242 4242 4242
   - **Decline**: 4000 0000 0000 0002
   - **3D Secure**: 4000 0000 0000 3220

### Test Webhook Events
1. Go to **Developers > Webhooks** in your Stripe Dashboard
2. Select your webhook endpoint
3. Click **Send test webhook**
4. Select an event type (e.g., `customer.subscription.created`)
5. Click **Send test webhook**
6. Check your Supabase logs to verify the webhook was received and processed

## 7. Go Live

When you're ready to go live:
1. Complete Stripe's account activation process
2. Switch from test mode to live mode in your Stripe Dashboard
3. Update your environment variables with live API keys
4. Test the complete flow with real payments

## Troubleshooting

### Common Issues

1. **Webhook Errors**
   - Check that your webhook URL is correct
   - Verify the signing secret is correctly set in your environment variables
   - Check Supabase logs for detailed error messages

2. **Checkout Session Errors**
   - Ensure price IDs are correct
   - Verify your Stripe API key has the necessary permissions
   - Check that the user is authenticated before creating a checkout session

3. **Subscription Not Updating**
   - Check that webhook events are being received
   - Verify the database queries are working correctly
   - Ensure the user ID in metadata matches the user in your database

### Testing Tools

- Use Stripe CLI for local webhook testing
- Check Stripe Dashboard > Events for webhook delivery status
- Use Supabase Edge Function logs for debugging