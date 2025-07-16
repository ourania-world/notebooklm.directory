import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if we can connect to Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from('notebooks')
      .select('count');
    
    if (connectionError) {
      return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Could not connect to database',
        error: connectionError.message,
        details: {
          code: connectionError.code,
          hint: connectionError.hint || null
        }
      });
    }
    
    // Check if tables exist
    const tables = ['notebooks', 'profiles', 'saved_notebooks'];
    const tableStatus = {};
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        tableStatus[table] = {
          exists: !error,
          count: count || 0,
          error: error ? error.message : null
        };
      } catch (tableError) {
        tableStatus[table] = {
          exists: false,
          count: 0,
          error: tableError.message
        };
      }
    }
    
    // Check if audio bucket exists
    let audioBucketExists = false;
    try {
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (!bucketsError) {
        audioBucketExists = buckets.some(bucket => bucket.name === 'audio');
      }
    } catch (storageError) {
      console.error('Error checking audio bucket:', storageError);
    }
    
    // Return migration status
    return res.status(200).json({
      success: true,
      status: 'connected',
      tables: tableStatus,
      audioBucket: {
        exists: audioBucketExists
      },
      environment: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error) {
    console.error('Error checking migration status:', error);
    return res.status(500).json({
      success: false,
      status: 'error',
      message: 'Failed to check migration status',
      error: error.message
    });
  }
}