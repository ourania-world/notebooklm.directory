/*
  # Update Subscription Plans for Unlimited Submissions
  
  1. Changes
    - All plans now have unlimited notebook submissions
    - Standard plan now has unlimited saved notebooks
    - Update plan descriptions and features for clarity
    - Remove environmental messaging
  
  2. Updates
    - Modify existing subscription_plans table entries
    - Keep all other plan details intact
*/

-- Update all subscription plans to have unlimited submissions
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