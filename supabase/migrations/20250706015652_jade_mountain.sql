/*
  # Update Subscription Plans
  
  1. Changes
    - Add Standard tier between Free and Professional
    - Update Professional plan price to $9.99/month
    - Fix Enterprise plan name and add "COMING SOON" label
    - Update plan descriptions and features
    - Clarify Enterprise pricing is per user per month
  
  2. Updates
    - Modify existing subscription_plans table entries
    - Add new Standard tier
    - Keep all other plan details intact
*/

-- Update subscription plans with corrected information
UPDATE subscription_plans 
SET 
  price = 9.99,
  description = 'Accelerate Your Impact, Measure Your Footprint'
WHERE id = 'professional';

-- Update Enterprise plan
UPDATE subscription_plans
SET
  description = 'Scale Your Innovation, Achieve Your ESG Goals - COMING SOON',
  name = 'Enterprise',
  price = 99.00,
  interval = 'user/month'
WHERE id = 'enterprise';

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