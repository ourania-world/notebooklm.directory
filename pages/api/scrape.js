import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source, query, maxResults = 20 } = req.body

    if (!source || !query) {
      return res.status(400).json({ error: 'Missing required parameters: source and query' })
    }

    // Create scraping operation record
    const { data: operation, error: opError } = await supabase
      .from('scraping_operations')
      .insert({
        source,
        query,
        max_results: maxResults,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (opError) {
      console.error('Error creating operation:', opError)
      return res.status(500).json({ error: `Failed to create operation: ${opError.message}` })
    }

    // For now, simulate scraping with demo data
    // In a real implementation, you'd call the actual scraping logic
    const demoResults = [
      {
        title: `Demo ${query} Result 1`,
        description: `This is a demo result for ${query} from ${source}`,
        url: `https://example.com/demo1`,
        author: 'Demo Author',
        quality_score: 0.8
      },
      {
        title: `Demo ${query} Result 2`,
        description: `Another demo result for ${query} from ${source}`,
        url: `https://example.com/demo2`,
        author: 'Demo Author 2',
        quality_score: 0.7
      }
    ]

    // Save demo results to database
    const itemsToInsert = demoResults.map(item => ({
      operation_id: operation.id,
      source,
      title: item.title,
      description: item.description,
      url: item.url,
      author: item.author,
      quality_score: item.quality_score
    }))

    const { error: insertError } = await supabase
      .from('scraped_items')
      .insert(itemsToInsert)

    if (insertError) {
      console.error('Error inserting scraped items:', insertError)
    }

    // Update operation status
    await supabase
      .from('scraping_operations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        items_found: demoResults.length,
        results_summary: {
          total_items: demoResults.length,
          avg_quality_score: demoResults.reduce((sum, item) => sum + item.quality_score, 0) / demoResults.length,
          categories: ['Demo']
        }
      })
      .eq('id', operation.id)

    res.status(200).json({
      operationId: operation.id,
      status: 'completed',
      message: `Demo scraping completed for ${source} with "${query}"`,
      results: demoResults
    })

  } catch (error) {
    console.error('Error in /api/scrape:', error)
    res.status(500).json({ error: 'Failed to start scraping operation' })
  }
} 