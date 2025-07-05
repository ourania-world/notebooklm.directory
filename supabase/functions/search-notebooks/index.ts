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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const query = url.searchParams.get('q') || ''
    const category = url.searchParams.get('category')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    let dbQuery = supabase
      .from('notebooks')
      .select(`
        *,
        profiles!notebooks_user_id_fkey (
          full_name,
          institution
        )
      `)
      .order('view_count', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply search filter
    if (query) {
      dbQuery = dbQuery.or(`
        title.ilike.%${query}%,
        description.ilike.%${query}%,
        author.ilike.%${query}%,
        tags.cs.{${query}}
      `)
    }

    // Apply category filter
    if (category && category !== 'All') {
      dbQuery = dbQuery.eq('category', category)
    }

    const { data: notebooks, error } = await dbQuery

    if (error) {
      throw error
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('notebooks')
      .select('id', { count: 'exact', head: true })

    if (query) {
      countQuery = countQuery.or(`
        title.ilike.%${query}%,
        description.ilike.%${query}%,
        author.ilike.%${query}%,
        tags.cs.{${query}}
      `)
    }

    if (category && category !== 'All') {
      countQuery = countQuery.eq('category', category)
    }

    const { count } = await countQuery

    // Get search suggestions if query is provided
    let suggestions = []
    if (query && query.length > 2) {
      const { data: suggestionData } = await supabase
        .from('notebooks')
        .select('title, tags')
        .or(`title.ilike.%${query}%, tags.cs.{${query}}`)
        .limit(5)

      if (suggestionData) {
        const titleSuggestions = suggestionData
          .map(n => n.title)
          .filter(title => title.toLowerCase().includes(query.toLowerCase()))
        
        const tagSuggestions = suggestionData
          .flatMap(n => n.tags || [])
          .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
          .filter((tag, index, arr) => arr.indexOf(tag) === index) // unique

        suggestions = [...new Set([...titleSuggestions, ...tagSuggestions])].slice(0, 5)
      }
    }

    return new Response(
      JSON.stringify({
        notebooks: notebooks || [],
        total: count || 0,
        suggestions,
        pagination: {
          limit,
          offset,
          hasMore: (count || 0) > offset + limit
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Search error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})