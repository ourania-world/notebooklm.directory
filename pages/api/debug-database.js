// Debug endpoint to check database connectivity and table structure
import { supabaseAdmin } from '../../lib/supabase-admin'

export default async function handler(req, res) {
  console.log('🔍 DATABASE DEBUG ENDPOINT CALLED')
  
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      tests: {}
    }

    // Test 1: Check Supabase connection
    console.log('📡 Testing Supabase connection...')
    try {
      const { data: connectionTest, error: connectionError } = await supabaseAdmin
        .from('notebooks')
        .select('count', { count: 'exact', head: true })
      
      if (connectionError) {
        debugInfo.tests.connection = {
          status: 'failed',
          error: connectionError.message,
          details: connectionError
        }
      } else {
        debugInfo.tests.connection = {
          status: 'success',
          notebookCount: connectionTest || 0
        }
      }
    } catch (error) {
      debugInfo.tests.connection = {
        status: 'error',
        error: error.message
      }
    }

    // Test 2: Try to read existing notebooks
    console.log('📚 Testing notebooks table read...')
    try {
      const { data: existingNotebooks, error: readError } = await supabaseAdmin
        .from('notebooks')
        .select('*')
        .limit(5)
      
      if (readError) {
        debugInfo.tests.readNotebooks = {
          status: 'failed',
          error: readError.message,
          details: readError
        }
      } else {
        debugInfo.tests.readNotebooks = {
          status: 'success',
          count: existingNotebooks?.length || 0,
          sampleData: existingNotebooks?.slice(0, 2) || []
        }
      }
    } catch (error) {
      debugInfo.tests.readNotebooks = {
        status: 'error',
        error: error.message
      }
    }

    // Test 3: Try to insert a test record
    console.log('✏️ Testing notebooks table write...')
    try {
      const testNotebook = {
        title: 'Database Test Notebook',
        description: 'Test notebook to verify database connectivity',
        url: 'https://test.example.com',
        author: 'Debug System',
        category: 'Test',
        tags: ['debug', 'test'],
        featured: false,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        popularity_score: 50,
        source_platform: 'debug'
      }

      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from('notebooks')
        .insert([testNotebook])
        .select()
      
      if (insertError) {
        debugInfo.tests.writeNotebooks = {
          status: 'failed',
          error: insertError.message,
          details: insertError
        }
      } else {
        debugInfo.tests.writeNotebooks = {
          status: 'success',
          insertedRecord: insertedData?.[0] || null
        }
        
        // Clean up test record
        if (insertedData?.[0]?.id) {
          await supabaseAdmin
            .from('notebooks')
            .delete()
            .eq('id', insertedData[0].id)
        }
      }
    } catch (error) {
      debugInfo.tests.writeNotebooks = {
        status: 'error',
        error: error.message
      }
    }

    // Test 4: Check scraped_items table
    console.log('🔍 Testing scraped_items table...')
    try {
      const { data: scrapedItems, error: scrapedError } = await supabaseAdmin
        .from('scraped_items')
        .select('*')
        .limit(5)
      
      if (scrapedError) {
        debugInfo.tests.scrapedItems = {
          status: 'failed',
          error: scrapedError.message
        }
      } else {
        debugInfo.tests.scrapedItems = {
          status: 'success',
          count: scrapedItems?.length || 0,
          sampleData: scrapedItems?.slice(0, 2) || []
        }
      }
    } catch (error) {
      debugInfo.tests.scrapedItems = {
        status: 'error',
        error: error.message
      }
    }

    console.log('✅ Database debug complete:', debugInfo)

    res.status(200).json({
      success: true,
      message: 'Database debug completed',
      debugInfo
    })

  } catch (error) {
    console.error('❌ Database debug failed:', error)
    res.status(500).json({
      success: false,
      error: 'Database debug failed',
      details: error.message
    })
  }
}