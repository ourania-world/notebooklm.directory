import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const audioPath = url.searchParams.get('path')
    
    if (!audioPath) {
      return new Response(
        JSON.stringify({ error: 'Audio path parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Fetch audio file from Supabase Storage
    const storageResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/public/audio/${audioPath}`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
        }
      }
    )

    if (!storageResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Audio file not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const audioBuffer = await storageResponse.arrayBuffer()
    const contentType = storageResponse.headers.get('content-type') || 'audio/mpeg'

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Length': audioBuffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      }
    })

  } catch (error) {
    console.error('Error serving audio:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})