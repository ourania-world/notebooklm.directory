/*
  # Create profiles and saved_notebooks tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `bio` (text)
      - `institution` (text)
      - `website` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `saved_notebooks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `notebook_id` (uuid, references notebooks)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for appropriate access control

  3. Functions & Triggers
    - Auto-create profile on user signup
    - Update saved count on notebooks when saved/unsaved
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  full_name text,
  bio text,
  institution text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_notebooks table
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

-- Enable RLS on new tables
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

-- Update notebooks policies for user ownership
DROP POLICY IF EXISTS "Users can update their own notebooks" ON notebooks;
CREATE POLICY "Users can update their own notebooks"
  ON notebooks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
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