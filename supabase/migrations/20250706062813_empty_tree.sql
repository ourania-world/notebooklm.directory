-- Update all subscription plans to have unlimited submissions and clean descriptions
UPDATE subscription_plans
SET 
  limits = jsonb_set(limits, '{submittedNotebooks}', '-1'::jsonb),
  features = CASE
    WHEN id = 'free' THEN 
      '["Access to public notebooks", "Browse curated collections", "Basic search features", "Community access", "Save up to 5 notebooks", "Submit unlimited notebooks"]'::jsonb
    WHEN id = 'standard' THEN 
      '["Everything in Free", "Unlimited saved notebooks", "Submit unlimited notebooks", "Advanced search with filters", "Email notifications", "Basic analytics"]'::jsonb
    WHEN id = 'professional' THEN 
      '["Everything in Standard", "Unlimited saved notebooks", "Submit unlimited notebooks", "AI-powered search & recommendations", "Performance metrics", "Priority support", "API access (1000 calls/month)", "Export & integration tools"]'::jsonb
    WHEN id = 'enterprise' THEN 
      '["Everything in Professional", "Team collaboration tools", "Advanced analytics dashboard", "Custom reporting", "White-label options", "Dedicated account manager", "API access (10,000 calls/month)", "Custom integrations"]'::jsonb
    ELSE features
  END,
  description = CASE
    WHEN id = 'free' THEN 'Perfect for getting started'
    WHEN id = 'standard' THEN 'Great for regular users'
    WHEN id = 'professional' THEN 'For power users and professionals'
    WHEN id = 'enterprise' THEN 'For teams & organizations'
    ELSE description
  END,
  updated_at = now()
WHERE id IN ('free', 'standard', 'professional', 'enterprise');

-- Update Standard plan to have unlimited saved notebooks
UPDATE subscription_plans
SET limits = jsonb_set(limits, '{savedNotebooks}', '-1'::jsonb)
WHERE id = 'standard';

-- Insert or update the plans with clean descriptions and unlimited submissions
INSERT INTO subscription_plans (id, name, description, price, interval, features, limits, active, is_coming_soon) VALUES
('free', 'Explorer', 'Perfect for getting started', 0.00, null, 
 '["Access to public notebooks", "Browse curated collections", "Basic search features", "Community access", "Save up to 5 notebooks", "Submit unlimited notebooks"]',
 '{"savedNotebooks": 5, "submittedNotebooks": -1, "premiumContent": false, "popular": false}',
 true, false),
 
('standard', 'Standard', 'Great for regular users', 9.99, 'month',
 '["Everything in Free", "Unlimited saved notebooks", "Submit unlimited notebooks", "Advanced search with filters", "Email notifications", "Basic analytics"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": false, "popular": true}',
 true, false),
 
('professional', 'Professional', 'For power users and professionals', 19.99, 'month',
 '["Everything in Standard", "Unlimited saved notebooks", "Submit unlimited notebooks", "AI-powered search & recommendations", "Performance metrics", "Priority support", "API access (1000 calls/month)", "Export & integration tools"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true, "popular": false}',
 true, false),
 
('enterprise', 'Enterprise', 'For teams & organizations', 99.00, 'user/month',
 '["Everything in Professional", "Team collaboration tools", "Advanced analytics dashboard", "Custom reporting", "White-label options", "Dedicated account manager", "API access (10,000 calls/month)", "Custom integrations"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true, "popular": false}',
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