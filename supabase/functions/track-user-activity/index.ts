import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    const { 
      userId, 
      eventType, 
      eventData = {},
      notebookId 
    } = await req.json()

    // Track the user event
    const { error: eventError } = await supabase
      .from('user_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        ip_address: req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })

    if (eventError) {
      console.error('Error tracking event:', eventError)
    }

    // Handle specific event types
    switch (eventType) {
      case 'notebook_view':
        if (notebookId) {
          // Increment view count
          const { error: viewError } = await supabase
            .rpc('increment_notebook_view_count', { notebook_uuid: notebookId })
          
          if (viewError) {
            console.error('Error incrementing view count:', viewError)
          }
        }
        break

      case 'search':
        // Track search analytics
        const { error: searchError } = await supabase
          .from('search_analytics')
          .insert({
            query: eventData.query,
            user_id: userId,
            category: eventData.category,
            results_count: eventData.results_count || 0
          })
        
        if (searchError) {
          console.error('Error tracking search:', searchError)
        }
        break

      case 'audio_play':
        // Track audio engagement
        if (notebookId) {
          const { error: audioError } = await supabase
            .from('user_events')
            .insert({
              user_id: userId,
              event_type: 'audio_engagement',
              event_data: {
                notebook_id: notebookId,
                duration: eventData.duration,
                completed: eventData.completed
              }
            })
          
          if (audioError) {
            console.error('Error tracking audio:', audioError)
          }
        }
        break
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Activity tracking error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})