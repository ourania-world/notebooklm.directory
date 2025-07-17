import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const results = [];
    
    // Check what columns already exist in notebooks table
    const { data: existingData, error: existingError } = await supabaseAdmin
      .from('notebooks')
      .select('*')
      .limit(1);

    if (existingError) {
      results.push(`Error checking existing columns: ${existingError.message}`);
    } else {
      results.push(`✅ Notebooks table accessible with ${Object.keys(existingData[0] || {}).length} columns`);
      results.push(`Existing columns: ${Object.keys(existingData[0] || {}).join(', ')}`);
    }

    // Test if we can add the missing columns by trying to insert data with them
    const testData = {
      title: 'Test Scraped Content',
      description: 'Test description for column validation',
      category: 'Academic',
      author: 'Test Author',
      notebook_url: 'https://test.com',
      url: 'https://reddit.com/test',
      source_platform: 'reddit',
      extraction_data: {
        scraped_at: new Date().toISOString(),
        quality_score: 0.75,
        source: 'reddit'
      },
      featured: false
    };

    // Try inserting with the new columns
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('notebooks')
      .insert([testData])
      .select();

    if (insertError) {
      results.push(`❌ Column test failed: ${insertError.message}`);
      
      // Check which specific columns are missing
      const missingColumns = [];
      if (insertError.message.includes('url')) missingColumns.push('url');
      if (insertError.message.includes('source_platform')) missingColumns.push('source_platform');
      if (insertError.message.includes('extraction_data')) missingColumns.push('extraction_data');
      
      results.push(`Missing columns identified: ${missingColumns.join(', ')}`);
      
      // Provide SQL commands to add these columns
      const sqlCommands = [
        'ALTER TABLE notebooks ADD COLUMN IF NOT EXISTS url text;',
        'ALTER TABLE notebooks ADD COLUMN IF NOT EXISTS source_platform text;',
        'ALTER TABLE notebooks ADD COLUMN IF NOT EXISTS extraction_data jsonb DEFAULT \'{}\';'
      ];
      
      results.push('📝 SQL commands to run in Supabase dashboard:');
      results.push(sqlCommands.join('\n'));
      
    } else {
      results.push(`✅ SUCCESS! All columns exist and test data inserted: ${insertData.length} item(s)`);
      results.push(`Inserted data ID: ${insertData[0]?.id}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Column analysis completed',
      results,
      nextStep: insertError ? 'Add missing columns in Supabase dashboard' : 'Ready to test scraping flow!'
    });
  } catch (error) {
    console.error('Error checking columns:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check columns',
      error: error.message
    });
  }
}