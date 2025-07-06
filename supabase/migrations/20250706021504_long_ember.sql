/*
  # Create Subscription Management Tables
  
  1. New Tables
    - `subscription_plans` - Define available subscription plans
    - `subscriptions` - Track user subscriptions
  
  2. Updates to Existing Tables
    - Add subscription_tier to profiles table
    - Add stripe_customer_id to profiles table
  
  3. Security
    - Enable RLS on all tables
    - Create appropriate policies for access control
*/

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  interval text CHECK (interval IN ('month', 'year')),
  features jsonb DEFAULT '[]',
  limits jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  plan_id text REFERENCES subscription_plans(id),
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  status text CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')) DEFAULT 'active',
  current_period_end timestamptz,
  current_period_start timestamptz,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, price, interval, features, limits) VALUES
('free', 'Free', 'Perfect for getting started', 0.00, null, 
 '["Browse public notebooks", "Save up to 5 notebooks", "Basic search", "Community access"]',
 '{"savedNotebooks": 5, "submittedNotebooks": 2, "premiumContent": false}'),
('basic', 'Basic', 'Great for regular users', 9.99, 'month',
 '["Everything in Free", "Save unlimited notebooks", "Submit up to 10 notebooks", "Advanced search", "Email notifications", "Priority support"]',
 '{"savedNotebooks": -1, "submittedNotebooks": 10, "premiumContent": false}'),
('premium', 'Premium', 'For power users and professionals', 19.99, 'month',
 '["Everything in Basic", "Access premium notebooks", "Unlimited submissions", "Analytics dashboard", "API access", "Custom collections"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = now();

-- Create function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limit(
  user_uuid uuid,
  limit_type text,
  current_count integer
)
RETURNS jsonb AS $$
DECLARE
  subscription_record record;
  limit_value integer;
  result jsonb;
BEGIN
  -- Get user's active subscription
  SELECT s.*, sp.limits INTO subscription_record
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = user_uuid
  AND s.status = 'active'
  LIMIT 1;
  
  -- Default to free limits if no subscription found
  IF subscription_record IS NULL THEN
    SELECT limits INTO result
    FROM subscription_plans
    WHERE id = 'free';
    
    limit_value := (result->>limit_type)::integer;
  ELSE
    limit_value := (subscription_record.limits->>limit_type)::integer;
  END IF;
  
  -- -1 means unlimited
  IF limit_value = -1 THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'limit', -1,
      'current', current_count,
      'remaining', -1
    );
  ELSE
    RETURN jsonb_build_object(
      'allowed', current_count < limit_value,
      'limit', limit_value,
      'current', current_count,
      'remaining', greatest(0, limit_value - current_count)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);