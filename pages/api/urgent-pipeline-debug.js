import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const debugResults = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  try {
    // 1. TEST: Check if notebooks table exists and has ANY data
    try {
      const { data: notebooksData, error: notebooksError, count } = await supabaseAdmin
        .from('notebooks')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      debugResults.tests.notebooks_table = {
        exists: !notebooksError,
        total_count: count,
        error: notebooksError?.message || null,
        recent_records: notebooksData || [],
        has_url_column: notebooksData?.[0]?.hasOwnProperty('url') || false,
        has_source_platform: notebooksData?.[0]?.hasOwnProperty('source_platform') || false,
        has_extraction_data: notebooksData?.[0]?.hasOwnProperty('extraction_data') || false
      };
    } catch (error) {
      debugResults.tests.notebooks_table = {
        exists: false,
        error: error.message
      };
    }

    // 2. TEST: Check scraped_items table
    try {
      const { data: scrapedData, error: scrapedError, count } = await supabaseAdmin
        .from('scraped_items')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      debugResults.tests.scraped_items_table = {
        exists: !scrapedError,
        total_count: count,
        error: scrapedError?.message || null,
        recent_records: scrapedData || []
      };
    } catch (error) {
      debugResults.tests.scraped_items_table = {
        exists: false,
        error: error.message
      };
    }

    // 3. TEST: Check scraping_operations table
    try {
      const { data: operationsData, error: operationsError, count } = await supabaseAdmin
        .from('scraping_operations')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(3);

      debugResults.tests.scraping_operations = {
        exists: !operationsError,
        total_count: count,
        error: operationsError?.message || null,
        recent_operations: operationsData || []
      };
    } catch (error) {
      debugResults.tests.scraping_operations = {
        exists: false,
        error: error.message
      };
    }

    // 4. TEST: Try a direct INSERT to notebooks table
    try {
      const testRecord = {
        title: `URGENT DEBUG TEST - ${new Date().toISOString()}`,
        description: 'This is an urgent test to verify database writes are working',
        category: 'Academic',
        author: 'Debug System',
        notebook_url: 'https://debug.test.com',
        url: 'https://debug.test.com',
        source_platform: 'debug',
        extraction_data: { debug: true, timestamp: new Date().toISOString() },
        featured: false
      };

      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('notebooks')
        .insert([testRecord])
        .select();

      debugResults.tests.direct_insert = {
        success: !insertError,
        error: insertError?.message || null,
        inserted_record: insertData?.[0] || null
      };
    } catch (error) {
      debugResults.tests.direct_insert = {
        success: false,
        error: error.message
      };
    }

    // 5. TEST: Check what getNotebooks function returns
    try {
      const { getNotebooks } = await import('../../lib/notebooks');
      const browseData = await getNotebooks({ limit: 5 });
      
      debugResults.tests.browse_page_data = {
        success: true,
        count: browseData?.length || 0,
        data: browseData || [],
        is_fallback_data: browseData?.[0]?.title?.includes('Climate Research') || false
      };
    } catch (error) {
      debugResults.tests.browse_page_data = {
        success: false,
        error: error.message
      };
    }

    // 6. CRITICAL: Check Supabase connection
    try {
      const { data, error } = await supabaseAdmin.from('notebooks').select('count', { count: 'exact', head: true });
      debugResults.tests.supabase_connection = {
        connected: !error,
        error: error?.message || null
      };
    } catch (error) {
      debugResults.tests.supabase_connection = {
        connected: false,
        error: error.message
      };
    }

    // SUMMARY
    debugResults.critical_findings = {
      database_connected: debugResults.tests.supabase_connection?.connected || false,
      notebooks_table_accessible: debugResults.tests.notebooks_table?.exists || false,
      can_write_to_database: debugResults.tests.direct_insert?.success || false,
      browse_page_shows_real_data: (debugResults.tests.browse_page_data?.count || 0) > 0 && !debugResults.tests.browse_page_data?.is_fallback_data,
      total_notebooks_in_db: debugResults.tests.notebooks_table?.total_count || 0,
      columns_added_successfully: debugResults.tests.notebooks_table?.has_url_column && debugResults.tests.notebooks_table?.has_source_platform
    };

    return res.status(200).json(debugResults);

  } catch (error) {
    console.error('Critical error in pipeline debug:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}