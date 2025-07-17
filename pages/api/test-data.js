import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔧 Checking database and adding test data...');

    // First, check if we have any data
    const { data: existingData, error: checkError } = await supabase
      .from('notebooks')
      .select('*')
      .limit(5);

    if (checkError) {
      console.error('Database check error:', checkError);
      return res.status(400).json({ 
        error: 'Database check failed',
        details: checkError.message 
      });
    }

    console.log('Existing data count:', existingData?.length || 0);

    // If we have less than 3 items, add some test data
    if (!existingData || existingData.length < 3) {
      console.log('Adding test data...');

      const testData = [
        {
          title: 'AI-Powered Content Discovery System',
          description: 'A comprehensive guide to building advanced content discovery platforms using modern AI techniques, vector embeddings, and semantic search.',
          url: 'https://example.com/ai-discovery',
          source_type: 'article',
          category: 'ai',
          tags: JSON.stringify(['AI', 'Machine Learning', 'Vector Search', 'Embeddings']),
          content_type: 'tutorial',
          created_at: new Date().toISOString()
        },
        {
          title: 'Building Scalable Web Applications with Next.js',
          description: 'Learn how to create high-performance, scalable web applications using Next.js, React, and modern deployment strategies.',
          url: 'https://example.com/nextjs-guide',
          source_type: 'tutorial',
          category: 'webdev',
          tags: JSON.stringify(['Next.js', 'React', 'JavaScript', 'Web Development']),
          content_type: 'guide',
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          title: 'Database Optimization for Large Scale Applications',
          description: 'Advanced techniques for optimizing database performance, including indexing strategies, query optimization, and scaling approaches.',
          url: 'https://example.com/db-optimization',
          source_type: 'technical',
          category: 'data',
          tags: JSON.stringify(['Database', 'PostgreSQL', 'Performance', 'Optimization']),
          content_type: 'technical',
          created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          title: 'Real-time Data Processing with Event Streams',
          description: 'Implementing real-time data processing pipelines using event streaming technologies and microservices architecture.',
          url: 'https://example.com/realtime-processing',
          source_type: 'guide',
          category: 'data',
          tags: JSON.stringify(['Real-time', 'Event Streaming', 'Microservices', 'Data Processing']),
          content_type: 'guide',
          created_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        },
        {
          title: 'Semantic Search and Vector Databases',
          description: 'Understanding vector databases, embedding models, and semantic search implementation for modern applications.',
          url: 'https://example.com/semantic-search',
          source_type: 'article',
          category: 'ai',
          tags: JSON.stringify(['Vector Database', 'Semantic Search', 'Embeddings', 'AI']),
          content_type: 'article',
          created_at: new Date(Date.now() - 345600000).toISOString() // 4 days ago
        }
      ];

      const { data: insertedData, error: insertError } = await supabase
        .from('notebooks')
        .insert(testData)
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        return res.status(400).json({ 
          error: 'Failed to insert test data',
          details: insertError.message 
        });
      }

      console.log('Test data inserted:', insertedData?.length || 0);
    }

    // Get updated data count
    const { data: finalData, error: finalError } = await supabase
      .from('notebooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (finalError) {
      console.error('Final check error:', finalError);
      return res.status(400).json({ 
        error: 'Final data check failed',
        details: finalError.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Test data check complete',
      totalItems: finalData?.length || 0,
      sampleItems: finalData?.slice(0, 3) || []
    });

  } catch (error) {
    console.error('Test data API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}