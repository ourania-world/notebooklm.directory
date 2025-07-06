-- Update subscription plans to allow unlimited submissions and saves for all plans
INSERT INTO subscription_plans (id, name, description, price, interval, features, limits, active, is_coming_soon) VALUES
('free', 'Explorer', 'Perfect for getting started', 0.00, null, 
 '["Access to all public notebooks", "Browse curated notebook collection", "Basic search features", "Community access", "Save up to 5 notebooks", "Submit unlimited notebooks"]',
 '{"savedNotebooks": 5, "submittedNotebooks": -1, "premiumContent": false, "popular": false}',
 true, false),
 
('standard', 'Standard', 'Great for regular users', 9.99, 'month',
 '["Everything in Explorer", "Unlimited saved notebooks", "Submit unlimited notebooks", "Advanced search features", "Email notifications", "Basic analytics"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": false, "popular": true}',
 true, false),
 
('professional', 'Professional', 'For power users and professionals', 19.99, 'month',
 '["Everything in Standard", "Unlimited saved notebooks", "Submit unlimited notebooks", "Advanced search & AI recommendations", "Performance optimization metrics", "Priority support", "API access (1000 calls/month)", "Export & integration tools"]',
 '{"savedNotebooks": -1, "submittedNotebooks": -1, "premiumContent": true, "popular": false}',
 true, false),
 
('enterprise', 'Enterprise', 'Scale Your Innovation - COMING SOON', 99.00, 'user/month',
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