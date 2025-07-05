/*
  # Fix existing policies - Safe migration
  
  This migration safely handles existing policies and ensures all required
  tables and policies exist without conflicts.
  
  1. Drop existing policies if they exist
  2. Recreate all policies with proper permissions
  3. Ensure all tables have correct RLS settings
*/

-- Safely drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop profiles policies if they exist
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
  
  -- Drop saved_notebooks policies if they exist
  DROP POLICY IF EXISTS "Users can view their own saved notebooks" ON saved_notebooks;
  DROP POLICY IF EXISTS "Users can save notebooks" ON saved_notebooks;
  DROP POLICY IF EXISTS "Users can unsave notebooks" ON saved_notebooks;
  
  -- Drop notebooks policies if they exist
  DROP POLICY IF EXISTS "Users can update their own notebooks" ON notebooks;
EXCEPTION
  WHEN undefined_table THEN
    -- Tables don't exist yet, that's fine
    NULL;
  WHEN undefined_object THEN
    -- Policies don't exist yet, that's fine
    NULL;
END $$;

-- Ensure profiles table exists
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  full_name text,
  bio text,
  institution text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure saved_notebooks table exists
CREATE TABLE IF NOT EXISTS saved_notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  notebook_id uuid REFERENCES notebooks ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, notebook_id)
);

-- Add user_id to notebooks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notebooks' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE notebooks ADD COLUMN user_id uuid REFERENCES auth.users;
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
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

-- Create saved_notebooks policies
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

-- Create notebooks policies
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

-- Recreate the trigger
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

-- Create update triggers if they don't exist
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