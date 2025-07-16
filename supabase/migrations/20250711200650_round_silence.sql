/*
  # Create Basic Tables for NotebookLM Directory
  
  1. New Tables
    - `notebooks` - Main table for storing notebook information
    - `profiles` - User profile information
    - `saved_notebooks` - Junction table for users' saved notebooks
  
  2. Security
    - Enable RLS on all tables
    - Create appropriate policies for data access
  
  3. Sample Data
    - Insert sample notebooks to populate the directory
*/

-- Create notebooks table if it doesn't exist
CREATE TABLE IF NOT EXISTS notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Academic', 'Business', 'Creative', 'Research', 'Education', 'Personal')),
  tags text[] DEFAULT '{}',
  author text NOT NULL,
  institution text,
  notebook_url text NOT NULL,
  audio_overview_url text,
  featured boolean DEFAULT false,
  premium boolean DEFAULT false,
  view_count integer DEFAULT 0,
  save_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  user_id uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- Enable RLS on all tables
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_notebooks ENABLE ROW LEVEL SECURITY;

-- Create policies for notebooks
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

-- Create policies for profiles
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

-- Create policies for saved_notebooks
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

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create update triggers
CREATE TRIGGER update_notebooks_updated_at
  BEFORE UPDATE ON notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update notebook save count on insert/delete
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
CREATE TRIGGER saved_notebooks_insert_trigger
  AFTER INSERT ON saved_notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_save_count_on_insert();

CREATE TRIGGER saved_notebooks_delete_trigger
  AFTER DELETE ON saved_notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_save_count_on_delete();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_notebook_view_count(notebook_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE notebooks 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = notebook_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured) VALUES
(
  'Academic Literature Review Assistant',
  'Automated analysis of 50+ research papers on climate change impacts, generating comprehensive summaries and identifying research gaps.',
  'Academic',
  ARRAY['Climate Science', 'Literature Review', 'Research'],
  'Dr. Sarah Chen',
  'Stanford University',
  'https://notebooklm.google.com/notebook/example1',
  true
),
(
  'Startup Pitch Deck Analyzer',
  'Comprehensive analysis of successful startup pitch decks, extracting key patterns and success factors for entrepreneurs.',
  'Business',
  ARRAY['Entrepreneurship', 'Pitch Decks', 'Business Strategy'],
  'Mike Rodriguez',
  'Y Combinator Alumni',
  'https://notebooklm.google.com/notebook/example2',
  true
),
(
  'Creative Writing Workshop',
  'Analysis of award-winning short stories to understand narrative techniques, character development, and storytelling patterns.',
  'Creative',
  ARRAY['Creative Writing', 'Literature', 'Storytelling'],
  'Emma Thompson',
  'Independent Writer',
  'https://notebooklm.google.com/notebook/example3',
  false
),
(
  'Medical Research Synthesis',
  'Comprehensive analysis of recent COVID-19 treatment studies, synthesizing findings across multiple clinical trials.',
  'Research',
  ARRAY['Medical Research', 'COVID-19', 'Clinical Trials'],
  'Dr. James Wilson',
  'Johns Hopkins',
  'https://notebooklm.google.com/notebook/example4',
  false
),
(
  'Educational Curriculum Designer',
  'Analysis of effective online learning materials to design engaging computer science curriculum for high school students.',
  'Education',
  ARRAY['Curriculum Design', 'Computer Science', 'Online Learning'],
  'Prof. Lisa Park',
  'MIT',
  'https://notebooklm.google.com/notebook/example5',
  false
),
(
  'Personal Finance Optimizer',
  'Analysis of personal spending patterns and investment strategies to create customized financial planning recommendations.',
  'Personal',
  ARRAY['Personal Finance', 'Investment', 'Budgeting'],
  'Alex Kim',
  'Personal Project',
  'https://notebooklm.google.com/notebook/example6',
  false
);

-- Create audio bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to audio files
CREATE POLICY "Public audio access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio');

-- Allow authenticated users to upload audio
CREATE POLICY "Authenticated upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio');

-- Allow authenticated users to update their own audio files
CREATE POLICY "Authenticated update audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'audio' AND (auth.uid() = owner OR owner IS NULL));

-- Allow authenticated users to delete their own audio files
CREATE POLICY "Authenticated delete audio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'audio' AND (auth.uid() = owner OR owner IS NULL));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notebooks_category ON notebooks(category);
CREATE INDEX IF NOT EXISTS idx_notebooks_featured ON notebooks(featured);
CREATE INDEX IF NOT EXISTS idx_notebooks_user_id ON notebooks(user_id);
CREATE INDEX IF NOT EXISTS idx_notebooks_view_count ON notebooks(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_notebooks_save_count ON notebooks(save_count DESC);
CREATE INDEX IF NOT EXISTS idx_saved_notebooks_user_id ON saved_notebooks(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_notebooks_notebook_id ON saved_notebooks(notebook_id);