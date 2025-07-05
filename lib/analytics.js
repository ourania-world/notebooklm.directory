import { supabase } from './supabase'

// Enhanced analytics tracking with Edge Function
export async function trackEvent(userId, eventType, eventData = {}, notebookId = null) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
    const response = await fetch(`${supabaseUrl}/functions/v1/track-user-activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        eventType,
        eventData,
        notebookId
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to track event: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error tracking event:', error)
    // Don't throw the error to prevent breaking the UI
    return { error: error.message }
  }
}

// Track notebook views
export async function trackNotebookView(userId, notebookId) {
  await trackEvent(userId, 'notebook_view', { notebook_id: notebookId }, notebookId)
}

// Track search queries
export async function trackSearch(userId, query, category = null, resultsCount = 0) {
  await trackEvent(userId, 'search', {
    query,
    category,
    results_count: resultsCount
  })
}

// Track audio playback
export async function trackAudioPlay(userId, notebookId, duration = null, completed = false) {
  await trackEvent(userId, 'audio_play', {
    duration,
    completed
  }, notebookId)
}

// Get user engagement metrics
export async function getUserEngagementMetrics(userId) {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('event_type, created_at, event_data')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    if (error) throw error

    const metrics = {
      totalEvents: data.length,
      searches: data.filter(e => e.event_type === 'search').length,
      notebookViews: data.filter(e => e.event_type === 'notebook_view').length,
      submissions: data.filter(e => e.event_type === 'notebook_submit').length,
      audioPlays: data.filter(e => e.event_type === 'audio_play').length,
      lastActive: data.length > 0 ? data[0].created_at : null
    }

    return metrics
  } catch (error) {
    console.error('Error fetching user engagement metrics:', error)
    return null
  }
}

// Get popular notebooks
export async function getPopularNotebooks(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('notebooks')
      .select(`
        *,
        profiles!notebooks_user_id_fkey (
          full_name,
          institution
        )
      `)
      .order('view_count', { ascending: false })
      .order('save_count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching popular notebooks:', error)
    return []
  }
}

// Get trending searches
export async function getTrendingSearches(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('query')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days

    if (error) throw error

    // Count search queries
    const searchCounts = {}
    data.forEach(search => {
      const query = search.query
      if (query && query.length > 2) {
        searchCounts[query] = (searchCounts[query] || 0) + 1
      }
    })

    // Sort by count and return top results
    return Object.entries(searchCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }))
  } catch (error) {
    console.error('Error fetching trending searches:', error)
    return []
  }
}

// Get notebook performance analytics
export async function getNotebookAnalytics(notebookId, days = 30) {
  try {
    const { data, error } = await supabase
      .from('notebook_analytics')
      .select('*')
      .eq('notebook_id', notebookId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching notebook analytics:', error)
    return []
  }
}

// Get user activity summary
export async function getUserActivitySummary(userId) {
  try {
    const [
      { data: events },
      { data: notebooks },
      { data: saved }
    ] = await Promise.all([
      supabase
        .from('user_events')
        .select('event_type')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase
        .from('notebooks')
        .select('id, view_count, save_count')
        .eq('user_id', userId),
      supabase
        .from('saved_notebooks')
        .select('id')
        .eq('user_id', userId)
    ])

    const totalViews = notebooks?.reduce((sum, n) => sum + (n.view_count || 0), 0) || 0
    const totalSaves = notebooks?.reduce((sum, n) => sum + (n.save_count || 0), 0) || 0

    return {
      totalEvents: events?.length || 0,
      notebooksSubmitted: notebooks?.length || 0,
      notebooksSaved: saved?.length || 0,
      totalViews,
      totalSaves,
      engagementScore: Math.round(((events?.length || 0) + totalViews + totalSaves) / 10)
    }
  } catch (error) {
    console.error('Error fetching user activity summary:', error)
    return {
      totalEvents: 0,
      notebooksSubmitted: 0,
      notebooksSaved: 0,
      totalViews: 0,
      totalSaves: 0,
      engagementScore: 0
    }
  }
}