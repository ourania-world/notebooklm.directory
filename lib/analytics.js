import { supabase } from './supabase'

// Track user events for analytics
export async function trackEvent(userId, eventType, eventData = {}) {
  try {
    const { error } = await supabase
      .from('user_events')
      .insert([{
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        created_at: new Date().toISOString()
      }])

    if (error) throw error
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

// Track notebook views
export async function trackNotebookView(userId, notebookId) {
  try {
    // Update view count
    const { error: updateError } = await supabase
      .from('notebooks')
      .update({ 
        view_count: supabase.raw('view_count + 1'),
        last_viewed_at: new Date().toISOString()
      })
      .eq('id', notebookId)

    if (updateError) throw updateError

    // Track user event
    if (userId) {
      await trackEvent(userId, 'notebook_view', { notebook_id: notebookId })
    }
  } catch (error) {
    console.error('Error tracking notebook view:', error)
  }
}

// Track search queries
export async function trackSearch(userId, query, category = null, resultsCount = 0) {
  try {
    await trackEvent(userId, 'search', {
      query,
      category,
      results_count: resultsCount
    })
  } catch (error) {
    console.error('Error tracking search:', error)
  }
}

// Get user engagement metrics
export async function getUserEngagementMetrics(userId) {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('event_type, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    if (error) throw error

    const metrics = {
      totalEvents: data.length,
      searches: data.filter(e => e.event_type === 'search').length,
      notebookViews: data.filter(e => e.event_type === 'notebook_view').length,
      submissions: data.filter(e => e.event_type === 'notebook_submit').length,
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
      .select('*')
      .order('view_count', { ascending: false })
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
      .from('user_events')
      .select('event_data')
      .eq('event_type', 'search')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days

    if (error) throw error

    // Count search queries
    const searchCounts = {}
    data.forEach(event => {
      const query = event.event_data?.query
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