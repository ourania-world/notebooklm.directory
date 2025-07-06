/*
  # Fix Subscription Plan Pricing
  
  1. Updates
    - Set Professional plan price to $19.99/month
    - Set Standard plan price to $9.99/month
    - Set Enterprise plan price to $99/user/month
    - Mark Enterprise plan as "Coming Soon"
    - Update plan descriptions and features
  
  2. Structure
    - Ensure all plans have correct limits and features
    - Maintain consistent naming across all plans
*/

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
 '["Everything in Standard", "Computational Footprint Dashboard", "Advanced resource-efficient search", "Unlimited sustainable storage", "Performance optimization metrics", "Priority support from green-tech experts", "API access (1000 calls/month)", "ESG-ready impact reporting"]',
 '{"savedNotebooks": -1, "submittedNotebooks": 25, "premiumContent": true}',
 true, false),
 
('enterprise', 'Enterprise', 'Scale Your Innovation, Achieve Your ESG Goals - COMING SOON', 99.00, 'user/month',
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