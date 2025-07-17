import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const results = [];
    
    // Create a new table with the correct schema using plain table creation
    // We'll name it "scraped_content" to avoid conflicts
    const testData = {
      operation_id: 'test-' + Date.now(),
      source: 'reddit',
      title: 'Test Post',
      description: 'Test description',
      url: 'https://test.com',
      author: 'testuser',
      quality_score: 0.75,
      metadata: { test: true },
      ai_analysis: { processed: true },
      featured: false
    };

    try {
      // Try to create a table by inserting data (this will fail if table doesn't exist)
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('scraped_content')
        .insert([testData])
        .select();

      if (insertError) {
        results.push(`Table doesn't exist or schema mismatch: ${insertError.message}`);
      } else {
        results.push(`✅ Table exists and insertion successful: ${insertData.length} item(s)`);
      }
    } catch (error) {
      results.push(`Error testing table: ${error.message}`);
    }

    // Since we can't create tables via SQL, let's modify the scraping code to work with the existing table
    // Let's check what columns the existing scraped_items table actually has
    try {
      // Try a minimal insert to see what works
      const minimalData = {
        id: 'test-' + Date.now(),
        title: 'Test Post',
        description: 'Test description',
        url: 'https://test.com'
      };

      const { data: minimalInsert, error: minimalError } = await supabaseAdmin
        .from('scraped_items')
        .insert([minimalData])
        .select();

      if (minimalError) {
        results.push(`Minimal insert failed: ${minimalError.message}`);
      } else {
        results.push(`✅ Minimal insert successful - table has basic columns`);
      }
    } catch (error) {
      results.push(`Minimal insert error: ${error.message}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Table analysis completed',
      results,
      recommendation: 'Need to modify scraping code to match existing table schema or recreate table in Supabase dashboard'
    });
  } catch (error) {
    console.error('Error analyzing scraped table:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze scraped table',
      error: error.message
    });
  }
}