/*
  # Fix Subscription Pricing and Plans
  
  1. Updates
    - Set correct pricing for all plans:
      - Explorer (Free): $0
      - Standard: $9.99/month
      - Professional: $19.99/month
      - Enterprise: $99/user/month (Coming Soon)
    
  2. Features
    - Update plan descriptions and features
    - Mark Enterprise plan as "Coming Soon"
    - Ensure consistent naming across all plans
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
('free', 'Explorer', 'Sustainable Discovery for All', 0.00, null, 
 '["Browse 10,000+ curated notebooks", "Save up to 5 notebooks", "Basic search & filtering", "Community access", "Environmental impact tracking", "Mobile-optimized experience"]',
 '{"savedNotebooks": 5, "submittedNotebooks": 2, "premiumContent": false}',
 true, false),
 
('standard', 'Standard', 'Enhanced features for serious researchers', 9.99, 'month',
 '["Everything in Explorer", "Save up to 25 notebooks", "Submit up to 10 notebooks", "Advanced search features", "Email notifications", "Basic analytics"]',
 '{"savedNotebooks": 25, "submittedNotebooks": 10, "premiumContent": false}',
 true, false),
 
('professional', 'Professional', 'Accelerate Your Impact, Measure Your Footprint', 19.99, 'month',
 '["Everything in Explorer", "Save unlimited notebooks", "Submit up to 25 notebooks", "Advanced search & AI recommendations", "Personal environmental dashboard", "Priority support", "API access (1000 calls/month)", "Export & integration tools"]',
 '{"savedNotebooks": -1, "submittedNotebooks": 25, "premiumContent": true}',
 true, false),
 
('enterprise', 'Enterprise', 'Scale Your Innovation, Achieve Your ESG Goals - COMING SOON', 99.00, 'user/month',
 '["Everything in Professional", "Unlimited notebook submissions", "Team collaboration tools", "Advanced analytics dashboard", "Custom ESG reporting", "White-label options", "Dedicated account manager", "API access (10,000 calls/month)", "Custom integrations"]',
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