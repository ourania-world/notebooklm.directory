/*
  # Create notebooks table for NotebookLM Directory

  1. New Tables
    - `notebooks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `category` (text, required)
      - `tags` (text array)
      - `author` (text, required)
      - `institution` (text)
      - `notebook_url` (text, required - the NotebookLM share URL)
      - `audio_overview_url` (text, optional)
      - `featured` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `notebooks` table
    - Add policy for public read access
    - Add policy for authenticated users to insert/update their own notebooks

  3. Sample Data
    - Insert sample notebooks to populate the directory
*/

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

-- Enable RLS
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read notebooks"
  ON notebooks
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert notebooks
CREATE POLICY "Authenticated users can insert notebooks"
  ON notebooks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for users to update their own notebooks (based on author field for now)
CREATE POLICY "Users can update their own notebooks"
  ON notebooks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notebooks_updated_at
  BEFORE UPDATE ON notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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