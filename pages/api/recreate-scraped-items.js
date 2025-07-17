import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const results = [];
    
    // Step 1: Drop existing table if it exists
    try {
      const { error: dropError } = await supabaseAdmin.rpc('exec_sql', {
        sql: 'DROP TABLE IF EXISTS scraped_items CASCADE;'
      });
      
      if (dropError) {
        results.push(`Warning: Could not drop table: ${dropError.message}`);
      } else {
        results.push('✅ Dropped existing scraped_items table');
      }
    } catch (error) {
      results.push(`Warning: Drop table failed: ${error.message}`);
    }

    // Step 2: Create table with correct schema
    const createTableSQL = `
      CREATE TABLE scraped_items (
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
    `;

    try {
      const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
        sql: createTableSQL
      });
      
      if (createError) {
        results.push(`❌ Failed to create table: ${createError.message}`);
      } else {
        results.push('✅ Created scraped_items table with correct schema');
      }
    } catch (error) {
      results.push(`❌ Create table failed: ${error.message}`);
    }

    // Step 3: Add RLS policies
    const policiesSQL = `
      ALTER TABLE scraped_items ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can read scraped items" ON scraped_items 
        FOR SELECT USING (true);
      
      CREATE POLICY "Authenticated users can insert scraped items" ON scraped_items 
        FOR INSERT WITH CHECK (true);
    `;

    try {
      const { error: policiesError } = await supabaseAdmin.rpc('exec_sql', {
        sql: policiesSQL
      });
      
      if (policiesError) {
        results.push(`Warning: Could not create policies: ${policiesError.message}`);
      } else {
        results.push('✅ Created RLS policies');
      }
    } catch (error) {
      results.push(`Warning: Policies failed: ${error.message}`);
    }

    // Step 4: Test insertion
    const testData = {
      operation_id: 'test-' + Date.now(),
      source: 'reddit',
      title: 'Test Post',
      description: 'Test description',
      url: 'https://test.com',
      author: 'testuser',
      quality_score: 0.75,
      metadata: { test: true }
    };

    try {
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('scraped_items')
        .insert([testData])
        .select();

      if (insertError) {
        results.push(`❌ Test insertion failed: ${insertError.message}`);
      } else {
        results.push(`✅ Test insertion successful: ${insertData.length} item(s)`);
      }
    } catch (error) {
      results.push(`❌ Test insertion error: ${error.message}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Table recreation completed',
      results
    });
  } catch (error) {
    console.error('Error recreating scraped_items:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to recreate scraped_items table',
      error: error.message
    });
  }
}