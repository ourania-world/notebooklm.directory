import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Try to call the Supabase function first
    const { data: functionData, error: functionError } = await supabase.rpc('get_scraping_stats')
    
    if (!functionError && functionData) {
      return res.status(200).json(functionData)
    }

    // Fallback: Query the tables directly
    console.log('Supabase function not found, using direct queries')
    
    const { data: operations, error: operationsError } = await supabase
      .from('scraping_operations')
      .select('*')
    
    if (operationsError) {
      console.error('Error fetching operations:', operationsError)
      // Return demo stats
      return res.status(200).json({
        total_operations: 0,
        completed_operations: 0,
        failed_operations: 0,
        running_operations: 0,
        total_items_found: 0,
        avg_quality_score: 0.0,
        sources: [],
        last_operation: null
      })
    }

    const stats = {
      total_operations: operations?.length || 0,
      completed_operations: operations?.filter(op => op.status === 'completed').length || 0,
      failed_operations: operations?.filter(op => op.status === 'failed').length || 0,
      running_operations: operations?.filter(op => op.status === 'running').length || 0,
      total_items_found: operations?.reduce((sum, op) => sum + (op.items_found || 0), 0) || 0,
      avg_quality_score: 0.0, // Would need to calculate from scraped_items
      sources: [...new Set(operations?.map(op => op.source).filter(Boolean) || [])],
      last_operation: operations?.length > 0 ? Math.max(...operations.map(op => new Date(op.created_at).getTime())) : null
    }

    res.status(200).json(stats)
  } catch (error) {
    console.error('Error in /api/scraping-stats:', error)
    // Return demo stats on error
    res.status(200).json({
      total_operations: 0,
      completed_operations: 0,
      failed_operations: 0,
      running_operations: 0,
      total_items_found: 0,
      avg_quality_score: 0.0,
      sources: [],
      last_operation: null
    })
  }
} 