-- Create scraping_operations table to track scraping jobs
CREATE TABLE IF NOT EXISTS scraping_operations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    operation_id text NOT NULL UNIQUE,
    source text NOT NULL CHECK (source IN ('reddit', 'github', 'arxiv', 'notebooklm')),
    query text,
    max_results integer DEFAULT 10,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    items_found integer DEFAULT 0,
    results_summary jsonb,
    error_message text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create scraped_items table to store scraped content
CREATE TABLE IF NOT EXISTS scraped_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    operation_id text NOT NULL REFERENCES scraping_operations(operation_id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    author text,
    quality_score real DEFAULT 0.5 CHECK (quality_score >= 0 AND quality_score <= 1),
    source text NOT NULL CHECK (source IN ('reddit', 'github', 'arxiv', 'notebooklm')),
    metadata jsonb DEFAULT '{}',
    ai_analysis jsonb DEFAULT '{}',
    embedding vector(1536), -- For future vector search
    featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_scraping_operations_status ON scraping_operations(status);
CREATE INDEX IF NOT EXISTS idx_scraping_operations_source ON scraping_operations(source);
CREATE INDEX IF NOT EXISTS idx_scraping_operations_created_at ON scraping_operations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scraped_items_operation_id ON scraped_items(operation_id);
CREATE INDEX IF NOT EXISTS idx_scraped_items_source ON scraped_items(source);
CREATE INDEX IF NOT EXISTS idx_scraped_items_quality_score ON scraped_items(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_items_created_at ON scraped_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_items_featured ON scraped_items(featured) WHERE featured = true;

-- Add full-text search index for better search performance
CREATE INDEX IF NOT EXISTS idx_scraped_items_search ON scraped_items USING gin(
    to_tsvector('english', title || ' ' || description || ' ' || COALESCE(author, ''))
);

-- Add RLS policies for scraped_items (public read access)
ALTER TABLE scraped_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scraped items" ON scraped_items
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert scraped items" ON scraped_items
    FOR INSERT WITH CHECK (true);

-- Add RLS policies for scraping_operations (admin access)
ALTER TABLE scraping_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scraping operations" ON scraping_operations
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage scraping operations" ON scraping_operations
    FOR ALL WITH CHECK (true);

-- Add content_type column to notebooks table (referenced in error)
ALTER TABLE notebooks ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'notebook';

-- Add popularity_score column to notebooks table (referenced in error)
ALTER TABLE notebooks ADD COLUMN IF NOT EXISTS popularity_score real DEFAULT 0.5;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scraping_operations_updated_at BEFORE UPDATE ON scraping_operations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scraped_items_updated_at BEFORE UPDATE ON scraped_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();