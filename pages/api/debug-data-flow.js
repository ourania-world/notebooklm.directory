import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const debugResults = [];
    
    // 1. Check notebooks table contents
    try {
      const { data: notebooksData, error: notebooksError } = await supabaseAdmin
        .from('notebooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      debugResults.push({
        table: 'notebooks',
        count: notebooksData?.length || 0,
        error: notebooksError?.message || null,
        sampleData: notebooksData?.slice(0, 3) || []
      });
    } catch (error) {
      debugResults.push({
        table: 'notebooks',
        count: 0,
        error: error.message,
        sampleData: []
      });
    }

    // 2. Check scraped_items table contents
    try {
      const { data: scrapedData, error: scrapedError } = await supabaseAdmin
        .from('scraped_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      debugResults.push({
        table: 'scraped_items',
        count: scrapedData?.length || 0,
        error: scrapedError?.message || null,
        sampleData: scrapedData?.slice(0, 3) || []
      });
    } catch (error) {
      debugResults.push({
        table: 'scraped_items',
        count: 0,
        error: error.message,
        sampleData: []
      });
    }

    // 3. Check scraping_operations table
    try {
      const { data: operationsData, error: operationsError } = await supabaseAdmin
        .from('scraping_operations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      debugResults.push({
        table: 'scraping_operations',
        count: operationsData?.length || 0,
        error: operationsError?.message || null,
        sampleData: operationsData?.slice(0, 3) || []
      });
    } catch (error) {
      debugResults.push({
        table: 'scraping_operations',
        count: 0,
        error: error.message,
        sampleData: []
      });
    }

    // 4. Test a direct insert to notebooks table
    try {
      const testNotebook = {
        title: 'DEBUG TEST - ' + new Date().toISOString(),
        description: 'This is a test insert to verify database write capability',
        category: 'Academic',
        author: 'Debug System',
        notebook_url: 'https://test.com/debug',
        url: 'https://reddit.com/r/test/debug',
        source_platform: 'reddit',
        extraction_data: {
          debug: true,
          timestamp: new Date().toISOString()
        },
        featured: false
      };

      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('notebooks')
        .insert([testNotebook])
        .select();

      debugResults.push({
        table: 'notebooks_insert_test',
        count: insertData?.length || 0,
        error: insertError?.message || null,
        sampleData: insertData || []
      });
    } catch (error) {
      debugResults.push({
        table: 'notebooks_insert_test',
        count: 0,
        error: error.message,
        sampleData: []
      });
    }

    // 5. Check what the browse page getNotebooks function returns
    try {
      const { getNotebooks } = await import('../../lib/notebooks');
      const browsePagesData = await getNotebooks({ limit: 5 });
      
      debugResults.push({
        table: 'browse_page_getNotebooks',
        count: browsePagesData?.length || 0,
        error: null,
        sampleData: browsePagesData?.slice(0, 3) || []
      });
    } catch (error) {
      debugResults.push({
        table: 'browse_page_getNotebooks',
        count: 0,
        error: error.message,
        sampleData: []
      });
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      debugResults,
      summary: {
        totalNotebooks: debugResults.find(r => r.table === 'notebooks')?.count || 0,
        totalScrapedItems: debugResults.find(r => r.table === 'scraped_items')?.count || 0,
        totalOperations: debugResults.find(r => r.table === 'scraping_operations')?.count || 0,
        browsePageData: debugResults.find(r => r.table === 'browse_page_getNotebooks')?.count || 0
      }
    });
  } catch (error) {
    console.error('Error in debug data flow:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}