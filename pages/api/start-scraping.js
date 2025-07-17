import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { source, config } = req.body

    if (!source) {
      return res.status(400).json({ error: 'Missing required parameter: source' })
    }

    console.log(`🚀 Starting scraping for source: ${source}`, config)

    // Create scraping operation record
    const { data: operation, error: opError } = await supabase
      .from('scraping_operations')
      .insert({
        source,
        query: config?.searchTerms || 'general',
        max_results: config?.maxResults || 20,
        status: 'running',
        started_at: new Date().toISOString(),
        config: config
      })
      .select()
      .single()

    if (opError) {
      console.error('Error creating operation:', opError)
      return res.status(500).json({ error: `Failed to create operation: ${opError.message}` })
    }

    // For now, simulate scraping with demo data based on source
    const getSourceData = (sourceId) => {
      const sourceMap = {
        'arxiv': {
          name: 'arXiv',
          results: [
            {
              title: 'Neural Networks for Quantum Computing',
              description: 'A comprehensive study on applying neural networks to quantum computing problems',
              url: 'https://arxiv.org/abs/2024.01234',
              author: 'Dr. Alice Smith',
              quality_score: 0.95
            },
            {
              title: 'Advanced Machine Learning Techniques',
              description: 'Latest developments in deep learning and transformer architectures',
              url: 'https://arxiv.org/abs/2024.01235',
              author: 'Prof. Bob Johnson',
              quality_score: 0.89
            }
          ]
        },
        'github': {
          name: 'GitHub',
          results: [
            {
              title: 'AI-Enhanced Code Generation',
              description: 'Open source project for automated code generation using GPT models',
              url: 'https://github.com/example/ai-codegen',
              author: 'DevTeam',
              quality_score: 0.87
            },
            {
              title: 'React Dashboard Components',
              description: 'Reusable dashboard components for React applications',
              url: 'https://github.com/example/react-dashboard',
              author: 'UI-Team',
              quality_score: 0.82
            }
          ]
        },
        'reddit': {
          name: 'Reddit',
          results: [
            {
              title: 'Best Practices for Machine Learning',
              description: 'Community discussion on ML best practices and common pitfalls',
              url: 'https://reddit.com/r/MachineLearning/post123',
              author: 'ml_enthusiast',
              quality_score: 0.75
            }
          ]
        }
      }

      return sourceMap[sourceId] || {
        name: sourceId,
        results: [
          {
            title: `Demo result from ${sourceId}`,
            description: `Sample content scraped from ${sourceId}`,
            url: `https://example.com/${sourceId}`,
            author: 'Demo User',
            quality_score: 0.70
          }
        ]
      }
    }

    const sourceData = getSourceData(source)
    const results = sourceData.results

    // Save demo results to database
    const itemsToInsert = results.map(item => ({
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
        items_found: results.length,
        results_summary: {
          total_items: results.length,
          avg_quality_score: results.reduce((sum, item) => sum + item.quality_score, 0) / results.length,
          categories: [sourceData.name]
        }
      })
      .eq('id', operation.id)

    console.log(`✅ Scraping completed for ${source}: ${results.length} items found`)

    res.status(200).json({
      success: true,
      operationId: operation.id,
      status: 'completed',
      message: `Scraping started for ${sourceData.name}`,
      itemsFound: results.length,
      results: results
    })

  } catch (error) {
    console.error('Error in /api/start-scraping:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to start scraping operation',
      details: error.message 
    })
  }
}