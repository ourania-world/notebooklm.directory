/*
  # Create Subscription Management Tables
  
  1. New Tables
    - `subscription_plans` - Define available subscription plans
    - `subscriptions` - Track user subscriptions
    - `payments` - Record payment history
  
  2. Updates to Existing Tables
    - Add subscription_tier to profiles table
    - Add stripe_customer_id to profiles table
  
  3. Security
    - Enable RLS on all tables
    - Create appropriate policies for access control
*/

-- Create subscription_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  interval text CHECK (interval IN ('month', 'year', 'user/month', null)),
  stripe_price_id text,
  features jsonb DEFAULT '[]',
  limits jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  is_coming_soon boolean DEFAULT false,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  plan_id text REFERENCES subscription_plans(id),
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  status text CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')) DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id),
  stripe_payment_intent_id text,
  amount integer NOT NULL, -- in cents
  currency text DEFAULT 'usd',
  status text CHECK (status IN ('succeeded', 'failed', 'pending')) DEFAULT 'pending',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Add subscription_tier to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier text DEFAULT 'free';
  END IF;
  
  -- Add stripe_customer_id to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text;
  END IF;
END $$;

-- Enable RLS on subscription tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_plans
CREATE POLICY "Anyone can view subscription plans"
  ON subscription_plans
  FOR SELECT
  TO public
  USING (active = true);

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true);

-- Create policies for payments
CREATE POLICY "Users can view their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payments"
  ON payments
  FOR ALL
  TO service_role
  USING (true);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, price, interval, features, limits, active, is_coming_soon, popular) VALUES
('free', 'Explorer', 'Perfect for getting started', 0.00, null, 
 '["Access to all public notebooks", "Browse curated collections", "Basic search features", "Community access", "Save up to 5 notebooks", "Submit unlimited notebooks"]',
 '{"savedNotebooks": 5, "submittedNotebooks": -1, "premiumContent": false}',
 true, false, false),
 
('standard', 'Standard', 'Great for regular users', 9.99, 'month',
 '["Everything in Explorer", "Unlimited saved notebooks", "Submit unlimited notebooks", "Advanced search features", "Email notifications", "Basic analytics"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": false}',
 true, false, true),
 
('professional', 'Professional', 'For power users and professionals', 19.99, 'month',
 '["Everything in Standard", "Unlimited saved notebooks", "Submit unlimited notebooks", "AI-powered search & recommendations", "Performance metrics", "Priority support", "API access (1000 calls/month)", "Export & integration tools"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true}',
 true, false, false),
 
('enterprise', 'Enterprise', 'For teams & organizations', 99.00, 'user/month',
 '["Everything in Professional", "Team collaboration tools", "Advanced analytics dashboard", "Custom reporting", "White-label options", "Dedicated account manager", "API access (10,000 calls/month)", "Custom integrations"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true}',
 true, true, false)
 
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  interval = EXCLUDED.interval,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  active = EXCLUDED.active,
  is_coming_soon = EXCLUDED.is_coming_soon,
  popular = EXCLUDED.popular,
  updated_at = now();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);