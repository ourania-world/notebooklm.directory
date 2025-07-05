/*
  # Safe Database Setup - Handles Existing Policies
  
  This migration safely sets up the complete database schema while handling
  any existing policies or tables gracefully.
  
  1. Tables
    - notebooks (with all required columns)
    - profiles (user profile information)
    - saved_notebooks (bookmark functionality)
  
  2. Security
    - Safely recreates all RLS policies
    - Handles existing policy conflicts
    - Ensures proper user data isolation
  
  3. Functions & Triggers
    - Auto-create profiles on signup
    - Update timestamps automatically
*/

-- Function to safely drop policies
CREATE OR REPLACE FUNCTION drop_policy_if_exists(policy_name text, table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
EXCEPTION
  WHEN undefined_object THEN
    -- Policy doesn't exist, that's fine
    NULL;
  WHEN undefined_table THEN
    -- Table doesn't exist, that's fine
    NULL;
END;
$$ LANGUAGE plpgsql;

-- Safely drop all existing policies
SELECT drop_policy_if_exists('Anyone can read notebooks', 'notebooks');
SELECT drop_policy_if_exists('Authenticated users can insert notebooks', 'notebooks');
SELECT drop_policy_if_exists('Users can update their own notebooks', 'notebooks');
SELECT drop_policy_if_exists('Public profiles are viewable by everyone', 'profiles');
SELECT drop_policy_if_exists('Users can insert their own profile', 'profiles');
SELECT drop_policy_if_exists('Users can update their own profile', 'profiles');
SELECT drop_policy_if_exists('Users can view their own saved notebooks', 'saved_notebooks');
SELECT drop_policy_if_exists('Users can save notebooks', 'saved_notebooks');
SELECT drop_policy_if_exists('Users can unsave notebooks', 'saved_notebooks');

-- Drop the helper function
DROP FUNCTION drop_policy_if_exists(text, text);

-- Ensure notebooks table has correct structure
DO $$
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notebooks' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE notebooks ADD COLUMN user_id uuid REFERENCES auth.users;
  END IF;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  full_name text,
  bio text,
  institution text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_notebooks table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  notebook_id uuid REFERENCES notebooks ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'saved_notebooks_user_id_notebook_id_key'
    AND table_name = 'saved_notebooks'
  ) THEN
    ALTER TABLE saved_notebooks ADD CONSTRAINT saved_notebooks_user_id_notebook_id_key UNIQUE(user_id, notebook_id);
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_notebooks ENABLE ROW LEVEL SECURITY;

-- Create fresh policies for notebooks
CREATE POLICY "Anyone can read notebooks"
  ON notebooks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert notebooks"
  ON notebooks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notebooks"
  ON notebooks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create fresh policies for profiles
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

-- Create fresh policies for saved_notebooks
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

-- Create or replace the profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safely recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create or replace update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Safely recreate update triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notebooks_updated_at ON notebooks;
CREATE TRIGGER update_notebooks_updated_at
  BEFORE UPDATE ON notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();