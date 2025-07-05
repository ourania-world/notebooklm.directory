/*
  # Setup Monetization System
  
  1. Subscription Plans
    - Create subscription_plans table with plan details
    - Define Explorer (free), Professional, and Enterprise tiers
    - Set pricing, features, and limits
  
  2. Subscriptions
    - Create subscriptions table to track user subscriptions
    - Link to Stripe subscription data
    - Track subscription status and period
  
  3. Payments
    - Create payments table for payment history
    - Track payment status and details
  
  4. Premium Content
    - Add premium flag to notebooks
    - Set up RLS policies for premium content access
*/

-- Create subscription_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  interval text CHECK (interval IN ('month', 'year')),
  stripe_price_id text,
  features jsonb DEFAULT '[]',
  limits jsonb DEFAULT '{}',
  active boolean DEFAULT true,
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
  status text CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')) DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
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

-- Add premium column to notebooks if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notebooks' AND column_name = 'premium'
  ) THEN
    ALTER TABLE notebooks ADD COLUMN premium boolean DEFAULT false;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Anyone can view subscription plans"
  ON subscription_plans
  FOR SELECT
  TO public
  USING (active = true);

-- RLS Policies for subscriptions
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

-- RLS Policies for payments
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

-- Update notebooks RLS for premium content
DROP POLICY IF EXISTS "Anyone can read notebooks" ON notebooks;
CREATE POLICY "Anyone can read public notebooks"
  ON notebooks
  FOR SELECT
  TO public
  USING (
    premium = false OR 
    (premium = true AND auth.uid() IN (
      SELECT s.user_id FROM subscriptions s 
      JOIN subscription_plans sp ON s.plan_id = sp.id 
      WHERE s.status = 'active' AND (sp.limits->>'premiumContent')::boolean = true
    ))
  );

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, price, interval, features, limits) VALUES
('explorer', 'Explorer', 'Sustainable Discovery for All', 0.00, null, 
 '["Browse 10,000+ curated notebooks", "Save up to 5 notebooks", "Basic search & filtering", "Community access", "Environmental impact tracking", "Mobile-optimized experience"]',
 '{"savedNotebooks": 5, "submittedNotebooks": 2, "premiumContent": false}'),
('professional', 'Professional', 'Accelerate Your Impact, Measure Your Footprint', 29.00, 'month',
 '["Everything in Explorer", "Save unlimited notebooks", "Submit up to 25 notebooks", "Advanced search & AI recommendations", "Personal environmental dashboard", "Priority support", "API access (1000 calls/month)", "Export & integration tools"]',
 '{"savedNotebooks": -1, "submittedNotebooks": 25, "premiumContent": true}'),
('enterprise', 'Enterprise', 'Scale Your Innovation, Achieve Your ESG Goals', 99.00, 'month',
 '["Everything in Professional", "Unlimited notebook submissions", "Team collaboration tools", "Advanced analytics dashboard", "Custom ESG reporting", "White-label options", "Dedicated account manager", "API access (10,000 calls/month)", "Custom integrations"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = now();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_notebooks_premium ON notebooks(premium);

-- Function to check subscription limits
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
  
  -- Default to explorer limits if no subscription found
  IF subscription_record IS NULL THEN
    SELECT limits INTO result
    FROM subscription_plans
    WHERE id = 'explorer';
    
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