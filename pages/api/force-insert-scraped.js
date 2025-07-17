import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sample data that matches the scraped_items table structure
    const testData = [
      {
        operation_id: 'test-op-' + Date.now(),
        source: 'reddit',
        title: 'Test Reddit Post',
        description: 'This is a test post to verify database insertion',
        url: 'https://reddit.com/r/test',
        author: 'testuser',
        quality_score: 0.75,
        metadata: {
          subreddit: 'test',
          score: 10,
          comments: 5
        }
      },
      {
        operation_id: 'test-op-' + Date.now(),
        source: 'github',
        title: 'Test GitHub Repo',
        description: 'This is a test repo to verify database insertion',
        url: 'https://github.com/test/repo',
        author: 'testdev',
        quality_score: 0.85,
        metadata: {
          stars: 100,
          language: 'Python',
          topics: ['machine-learning', 'ai']
        }
      }
    ];

    // Try to insert the test data
    const { data, error } = await supabaseAdmin
      .from('scraped_items')
      .insert(testData)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to insert test data',
        error: error.message,
        details: error
      });
    }

    console.log('Successfully inserted test data:', data);
    return res.status(200).json({
      success: true,
      message: 'Test data inserted successfully',
      inserted: data.length,
      data
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unexpected error during insertion',
      error: error.message
    });
  }
}