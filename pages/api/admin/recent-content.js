import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📚 Loading admin recent content...');
    
    const supabaseAdmin = getSupabaseAdmin();
    const limit = parseInt(req.query.limit) || 50;

    // Get recent content from all sources with full admin access
    const [notebooksResult, itemsResult] = await Promise.all([
      supabaseAdmin
        .from('notebooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(Math.floor(limit / 2)),
      
      supabaseAdmin
        .from('scraped_items')
        .select('*, scraping_operations(source, started_at)')
        .order('created_at', { ascending: false })
        .limit(Math.floor(limit / 2))
    ]);

    if (notebooksResult.error) {
      console.error('Error loading notebooks:', notebooksResult.error);
    }

    if (itemsResult.error) {
      console.error('Error loading scraped items:', itemsResult.error);
    }

    // Combine and format results
    const notebooks = (notebooksResult.data || []).map(item => ({
      ...item,
      source_type: 'notebook',
      source: 'NotebookLM'
    }));

    const scrapedItems = (itemsResult.data || []).map(item => ({
      ...item,
      source_type: 'scraped',
      source: item.scraping_operations?.source || 'unknown'
    }));

    // Combine and sort by creation date
    const allContent = [...notebooks, ...scrapedItems]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    console.log(`✅ Admin content loaded: ${allContent.length} items`);

    res.status(200).json({
      success: true,
      content: allContent,
      total: allContent.length
    });

  } catch (error) {
    console.error('❌ Error loading admin content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load admin content',
      details: error.message
    });
  }
}