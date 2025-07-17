// Simple test endpoint to verify scraping API
export default async function handler(req, res) {
  console.log('🧪 TEST SCRAPING API CALLED', { method: req.method, body: req.body })
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Test scraping API is working!',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    })
  }
  
  if (req.method === 'POST') {
    const { source } = req.body || {}
    
    return res.status(200).json({
      success: true,
      message: `Test scraping for ${source || 'unknown'} successful!`,
      operationId: `test-${Date.now()}`,
      results: [
        {
          title: 'Test Result 1',
          description: 'This is a test scraping result to verify the API is working',
          url: 'https://example.com/test1',
          author: 'Test User',
          quality_score: 0.95
        }
      ]
    })
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}