-- CLEAN START: Single migration for NotebookLM Directory
-- No fancy blocks, no complex logic, just working SQL

-- Create notebooks table
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- Enable RLS on all tables
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_notebooks ENABLE ROW LEVEL SECURITY;

-- Simple policies for notebooks
CREATE POLICY "Anyone can read notebooks" ON notebooks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert notebooks" ON notebooks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update notebooks" ON notebooks FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete notebooks" ON notebooks FOR DELETE USING (auth.role() = 'authenticated');

-- Simple policies for profiles
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profiles" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert their own profiles" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Simple policies for saved_notebooks
CREATE POLICY "Users can read their own saved_notebooks" ON saved_notebooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved_notebooks" ON saved_notebooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved_notebooks" ON saved_notebooks FOR DELETE USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_notebooks_updated_at ON notebooks;
CREATE TRIGGER update_notebooks_updated_at
  BEFORE UPDATE ON notebooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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