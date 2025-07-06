/*
  # Create Profiles and Saved Notebooks Tables
  
  1. New Tables
    - `profiles` - User profile information
    - `saved_notebooks` - Junction table for users' saved notebooks
  
  2. Security
    - Enable RLS on all tables
    - Create appropriate policies for data access
  
  3. Functions & Triggers
    - Auto-create profile on user signup
    - Update timestamps automatically
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  full_name text,
  bio text,
  institution text,
  website text,
  subscription_tier text DEFAULT 'free',
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_notebooks table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  notebook_id uuid REFERENCES notebooks ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, notebook_id)
);

-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_notebooks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Saved notebooks policies
CREATE POLICY "Users can view their own saved notebooks"
  ON saved_notebooks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save notebooks"
  ON saved_notebooks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave notebooks"
  ON saved_notebooks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update notebook save count on insert/delete
CREATE OR REPLACE FUNCTION update_save_count_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE notebooks 
  SET save_count = COALESCE(save_count, 0) + 1
  WHERE id = NEW.notebook_id;
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

-- Create triggers for saved_notebooks
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_notebooks_user_id ON saved_notebooks(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_notebooks_notebook_id ON saved_notebooks(notebook_id);