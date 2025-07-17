import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📊 Loading admin scraping statistics...');
    
    const supabaseAdmin = getSupabaseAdmin();

    // Get total scraped content from all tables
    const [notebooksResult, operationsResult, itemsResult] = await Promise.all([
      supabaseAdmin.from('notebooks').select('*', { count: 'exact' }),
      supabaseAdmin.from('scraping_operations').select('*', { count: 'exact' }),
      supabaseAdmin.from('scraped_items').select('*', { count: 'exact' })
    ]);

    const totalNotebooks = notebooksResult.count || 0;
    const totalOperations = operationsResult.count || 0;
    const totalScrapedItems = itemsResult.count || 0;

    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    
    const todayNotebooks = await supabaseAdmin
      .from('notebooks')
      .select('*', { count: 'exact' })
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    const todayOperations = await supabaseAdmin
      .from('scraping_operations')
      .select('*', { count: 'exact' })
      .gte('started_at', `${today}T00:00:00.000Z`)
      .lt('started_at', `${today}T23:59:59.999Z`);

    // Calculate success rate from recent operations
    const recentOperations = await supabaseAdmin
      .from('scraping_operations')
      .select('status')
      .order('started_at', { ascending: false })
      .limit(100);

    const completedOps = recentOperations.data?.filter(op => op.status === 'completed').length || 0;
    const totalRecentOps = recentOperations.data?.length || 1;
    const successRate = Math.round((completedOps / totalRecentOps) * 100);

    // Count active sources (sources that have run in the last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const activeSources = await supabaseAdmin
      .from('scraping_operations')
      .select('source', { count: 'exact' })
      .gte('started_at', oneHourAgo)
      .neq('status', 'failed');

    const stats = {
      totalScraped: totalNotebooks + totalScrapedItems,
      todayScraped: (todayNotebooks.count || 0) + (todayOperations.count || 0),
      activeSources: activeSources.count || 0,
      successRate: successRate,
      // Additional admin stats
      totalOperations: totalOperations,
      totalNotebooks: totalNotebooks,
      totalScrapedItems: totalScrapedItems
    };

    console.log('✅ Admin stats loaded:', stats);

    res.status(200).json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('❌ Error loading admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load admin statistics',
      details: error.message
    });
  }
}