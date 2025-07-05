/*
  # Complete Monetization & Analytics Infrastructure
  
  1. Subscription Management Tables
    - subscription_plans (plan definitions)
    - subscriptions (user subscriptions)
    - payments (payment history)
  
  2. Analytics & Engagement Tables
    - user_events (activity tracking)
    - notebook_analytics (performance metrics)
    - search_analytics (search tracking)
  
  3. Enhanced Notebooks Schema
    - Add view_count, save_count, share_count
    - Add premium content flags
    - Add performance tracking
  
  4. User Preferences & Personalization
    - user_preferences (settings)
    - user_recommendations (personalized content)
  
  5. Security & Access Control
    - RLS policies for premium content
    - Subscription-based access control
*/

-- Create subscription plans table
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

-- Create subscriptions table
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

-- Create payments table
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

-- Create user events table for analytics
CREATE TABLE IF NOT EXISTS user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create notebook analytics table
CREATE TABLE IF NOT EXISTS notebook_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id uuid REFERENCES notebooks(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  views integer DEFAULT 0,
  saves integer DEFAULT 0,
  shares integer DEFAULT 0,
  unique_viewers integer DEFAULT 0,
  avg_time_spent interval,
  created_at timestamptz DEFAULT now(),
  UNIQUE(notebook_id, date)
);

-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  category text,
  results_count integer DEFAULT 0,
  clicked_result_id uuid REFERENCES notebooks(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  preferred_categories text[] DEFAULT '{}',
  email_notifications boolean DEFAULT true,
  weekly_digest boolean DEFAULT true,
  theme text DEFAULT 'dark',
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user recommendations table
CREATE TABLE IF NOT EXISTS user_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  notebook_id uuid REFERENCES notebooks(id) ON DELETE CASCADE,
  score decimal(3,2) DEFAULT 0.5,
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, notebook_id)
);

-- Add analytics columns to notebooks table if they don't exist
DO $$
BEGIN
  -- Add view_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notebooks' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE notebooks ADD COLUMN view_count integer DEFAULT 0;
  END IF;

  -- Add save_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notebooks' AND column_name = 'save_count'
  ) THEN
    ALTER TABLE notebooks ADD COLUMN save_count integer DEFAULT 0;
  END IF;

  -- Add share_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notebooks' AND column_name = 'share_count'
  ) THEN
    ALTER TABLE notebooks ADD COLUMN share_count integer DEFAULT 0;
  END IF;

  -- Add premium column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notebooks' AND column_name = 'premium'
  ) THEN
    ALTER TABLE notebooks ADD COLUMN premium boolean DEFAULT false;
  END IF;

  -- Add last_viewed_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notebooks' AND column_name = 'last_viewed_at'
  ) THEN
    ALTER TABLE notebooks ADD COLUMN last_viewed_at timestamptz;
  END IF;
END $$;

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

-- Enable RLS on new tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for user_events
CREATE POLICY "Users can view their own events"
  ON user_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage events"
  ON user_events
  FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for notebook_analytics
CREATE POLICY "Anyone can view notebook analytics"
  ON notebook_analytics
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage analytics"
  ON notebook_analytics
  FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for search_analytics
CREATE POLICY "Service role can manage search analytics"
  ON search_analytics
  FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_recommendations
CREATE POLICY "Users can view their own recommendations"
  ON user_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage recommendations"
  ON user_recommendations
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

-- Functions for analytics
CREATE OR REPLACE FUNCTION increment_notebook_view_count(notebook_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE notebooks 
  SET view_count = COALESCE(view_count, 0) + 1,
      last_viewed_at = now()
  WHERE id = notebook_uuid;
  
  -- Update daily analytics
  INSERT INTO notebook_analytics (notebook_id, date, views, unique_viewers)
  VALUES (notebook_uuid, CURRENT_DATE, 1, 1)
  ON CONFLICT (notebook_id, date)
  DO UPDATE SET 
    views = notebook_analytics.views + 1,
    unique_viewers = notebook_analytics.unique_viewers + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_notebook_save_count(notebook_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE notebooks 
  SET save_count = COALESCE(save_count, 0) + 1
  WHERE id = notebook_uuid;
  
  -- Update daily analytics
  INSERT INTO notebook_analytics (notebook_id, date, saves)
  VALUES (notebook_uuid, CURRENT_DATE, 1)
  ON CONFLICT (notebook_id, date)
  DO UPDATE SET saves = notebook_analytics.saves + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic analytics updates
CREATE OR REPLACE FUNCTION update_save_count_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM increment_notebook_save_count(NEW.notebook_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_save_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE notebooks 
  SET save_count = GREATEST(COALESCE(save_count, 0) - 1, 0)
  WHERE id = OLD.notebook_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS saved_notebooks_insert_trigger ON saved_notebooks;
CREATE TRIGGER saved_notebooks_insert_trigger
  AFTER INSERT ON saved_notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_save_count_on_insert();

DROP TRIGGER IF EXISTS saved_notebooks_delete_trigger ON saved_notebooks;
CREATE TRIGGER saved_notebooks_delete_trigger
  AFTER DELETE ON saved_notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_save_count_on_delete();

-- Update existing notebooks with initial counts
UPDATE notebooks SET 
  view_count = COALESCE(view_count, 0),
  save_count = (
    SELECT COUNT(*) FROM saved_notebooks 
    WHERE notebook_id = notebooks.id
  ),
  share_count = COALESCE(share_count, 0)
WHERE view_count IS NULL OR save_count IS NULL OR share_count IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);
CREATE INDEX IF NOT EXISTS idx_notebook_analytics_notebook_id ON notebook_analytics(notebook_id);
CREATE INDEX IF NOT EXISTS idx_notebook_analytics_date ON notebook_analytics(date);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_notebooks_view_count ON notebooks(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_notebooks_save_count ON notebooks(save_count DESC);
CREATE INDEX IF NOT EXISTS idx_notebooks_premium ON notebooks(premium);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_user_id ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_score ON user_recommendations(score DESC);