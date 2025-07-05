/*
  # Spider-Scrapers Database Schema
  
  1. New Tables
    - `scraping_operations` - Track scraping jobs and their status
    - `scraped_items` - Store discovered NotebookLM projects
  
  2. Security
    - Enable RLS on both tables
    - Service role can manage all operations
    - Public can read completed results
  
  3. Indexes
    - Performance indexes for common queries
*/

-- Create scraping_operations table
CREATE TABLE IF NOT EXISTS scraping_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL, -- 'GITHUB', 'REDDIT', 'TWITTER', etc.
  query text NOT NULL,
  max_results integer DEFAULT 20,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  items_found integer DEFAULT 0,
  error_message text,
  results_summary jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create scraped_items table
CREATE TABLE IF NOT EXISTS scraped_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id uuid REFERENCES scraping_operations(id) ON DELETE CASCADE,
  source text NOT NULL,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  author text,
  category text,
  tags text[] DEFAULT '{}',
  quality_score decimal(3,2) DEFAULT 0.5,
  metadata jsonb DEFAULT '{}',
  processed boolean DEFAULT false,
  imported_to_notebooks boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scraping_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scraping_operations
CREATE POLICY "Service role can manage all scraping operations"
  ON scraping_operations
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Public can view completed operations"
  ON scraping_operations
  FOR SELECT
  TO public
  USING (status IN ('completed', 'failed'));

-- RLS Policies for scraped_items
CREATE POLICY "Service role can manage all scraped items"
  ON scraped_items
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Public can view scraped items from completed operations"
  ON scraped_items
  FOR SELECT
  TO public
  USING (
    operation_id IN (
      SELECT id FROM scraping_operations 
      WHERE status IN ('completed', 'failed')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scraping_operations_status ON scraping_operations(status);
CREATE INDEX IF NOT EXISTS idx_scraping_operations_source ON scraping_operations(source);
CREATE INDEX IF NOT EXISTS idx_scraping_operations_created_at ON scraping_operations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scraped_items_operation_id ON scraped_items(operation_id);
CREATE INDEX IF NOT EXISTS idx_scraped_items_source ON scraped_items(source);
CREATE INDEX IF NOT EXISTS idx_scraped_items_quality_score ON scraped_items(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_items_processed ON scraped_items(processed);
CREATE INDEX IF NOT EXISTS idx_scraped_items_imported ON scraped_items(imported_to_notebooks);
CREATE INDEX IF NOT EXISTS idx_scraped_items_created_at ON scraped_items(created_at DESC);

-- Function to automatically import high-quality scraped items to notebooks
CREATE OR REPLACE FUNCTION auto_import_quality_items()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-import items with quality score > 0.7 that haven't been imported yet
  IF NEW.quality_score > 0.7 AND NEW.imported_to_notebooks = false THEN
    INSERT INTO notebooks (
      title,
      description,
      category,
      tags,
      author,
      notebook_url,
      featured
    ) VALUES (
      NEW.title,
      COALESCE(NEW.description, 'Discovered through automated scraping'),
      COALESCE(NEW.category, 'Research'),
      COALESCE(NEW.tags, ARRAY[]::text[]),
      COALESCE(NEW.author, 'Community Contributor'),
      NEW.url,
      NEW.quality_score > 0.8
    );
    
    -- Mark as imported
    NEW.imported_to_notebooks = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-import quality items
CREATE TRIGGER auto_import_quality_scraped_items
  BEFORE INSERT OR UPDATE ON scraped_items
  FOR EACH ROW
  EXECUTE FUNCTION auto_import_quality_items();

-- Function to get scraping statistics
CREATE OR REPLACE FUNCTION get_scraping_stats()
RETURNS jsonb AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_operations', COUNT(*),
    'completed_operations', COUNT(*) FILTER (WHERE status = 'completed'),
    'failed_operations', COUNT(*) FILTER (WHERE status = 'failed'),
    'running_operations', COUNT(*) FILTER (WHERE status = 'running'),
    'total_items_found', COALESCE(SUM(items_found), 0),
    'avg_quality_score', ROUND(AVG((results_summary->>'avg_quality_score')::decimal), 2),
    'sources', jsonb_agg(DISTINCT source),
    'last_operation', MAX(created_at)
  ) INTO stats
  FROM scraping_operations;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql;