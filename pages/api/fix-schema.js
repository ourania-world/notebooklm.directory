import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fixes = [];
    
    // 1. Add missing columns to notebooks table
    try {
      const { error: contentTypeError } = await supabaseAdmin
        .from('notebooks')
        .select('content_type')
        .limit(1);
      
      if (contentTypeError && contentTypeError.code === 'PGRST204') {
        // Column doesn't exist, add it
        const { error } = await supabaseAdmin.query(`
          ALTER TABLE notebooks ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'notebook';
        `);
        fixes.push(error ? `Failed to add content_type: ${error.message}` : 'Added content_type column');
      } else {
        fixes.push('content_type column already exists');
      }
    } catch (error) {
      fixes.push(`Error checking content_type: ${error.message}`);
    }

    // 2. Add popularity_score column
    try {
      const { error: popularityError } = await supabaseAdmin
        .from('notebooks')
        .select('popularity_score')
        .limit(1);
      
      if (popularityError && popularityError.code === 'PGRST204') {
        // Column doesn't exist, add it
        const { error } = await supabaseAdmin.query(`
          ALTER TABLE notebooks ADD COLUMN IF NOT EXISTS popularity_score real DEFAULT 0.5;
        `);
        fixes.push(error ? `Failed to add popularity_score: ${error.message}` : 'Added popularity_score column');
      } else {
        fixes.push('popularity_score column already exists');
      }
    } catch (error) {
      fixes.push(`Error checking popularity_score: ${error.message}`);
    }

    // 3. Create scraped_items table
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS scraped_items (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            operation_id text NOT NULL,
            title text NOT NULL,
            description text NOT NULL,
            url text NOT NULL,
            author text,
            quality_score real DEFAULT 0.5 CHECK (quality_score >= 0 AND quality_score <= 1),
            source text NOT NULL CHECK (source IN ('reddit', 'github', 'arxiv', 'notebooklm')),
            metadata jsonb DEFAULT '{}',
            ai_analysis jsonb DEFAULT '{}',
            featured boolean DEFAULT false,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
          );
          
          ALTER TABLE scraped_items ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS "Anyone can read scraped items" ON scraped_items;
          CREATE POLICY "Anyone can read scraped items" ON scraped_items FOR SELECT USING (true);
          DROP POLICY IF EXISTS "Authenticated users can insert scraped items" ON scraped_items;
          CREATE POLICY "Authenticated users can insert scraped items" ON scraped_items FOR INSERT WITH CHECK (true);
        `
      });
      
      fixes.push(error ? `Failed to create scraped_items: ${error.message}` : 'Created scraped_items table');
    } catch (error) {
      fixes.push(`Error creating scraped_items: ${error.message}`);
    }

    // 4. Create scraping_operations table
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
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
          
          ALTER TABLE scraping_operations ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS "Anyone can read scraping operations" ON scraping_operations;
          CREATE POLICY "Anyone can read scraping operations" ON scraping_operations FOR SELECT USING (true);
          DROP POLICY IF EXISTS "Authenticated users can manage scraping operations" ON scraping_operations;
          CREATE POLICY "Authenticated users can manage scraping operations" ON scraping_operations FOR ALL WITH CHECK (true);
        `
      });
      
      fixes.push(error ? `Failed to create scraping_operations: ${error.message}` : 'Created scraping_operations table');
    } catch (error) {
      fixes.push(`Error creating scraping_operations: ${error.message}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Schema fixes applied',
      fixes
    });
  } catch (error) {
    console.error('Error fixing schema:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fix schema',
      error: error.message
    });
  }
}