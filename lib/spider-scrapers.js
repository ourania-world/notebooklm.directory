// Spider-Scrapers Client Library
// Interface for the NotebookLM discovery system

export class SpiderScrapersClient {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    this.apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }

  async startScraping(source, query, maxResults = 20) {
    try {
      const response = await fetch(`${this.baseUrl}/functions/v1/spider-scrapers/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          source: source.toUpperCase(),
          query,
          maxResults
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to start scraping')
      }

      return await response.json()
    } catch (error) {
      console.error('Error starting scraping:', error)
      throw error
    }
  }

  async getOperationStatus(operationId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/functions/v1/spider-scrapers/status?operationId=${operationId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get operation status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting operation status:', error)
      throw error
    }
  }

  async getOperationResults(operationId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/functions/v1/spider-scrapers/results?operationId=${operationId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get operation results')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting operation results:', error)
      throw error
    }
  }

  async waitForCompletion(operationId, pollInterval = 2000, maxWaitTime = 300000) {
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getOperationStatus(operationId)
      
      if (status.status === 'completed') {
        const results = await this.getOperationResults(operationId)
        return { status, results }
      } else if (status.status === 'failed') {
        throw new Error(`Scraping failed: ${status.error_message}`)
      }
      
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }
    
    throw new Error('Scraping operation timed out')
  }

  // Convenience methods for different sources
  async scrapeGitHub(query, maxResults = 20) {
    return this.startScraping('GITHUB', query, maxResults)
  }

  async scrapeReddit(query, maxResults = 20) {
    return this.startScraping('REDDIT', query, maxResults)
  }

  async scrapeTwitter(query, maxResults = 20) {
    return this.startScraping('TWITTER', query, maxResults)
  }

  async scrapeAcademic(query, maxResults = 20) {
    return this.startScraping('ACADEMIC', query, maxResults)
  }

  async scrapeYouTube(query, maxResults = 20) {
    return this.startScraping('YOUTUBE', query, maxResults)
  }

  // Batch scraping across multiple sources
  async scrapeAllSources(query, maxResults = 20) {
    const sources = ['GITHUB', 'REDDIT', 'TWITTER', 'ACADEMIC', 'YOUTUBE']
    const operations = []

    for (const source of sources) {
      try {
        const operation = await this.startScraping(source, query, maxResults)
        operations.push({ source, operation })
      } catch (error) {
        console.error(`Failed to start scraping ${source}:`, error)
        operations.push({ source, error: error.message })
      }
    }

    return operations
  }
}

// Export singleton instance
export const spiderScrapers = new SpiderScrapersClient()

// Utility functions
export async function runMassiveDiscovery(queries = []) {
  const defaultQueries = [
    'machine learning',
    'artificial intelligence',
    'data science',
    'research analysis',
    'academic research',
    'business intelligence',
    'creative writing',
    'education technology'
  ]

  const searchQueries = queries.length > 0 ? queries : defaultQueries
  const allOperations = []

  console.log('🚀 Starting massive NotebookLM discovery across all platforms...')

  for (const query of searchQueries) {
    console.log(`🔍 Searching for: "${query}"`)
    
    try {
      const operations = await spiderScrapers.scrapeAllSources(query, 20)
      allOperations.push({ query, operations })
      
      // Small delay between queries to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error scraping for "${query}":`, error)
    }
  }

  console.log(`✅ Started ${allOperations.length} discovery operations`)
  return allOperations
}

export async function getScrapingStats() {
  try {
    const { supabase } = await import('./supabase')
    const { data, error } = await supabase.rpc('get_scraping_stats')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting scraping stats:', error)
    return null
  }
}