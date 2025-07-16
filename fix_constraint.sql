-- Fix the subscription_plans interval constraint to allow 'user/month'
ALTER TABLE subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_interval_check;
ALTER TABLE subscription_plans ADD CONSTRAINT subscription_plans_interval_check CHECK (interval IN ('month', 'year', 'user/month', null)); 