import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    if (action === 'run' && req.method === 'POST') {
      return await handleScrapeRequest(req, supabase)
    } else if (action === 'status' && req.method === 'GET') {
      return await handleStatusRequest(url, supabase)
    } else if (action === 'results' && req.method === 'GET') {
      return await handleResultsRequest(url, supabase)
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Spider-scrapers error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleScrapeRequest(req: Request, supabase: any) {
  const { source, query, maxResults = 20 } = await req.json()

  if (!source || !query) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters: source and query' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
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
    throw new Error(`Failed to create operation: ${opError.message}`)
  }

  // Start scraping in background
  scrapeInBackground(operation.id, source, query, maxResults, supabase)

  return new Response(
    JSON.stringify({
      operationId: operation.id,
      status: 'started',
      message: `Scraping ${source} for "${query}" with max ${maxResults} results`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleStatusRequest(url: URL, supabase: any) {
  const operationId = url.searchParams.get('operationId')
  
  if (!operationId) {
    return new Response(
      JSON.stringify({ error: 'Missing operationId parameter' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: operation, error } = await supabase
    .from('scraping_operations')
    .select('*')
    .eq('id', operationId)
    .single()

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Operation not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify(operation),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleResultsRequest(url: URL, supabase: any) {
  const operationId = url.searchParams.get('operationId')
  
  if (!operationId) {
    return new Response(
      JSON.stringify({ error: 'Missing operationId parameter' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: items, error } = await supabase
    .from('scraped_items')
    .select('*')
    .eq('operation_id', operationId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch results: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ items: items || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function scrapeInBackground(operationId: string, source: string, query: string, maxResults: number, supabase: any) {
  try {
    console.log(`Starting scrape operation ${operationId} for ${source}`)
    
    let scraped_items: any[] = []
    
    switch (source.toUpperCase()) {
      case 'GITHUB':
        scraped_items = await scrapeGitHub(query, maxResults)
        break
      case 'REDDIT':
        scraped_items = await scrapeReddit(query, maxResults)
        break
      case 'TWITTER':
        scraped_items = await scrapeTwitter(query, maxResults)
        break
      case 'ACADEMIC':
        scraped_items = await scrapeAcademic(query, maxResults)
        break
      case 'YOUTUBE':
        scraped_items = await scrapeYouTube(query, maxResults)
        break
      default:
        throw new Error(`Unsupported source: ${source}`)
    }

    // Save scraped items to database
    if (scraped_items.length > 0) {
      const itemsToInsert = scraped_items.map(item => ({
        operation_id: operationId,
        source,
        title: item.title,
        description: item.description,
        url: item.url,
        author: item.author,
        metadata: item.metadata || {},
        quality_score: item.quality_score || 0.5
      }))

      const { error: insertError } = await supabase
        .from('scraped_items')
        .insert(itemsToInsert)

      if (insertError) {
        console.error('Error inserting scraped items:', insertError)
      }
    }

    // Update operation status
    await supabase
      .from('scraping_operations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        items_found: scraped_items.length,
        results_summary: {
          total_items: scraped_items.length,
          avg_quality_score: scraped_items.reduce((sum, item) => sum + (item.quality_score || 0.5), 0) / scraped_items.length,
          categories: [...new Set(scraped_items.map(item => item.category).filter(Boolean))]
        }
      })
      .eq('id', operationId)

    console.log(`Completed scrape operation ${operationId}: found ${scraped_items.length} items`)

  } catch (error) {
    console.error(`Error in scrape operation ${operationId}:`, error)
    
    // Update operation with error status
    await supabase
      .from('scraping_operations')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: error.message
      })
      .eq('id', operationId)
  }
}

async function scrapeGitHub(query: string, maxResults: number) {
  console.log(`Scraping GitHub for: ${query}`)
  
  // Simulate GitHub API scraping
  const mockResults = [
    {
      title: `NotebookLM ${query} Analysis`,
      description: `Comprehensive analysis using NotebookLM for ${query} research and insights.`,
      url: 'https://github.com/example/notebooklm-analysis',
      author: 'researcher123',
      category: 'Research',
      quality_score: 0.8,
      metadata: {
        stars: 45,
        forks: 12,
        language: 'Python',
        last_updated: new Date().toISOString()
      }
    },
    {
      title: `${query} Research with AI Assistant`,
      description: `Using Google's NotebookLM to analyze ${query} datasets and generate insights.`,
      url: 'https://github.com/example/ai-research',
      author: 'dataScientist',
      category: 'Academic',
      quality_score: 0.7,
      metadata: {
        stars: 23,
        forks: 8,
        language: 'Jupyter Notebook',
        last_updated: new Date().toISOString()
      }
    }
  ]

  // Return limited results based on maxResults
  return mockResults.slice(0, maxResults)
}

async function scrapeReddit(query: string, maxResults: number) {
  console.log(`Scraping Reddit for: ${query}`)
  
  const mockResults = [
    {
      title: `Amazing NotebookLM results for ${query}`,
      description: `Just tried NotebookLM for my ${query} research and the results are incredible! Here's what I found...`,
      url: 'https://notebooklm.google.com/notebook/shared-example',
      author: 'u/researcher2024',
      category: 'Personal',
      quality_score: 0.6,
      metadata: {
        upvotes: 156,
        comments: 23,
        subreddit: 'MachineLearning',
        posted: new Date().toISOString()
      }
    }
  ]

  return mockResults.slice(0, maxResults)
}

async function scrapeTwitter(query: string, maxResults: number) {
  console.log(`Scraping Twitter for: ${query}`)
  
  const mockResults = [
    {
      title: `NotebookLM breakthrough in ${query}`,
      description: `Just published my NotebookLM analysis on ${query} - the insights are game-changing! 🧠✨`,
      url: 'https://notebooklm.google.com/notebook/twitter-shared',
      author: '@AIResearcher',
      category: 'Research',
      quality_score: 0.5,
      metadata: {
        retweets: 45,
        likes: 234,
        replies: 12,
        posted: new Date().toISOString()
      }
    }
  ]

  return mockResults.slice(0, maxResults)
}

async function scrapeAcademic(query: string, maxResults: number) {
  console.log(`Scraping Academic sources for: ${query}`)
  
  const mockResults = [
    {
      title: `AI-Assisted Analysis of ${query}: A NotebookLM Study`,
      description: `This paper presents a comprehensive analysis of ${query} using Google's NotebookLM platform, demonstrating significant improvements in research efficiency.`,
      url: 'https://notebooklm.google.com/notebook/academic-study',
      author: 'Dr. Sarah Chen, Prof. Michael Rodriguez',
      category: 'Academic',
      quality_score: 0.9,
      metadata: {
        journal: 'Journal of AI Research',
        citations: 12,
        published: '2024-12-15',
        doi: '10.1000/example.doi'
      }
    }
  ]

  return mockResults.slice(0, maxResults)
}

async function scrapeYouTube(query: string, maxResults: number) {
  console.log(`Scraping YouTube for: ${query}`)
  
  const mockResults = [
    {
      title: `How I Used NotebookLM for ${query} Research`,
      description: `In this video, I walk through my complete workflow using NotebookLM to analyze ${query} and share the incredible insights I discovered.`,
      url: 'https://notebooklm.google.com/notebook/youtube-demo',
      author: 'TechResearcher',
      category: 'Education',
      quality_score: 0.7,
      metadata: {
        views: 15420,
        likes: 892,
        duration: '12:34',
        uploaded: new Date().toISOString()
      }
    }
  ]

  return mockResults.slice(0, maxResults)
}