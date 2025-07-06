const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

Deno.serve(async (req) => {
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

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables:', { 
        hasUrl: !!supabaseUrl, 
        hasServiceKey: !!supabaseServiceKey 
      })
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Fetch audio file from Supabase Storage using the public URL
    // Since the bucket is public, we don't need authentication
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/audio/${audioPath}`
    
    console.log('Fetching audio from:', publicUrl)
    
    const storageResponse = await fetch(publicUrl)

    if (!storageResponse.ok) {
      console.error('Storage response not ok:', storageResponse.status, storageResponse.statusText)
      return new Response(
        JSON.stringify({ 
          error: 'Audio file not found',
          details: `Status: ${storageResponse.status}`,
          path: audioPath
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const audioBuffer = await storageResponse.arrayBuffer()
    const contentType = storageResponse.headers.get('content-type') || 'audio/mpeg'

    console.log('Successfully serving audio:', {
      path: audioPath,
      contentType,
      size: audioBuffer.byteLength
    })

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
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})