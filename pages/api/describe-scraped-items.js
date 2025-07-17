import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to get the first row to see the column structure
    const { data: sampleData, error: sampleError } = await supabaseAdmin
      .from('scraped_items')
      .select('*')
      .limit(1);

    // Also try a simple insert to see what columns are expected
    const testInsert = {
      operation_id: 'test-123',
      source: 'reddit',
      title: 'Test',
      description: 'Test description',
      url: 'https://test.com',
      author: 'testuser',
      quality_score: 0.5
    };

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('scraped_items')
      .insert([testInsert])
      .select();

    let insertResult = null;
    if (insertError) {
      insertResult = {
        success: false,
        error: insertError.message,
        details: insertError
      };
    } else {
      insertResult = {
        success: true,
        insertedData: insertData
      };
    }

    return res.status(200).json({
      success: true,
      sample_data: {
        count: sampleData?.length || 0,
        data: sampleData || [],
        error: sampleError?.message || null
      },
      insert_test: insertResult
    });
  } catch (error) {
    console.error('Error describing scraped_items:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to describe scraped_items',
      error: error.message
    });
  }
}