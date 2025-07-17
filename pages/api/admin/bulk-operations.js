import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('⚡ Admin bulk operations API called');
    
    const { operation, data } = req.body;
    const supabaseAdmin = getSupabaseAdmin();

    switch (operation) {
      case 'delete_old_operations':
        // Delete operations older than specified days
        const daysOld = data.days || 30;
        const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();
        
        const { data: deletedOps, error: deleteOpsError } = await supabaseAdmin
          .from('scraping_operations')
          .delete()
          .lt('started_at', cutoffDate);

        if (deleteOpsError) throw deleteOpsError;
        
        res.status(200).json({
          success: true,
          message: `Deleted operations older than ${daysOld} days`,
          affected: deletedOps?.length || 0
        });
        break;

      case 'cleanup_failed_operations':
        // Clean up failed operations and their items
        const { data: failedOps, error: failedOpsError } = await supabaseAdmin
          .from('scraping_operations')
          .delete()
          .eq('status', 'failed');

        if (failedOpsError) throw failedOpsError;

        res.status(200).json({
          success: true,
          message: 'Cleaned up failed operations',
          affected: failedOps?.length || 0
        });
        break;

      case 'update_quality_scores':
        // Recalculate quality scores for all items
        const { data: items, error: itemsError } = await supabaseAdmin
          .from('scraped_items')
          .select('id, title, description, url');

        if (itemsError) throw itemsError;

        // Simple quality scoring algorithm
        const updates = items.map(item => {
          let score = 0.5; // Base score
          
          // Title quality
          if (item.title && item.title.length > 10) score += 0.1;
          if (item.title && item.title.length > 30) score += 0.1;
          
          // Description quality
          if (item.description && item.description.length > 50) score += 0.1;
          if (item.description && item.description.length > 200) score += 0.1;
          
          // URL quality
          if (item.url && item.url.includes('https://')) score += 0.05;
          if (item.url && (item.url.includes('github.com') || item.url.includes('arxiv.org'))) score += 0.15;

          return {
            id: item.id,
            quality_score: Math.min(1.0, score)
          };
        });

        // Update scores in batches
        for (let i = 0; i < updates.length; i += 100) {
          const batch = updates.slice(i, i + 100);
          await supabaseAdmin
            .from('scraped_items')
            .upsert(batch);
        }

        res.status(200).json({
          success: true,
          message: 'Updated quality scores for all items',
          affected: updates.length
        });
        break;

      case 'export_data':
        // Export data for backup/analysis
        const { data: exportData, error: exportError } = await supabaseAdmin
          .from(data.table || 'scraping_operations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(data.limit || 1000);

        if (exportError) throw exportError;

        res.status(200).json({
          success: true,
          data: exportData,
          count: exportData.length,
          exported_at: new Date().toISOString()
        });
        break;

      default:
        res.status(400).json({
          success: false,
          error: `Unknown operation: ${operation}`
        });
    }

  } catch (error) {
    console.error('❌ Admin bulk operation error:', error);
    res.status(500).json({
      success: false,
      error: 'Bulk operation failed',
      details: error.message
    });
  }
}