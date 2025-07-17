import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check scraped_items table
    const { data: scrapedItems, error: scrapedError } = await supabaseAdmin
      .from('scraped_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Check scraping_operations table
    const { data: operations, error: operationsError } = await supabaseAdmin
      .from('scraping_operations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    return res.status(200).json({
      success: true,
      scraped_items: {
        count: scrapedItems?.length || 0,
        data: scrapedItems || [],
        error: scrapedError?.message || null
      },
      scraping_operations: {
        count: operations?.length || 0,
        data: operations || [],
        error: operationsError?.message || null
      }
    });
  } catch (error) {
    console.error('Error checking scraped items:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check scraped items',
      error: error.message
    });
  }
}