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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add is_coming_soon column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscription_plans' AND column_name = 'is_coming_soon'
  ) THEN
    ALTER TABLE subscription_plans ADD COLUMN is_coming_soon boolean DEFAULT false;
  END IF;
END $$;

-- Enable RLS on subscription_plans if not already enabled
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscription_plans' AND policyname = 'Anyone can view subscription plans'
  ) THEN
    CREATE POLICY "Anyone can view subscription plans"
      ON subscription_plans
      FOR SELECT
      TO public
      USING (active = true);
  END IF;
END $$;

-- Insert or update the plans with correct pricing
INSERT INTO subscription_plans (id, name, description, price, interval, features, limits, active, is_coming_soon) VALUES
('free', 'Explorer', 'Sustainable Discovery for All - democratizing access to responsible tooling', 0.00, null, 
 '["Access to resource-efficient platform", "Browse curated notebook collection", "Basic sustainable search features", "Community access to responsible research", "Built on 100% renewable-powered infrastructure"]',
 '{"savedNotebooks": 5, "submittedNotebooks": 2, "premiumContent": false}',
 true, false),
 
('standard', 'Standard', 'Enhanced features for serious researchers', 9.99, 'month',
 '["Everything in Explorer", "Save up to 25 notebooks", "Submit up to 10 notebooks", "Advanced search features", "Email notifications", "Basic analytics"]',
 '{"savedNotebooks": 25, "submittedNotebooks": 10, "premiumContent": false}',
 true, false),
 
('professional', 'Professional', 'Accelerate Your Impact, Measure Your Footprint - for responsible professionals', 19.99, 'month',
 '["Everything in Standard", "Computational Footprint Dashboard", "Advanced resource-efficient search", "Unlimited sustainable storage", "Performance optimization metrics", "Priority support from green-tech experts", "API access with efficiency monitoring", "ESG-ready impact reporting"]',
 '{"savedNotebooks": -1, "submittedNotebooks": 25, "premiumContent": true}',
 true, false),
 
('enterprise', 'Enterprise', 'Scale Your Innovation, Achieve Your ESG Goals - for responsible organizations', 99.00, 'user/month',
 '["Everything in Professional", "Enterprise-grade sustainability reporting", "Team carbon footprint aggregation", "Custom ESG dashboard integration", "Dedicated sustainability consultant", "Carbon offset contribution options", "Advanced security with green compliance", "White-label sustainable platform"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true}',
 true, true)
 
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  interval = EXCLUDED.interval,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  active = EXCLUDED.active,
  is_coming_soon = EXCLUDED.is_coming_soon,
  updated_at = now();

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

-- Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Users can view their own subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own subscriptions"
      ON subscriptions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policy for service role to manage subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Service role can manage subscriptions'
  ) THEN
    CREATE POLICY "Service role can manage subscriptions"
      ON subscriptions
      FOR ALL
      TO service_role
      USING (true);
  END IF;
END $$;

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

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own payments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' AND policyname = 'Users can view their own payments'
  ) THEN
    CREATE POLICY "Users can view their own payments"
      ON payments
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);