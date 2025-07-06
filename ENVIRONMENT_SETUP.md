# 🔧 Environment Variables Setup

## Required Environment Variables

Set these in your Supabase Dashboard → Settings → Edge Functions:

### Stripe Configuration
```bash
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Your Stripe webhook signing secret
STRIPE_STANDARD_PRICE_ID=price_... # Standard plan price ID from Stripe
STRIPE_PROFESSIONAL_PRICE_ID=price_... # Professional plan price ID from Stripe
STRIPE_ENTERPRISE_PRICE_ID=price_... # Enterprise plan price ID from Stripe
```

### Application Configuration
```bash
FRONTEND_URL=https://your-domain.com # Your deployed frontend URL
```

## Stripe Setup Steps

### 1. Create Products in Stripe Dashboard

**Standard Plan:**
- Name: "Standard Plan"
- Price: $9.99/month
- Copy the Price ID (starts with `price_`)

**Professional Plan:**
- Name: "Professional Plan"  
- Price: $19.99/month
- Copy the Price ID (starts with `price_`)

**Enterprise Plan:**
- Name: "Enterprise Plan"
- Price: $99.00/user/month
- Copy the Price ID (starts with `price_`)

### 2. Configure Webhook Endpoints

Add these webhook endpoints in Stripe Dashboard → Webhooks:

**Endpoint URL:** `https://your-project.supabase.co/functions/v1/stripe-webhook-handler`

**Events to send:**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.deleted`
- `customer.subscription.updated`
- `customer.subscription.created`

Copy the webhook signing secret (starts with `whsec_`)

### 3. Test Configuration

Use Stripe's test mode with these test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Authentication:** 4000 0000 0000 3220

## Deployment Checklist

- [ ] All Edge Functions deployed
- [ ] Environment variables set in Supabase
- [ ] Stripe products created
- [ ] Webhook endpoints configured
- [ ] Database migration applied
- [ ] Frontend deployed with correct env vars

## Testing the Complete Flow

1. **Sign up** for a new account
2. **Click upgrade** to premium
3. **Complete checkout** with test card
4. **Verify subscription** in profile
5. **Test premium features** (analytics, etc.)
6. **Test subscription management** (cancel/reactivate)

Your monetization system is now ready for production! 🎉