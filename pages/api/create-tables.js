import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const results = [];
    
    // First, let's test if the tables exist by trying to query them
    try {
      const { data: testScrapedItems, error: scrapedItemsError } = await supabaseAdmin
        .from('scraped_items')
        .select('id')
        .limit(1);
      
      if (scrapedItemsError) {
        results.push(`scraped_items table check: ${scrapedItemsError.message}`);
      } else {
        results.push('scraped_items table exists');
      }
    } catch (error) {
      results.push(`scraped_items table error: ${error.message}`);
    }

    try {
      const { data: testOperations, error: operationsError } = await supabaseAdmin
        .from('scraping_operations')
        .select('id')
        .limit(1);
      
      if (operationsError) {
        results.push(`scraping_operations table check: ${operationsError.message}`);
      } else {
        results.push('scraping_operations table exists');
      }
    } catch (error) {
      results.push(`scraping_operations table error: ${error.message}`);
    }

    // Let's also check what tables do exist
    try {
      const { data: existingTables, error: tableError } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tableError) {
        results.push(`Table listing error: ${tableError.message}`);
      } else {
        results.push(`Existing tables: ${existingTables.map(t => t.table_name).join(', ')}`);
      }
    } catch (error) {
      results.push(`Table listing error: ${error.message}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Table existence check completed',
      results
    });
  } catch (error) {
    console.error('Error checking tables:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check tables',
      error: error.message
    });
  }
}