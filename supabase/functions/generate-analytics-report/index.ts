import { createClient } from 'jsr:@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Initialize Supabase client with the user's JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    // Get the user's session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user has premium access
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select(`
        subscription_plans (
          id,
          limits
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()
    
    const isPremium = subscription?.subscription_plans?.limits?.premiumContent === true
    
    // Parse query parameters
    const url = new URL(req.url)
    const reportType = url.searchParams.get('type') || 'overview'
    const timeframe = url.searchParams.get('timeframe') || '30d'
    
    // Convert timeframe to days
    let days
    switch (timeframe) {
      case '7d':
        days = 7
        break
      case '30d':
        days = 30
        break
      case '90d':
        days = 90
        break
      case '365d':
        days = 365
        break
      default:
        days = 30
    }
    
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    
    // Generate report based on type
    let reportData = {}
    
    if (reportType === 'overview') {
      // Get overall platform metrics
      const { count: totalNotebooks } = await supabaseClient
        .from('notebooks')
        .select('id', { count: 'exact', head: true })
      
      const { data: notebookStats } = await supabaseClient
        .from('notebooks')
        .select('view_count, save_count, share_count')
      
      const totalViews = notebookStats?.reduce((sum, n) => sum + (n.view_count || 0), 0) || 0
      const totalSaves = notebookStats?.reduce((sum, n) => sum + (n.save_count || 0), 0) || 0
      const totalShares = notebookStats?.reduce((sum, n) => sum + (n.share_count || 0), 0) || 0
      
      // Get trending notebooks
      const { data: trendingNotebooks } = await supabaseClient
        .from('notebooks')
        .select('id, title, author, view_count, save_count, created_at')
        .gte('created_at', startDate)
        .order('view_count', { ascending: false })
        .limit(10)
      
      // Get category statistics
      const { data: categoryStats } = await supabaseClient
        .from('notebooks')
        .select('category')
      
      const categoryBreakdown = categoryStats?.reduce((acc, notebook) => {
        acc[notebook.category] = (acc[notebook.category] || 0) + 1
        return acc
      }, {}) || {}
      
      reportData = {
        overview: {
          totalNotebooks: totalNotebooks || 0,
          totalViews,
          totalSaves,
          totalShares,
          saveRate: totalViews > 0 ? ((totalSaves / totalViews) * 100).toFixed(2) : 0,
          shareRate: totalViews > 0 ? ((totalShares / totalViews) * 100).toFixed(2) : 0
        },
        trending: trendingNotebooks || [],
        categories: Object.entries(categoryBreakdown).map(([name, count]) => ({ name, count }))
      }
    } else if (reportType === 'user' && isPremium) {
      // Get user's content metrics (only for premium users)
      const { data: userNotebooks } = await supabaseClient
        .from('notebooks')
        .select('id, title, view_count, save_count, share_count, created_at')
        .eq('user_id', user.id)
        .order('view_count', { ascending: false })
      
      // Get user's activity trends
      const { data: userEvents } = await supabaseClient
        .from('user_events')
        .select('event_type, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .order('created_at', { ascending: true })
      
      // Process activity by day
      const activityByDay = {}
      userEvents?.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0]
        activityByDay[date] = (activityByDay[date] || 0) + 1
      })
      
      const activityTrends = Object.entries(activityByDay).map(([date, count]) => ({ date, count }))
      
      reportData = {
        notebooks: userNotebooks || [],
        activityTrends,
        totalViews: userNotebooks?.reduce((sum, n) => sum + (n.view_count || 0), 0) || 0,
        totalSaves: userNotebooks?.reduce((sum, n) => sum + (n.save_count || 0), 0) || 0,
        totalShares: userNotebooks?.reduce((sum, n) => sum + (n.share_count || 0), 0) || 0,
        totalActivity: userEvents?.length || 0
      }
    } else if (reportType === 'search') {
      // Get search analytics
      const { data: searchData } = await supabaseClient
        .from('search_analytics')
        .select('query, created_at')
        .gte('created_at', startDate)
        .not('query', 'is', null)
      
      // Count search queries
      const searchCounts = {}
      searchData?.forEach(search => {
        const query = search.query.toLowerCase()
        if (query && query.length > 2) {
          searchCounts[query] = (searchCounts[query] || 0) + 1
        }
      })
      
      const topSearches = Object.entries(searchCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([query, count]) => ({ query, count }))
      
      // Get search trends by day
      const searchByDay = {}
      searchData?.forEach(search => {
        const date = new Date(search.created_at).toISOString().split('T')[0]
        searchByDay[date] = (searchByDay[date] || 0) + 1
      })
      
      const searchTrends = Object.entries(searchByDay).map(([date, count]) => ({ date, count }))
      
      reportData = {
        topSearches,
        searchTrends,
        totalSearches: searchData?.length || 0,
        uniqueQueries: Object.keys(searchCounts).length
      }
    } else if (reportType === 'engagement') {
      // Get engagement metrics
      const { data: engagementData } = await supabaseClient
        .from('user_events')
        .select('event_type, user_id, created_at')
        .gte('created_at', startDate)
      
      // Calculate engagement metrics
      const eventTypes = {}
      const uniqueUsers = new Set()
      const dailyActivity = {}
      
      engagementData?.forEach(event => {
        eventTypes[event.event_type] = (eventTypes[event.event_type] || 0) + 1
        if (event.user_id) uniqueUsers.add(event.user_id)
        
        const date = new Date(event.created_at).toISOString().split('T')[0]
        dailyActivity[date] = (dailyActivity[date] || 0) + 1
      })
      
      const engagementTrends = Object.entries(dailyActivity).map(([date, count]) => ({ date, count }))
      
      reportData = {
        eventBreakdown: Object.entries(eventTypes).map(([type, count]) => ({ type, count })),
        engagementTrends,
        totalEvents: engagementData?.length || 0,
        activeUsers: uniqueUsers.size,
        avgEventsPerUser: uniqueUsers.size > 0 ? (engagementData?.length || 0) / uniqueUsers.size : 0
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid report type or insufficient permissions' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify(reportData),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=300' // Cache for 5 minutes
        } 
      }
    )
  } catch (error) {
    console.error('Error generating analytics report:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate analytics report' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})