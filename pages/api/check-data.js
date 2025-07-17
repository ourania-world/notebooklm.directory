// Simple diagnostic endpoint to check if scraped data exists
import { supabase } from '../../lib/supabase'
import { supabaseAdmin } from '../../lib/supabase-admin'

export default async function handler(req, res) {
  console.log('🔍 CHECKING DATABASE FOR SCRAPED DATA...')
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    publicAccess: {},
    adminAccess: {}
  }

  // Test 1: Public access to notebooks table
  try {
    const { data, error, count } = await supabase
      .from('notebooks')
      .select('*', { count: 'exact', head: true })
    
    diagnostics.publicAccess.notebooks = {
      status: error ? 'error' : 'success',
      count: count || 0,
      error: error?.message
    }
  } catch (e) {
    diagnostics.publicAccess.notebooks = {
      status: 'exception',
      error: e.message
    }
  }

  // Test 2: Public access to scraped_items table
  try {
    const { data, error, count } = await supabase
      .from('scraped_items')
      .select('*', { count: 'exact', head: true })
    
    diagnostics.publicAccess.scraped_items = {
      status: error ? 'error' : 'success',
      count: count || 0,
      error: error?.message
    }
  } catch (e) {
    diagnostics.publicAccess.scraped_items = {
      status: 'exception',
      error: e.message
    }
  }

  // Test 3: Admin access to notebooks table
  try {
    const { data, error, count } = await supabaseAdmin
      .from('notebooks')
      .select('*', { count: 'exact', head: true })
    
    diagnostics.adminAccess.notebooks = {
      status: error ? 'error' : 'success',
      count: count || 0,
      error: error?.message
    }
  } catch (e) {
    diagnostics.adminAccess.notebooks = {
      status: 'exception',
      error: e.message
    }
  }

  // Test 4: Admin access to scraped_items table
  try {
    const { data, error, count } = await supabaseAdmin
      .from('scraped_items')
      .select('*', { count: 'exact', head: true })
    
    diagnostics.adminAccess.scraped_items = {
      status: error ? 'error' : 'success',
      count: count || 0,
      error: error?.message
    }
  } catch (e) {
    diagnostics.adminAccess.scraped_items = {
      status: 'exception',
      error: e.message
    }
  }

  // Test 5: Get sample data if any exists
  try {
    const { data: samples } = await supabaseAdmin
      .from('scraped_items')
      .select('title, source, created_at')
      .limit(3)
      .order('created_at', { ascending: false })
    
    if (samples && samples.length > 0) {
      diagnostics.recentScrapedItems = samples
    }
  } catch (e) {
    diagnostics.recentScrapedItems = []
  }

  console.log('✅ Database diagnostics complete:', diagnostics)

  res.status(200).json({
    success: true,
    diagnostics,
    summary: {
      publicCanReadNotebooks: diagnostics.publicAccess.notebooks?.status === 'success',
      publicCanReadScrapedItems: diagnostics.publicAccess.scraped_items?.status === 'success',
      notebooksExist: (diagnostics.adminAccess.notebooks?.count || 0) > 0,
      scrapedItemsExist: (diagnostics.adminAccess.scraped_items?.count || 0) > 0
    }
  })
}