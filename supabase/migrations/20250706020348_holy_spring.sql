/*
  # Update Subscription Plans
  
  1. Changes
    - Add Standard tier at $9.99/month
    - Set Professional tier at $9.99/month
    - Update Enterprise tier to $99/user/month with "COMING SOON" label
    - Update plan descriptions and features
    - Ensure consistent naming across all plans
  
  2. Updates
    - Create or update subscription_plans table entries
    - Maintain proper limits for each tier
*/

-- Create subscription_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  interval text CHECK (interval IN ('month', 'year', 'user/month')),
  stripe_price_id text,
  features jsonb DEFAULT '[]',
  limits jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- Insert or update the plans with correct information
INSERT INTO subscription_plans (id, name, description, price, interval, features, limits) VALUES
('free', 'Explorer', 'Sustainable Discovery for All - democratizing access to responsible tooling', 0.00, null, 
 '["Access to resource-efficient platform", "Browse curated notebook collection", "Basic sustainable search features", "Community access to responsible research", "Built on 100% renewable-powered infrastructure"]',
 '{"savedNotebooks": 5, "submittedNotebooks": 2, "premiumContent": false}'),
 
('standard', 'Standard', 'Enhanced features for serious researchers', 9.99, 'month',
 '["Everything in Explorer", "Save up to 25 notebooks", "Submit up to 10 notebooks", "Advanced search features", "Email notifications", "Basic analytics"]',
 '{"savedNotebooks": 25, "submittedNotebooks": 10, "premiumContent": false}'),
 
('professional', 'Professional', 'Accelerate Your Impact, Measure Your Footprint - for responsible professionals', 9.99, 'month',
 '["Everything in Standard", "Computational Footprint Dashboard", "Advanced resource-efficient search", "Unlimited sustainable storage", "Performance optimization metrics", "Priority support from green-tech experts", "API access with efficiency monitoring", "ESG-ready impact reporting"]',
 '{"savedNotebooks": -1, "submittedNotebooks": 25, "premiumContent": true}'),
 
('enterprise', 'Enterprise', 'Scale Your Innovation, Achieve Your ESG Goals - COMING SOON - for responsible organizations', 99.00, 'user/month',
 '["Everything in Professional", "Enterprise-grade sustainability reporting", "Team carbon footprint aggregation", "Custom ESG dashboard integration", "Dedicated sustainability consultant", "Carbon offset contribution options", "Advanced security with green compliance", "White-label sustainable platform"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true}')
 
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  interval = EXCLUDED.interval,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = now();