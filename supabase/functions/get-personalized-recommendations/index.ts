import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    if (!userId) {
      // Return popular notebooks for anonymous users
      const { data: popularNotebooks, error } = await supabase
        .from('notebooks')
        .select('*')
        .eq('premium', false)
        .order('view_count', { ascending: false })
        .limit(limit)

      if (error) throw error

      return new Response(
        JSON.stringify({ 
          recommendations: popularNotebooks || [],
          type: 'popular'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get user's interaction history
    const { data: userEvents, error: eventsError } = await supabase
      .from('user_events')
      .select('event_data')
      .eq('user_id', userId)
      .in('event_type', ['notebook_view', 'notebook_save', 'search'])
      .order('created_at', { ascending: false })
      .limit(100)

    if (eventsError) throw eventsError

    // Get user's saved notebooks to understand preferences
    const { data: savedNotebooks, error: savedError } = await supabase
      .from('saved_notebooks')
      .select(`
        notebooks (
          category,
          tags
        )
      `)
      .eq('user_id', userId)

    if (savedError) throw savedError

    // Analyze user preferences
    const categoryPreferences = {}
    const tagPreferences = {}

    // Count categories from saved notebooks
    savedNotebooks?.forEach(saved => {
      const category = saved.notebooks?.category
      if (category) {
        categoryPreferences[category] = (categoryPreferences[category] || 0) + 2
      }
      
      const tags = saved.notebooks?.tags || []
      tags.forEach(tag => {
        tagPreferences[tag] = (tagPreferences[tag] || 0) + 1
      })
    })

    // Count categories from viewed notebooks
    userEvents?.forEach(event => {
      if (event.event_data?.category) {
        const category = event.event_data.category
        categoryPreferences[category] = (categoryPreferences[category] || 0) + 1
      }
    })

    // Get top preferred categories and tags
    const topCategories = Object.entries(categoryPreferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    const topTags = Object.entries(tagPreferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)

    // Build recommendation query
    let recommendationQuery = supabase
      .from('notebooks')
      .select('*')
      .neq('user_id', userId) // Don't recommend user's own notebooks

    // Check user's subscription for premium content access
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        subscription_plans (
          limits
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    const hasPremiumAccess = subscription?.subscription_plans?.limits?.premiumContent === true

    if (!hasPremiumAccess) {
      recommendationQuery = recommendationQuery.eq('premium', false)
    }

    // Get notebooks from preferred categories
    let recommendations = []

    if (topCategories.length > 0) {
      const { data: categoryRecs, error: categoryError } = await recommendationQuery
        .in('category', topCategories)
        .order('view_count', { ascending: false })
        .limit(Math.ceil(limit * 0.6))

      if (!categoryError && categoryRecs) {
        recommendations.push(...categoryRecs)
      }
    }

    // Get notebooks with preferred tags
    if (topTags.length > 0 && recommendations.length < limit) {
      const { data: tagRecs, error: tagError } = await recommendationQuery
        .overlaps('tags', topTags)
        .order('save_count', { ascending: false })
        .limit(limit - recommendations.length)

      if (!tagError && tagRecs) {
        // Filter out already recommended notebooks
        const existingIds = new Set(recommendations.map(r => r.id))
        const newTagRecs = tagRecs.filter(r => !existingIds.has(r.id))
        recommendations.push(...newTagRecs)
      }
    }

    // Fill remaining slots with trending notebooks
    if (recommendations.length < limit) {
      const { data: trendingRecs, error: trendingError } = await recommendationQuery
        .order('created_at', { ascending: false })
        .limit(limit - recommendations.length)

      if (!trendingError && trendingRecs) {
        const existingIds = new Set(recommendations.map(r => r.id))
        const newTrendingRecs = trendingRecs.filter(r => !existingIds.has(r.id))
        recommendations.push(...newTrendingRecs)
      }
    }

    // Store recommendations for future analysis
    const recommendationInserts = recommendations.slice(0, limit).map(notebook => ({
      user_id: userId,
      notebook_id: notebook.id,
      score: Math.random() * 0.5 + 0.5, // Random score between 0.5-1.0
      reason: topCategories.includes(notebook.category) ? 'category_preference' : 
              notebook.tags?.some(tag => topTags.includes(tag)) ? 'tag_preference' : 'trending'
    }))

    if (recommendationInserts.length > 0) {
      await supabase
        .from('user_recommendations')
        .upsert(recommendationInserts, { 
          onConflict: 'user_id,notebook_id',
          ignoreDuplicates: false 
        })
    }

    return new Response(
      JSON.stringify({ 
        recommendations: recommendations.slice(0, limit),
        type: 'personalized',
        preferences: {
          categories: topCategories,
          tags: topTags
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Recommendation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})