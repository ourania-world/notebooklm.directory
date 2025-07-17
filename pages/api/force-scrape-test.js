import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Force insert test data directly to notebooks table
    const testData = [
      {
        title: 'FRESH TEST - AI Breakthrough Discussion',
        description: 'This is a fresh test to verify the data pipeline is working. Real Reddit discussion about AI breakthroughs.',
        url: 'https://reddit.com/r/MachineLearning/ai-breakthrough',
        notebook_url: 'https://reddit.com/r/MachineLearning/ai-breakthrough',
        author: 'AI_Researcher',
        category: 'Academic',
        tags: ['AI', 'Machine Learning', 'Research'],
        featured: true,
        source_platform: 'reddit',
        extraction_data: {
          originalMetadata: {
            subreddit: 'MachineLearning',
            score: 150,
            comments: 45
          },
          qualityScore: 0.92,
          extractedAt: new Date().toISOString()
        }
      },
      {
        title: 'GitHub AI Project - OpenAI Alternative',
        description: 'Open source alternative to OpenAI with better performance and lower costs. Community-driven development.',
        url: 'https://github.com/community/ai-alternative',
        notebook_url: 'https://github.com/community/ai-alternative',
        author: 'CommunityDev',
        category: 'Research',
        tags: ['Open Source', 'AI', 'GitHub'],
        featured: false,
        source_platform: 'github',
        extraction_data: {
          originalMetadata: {
            stars: 1200,
            language: 'Python',
            topics: ['artificial-intelligence', 'machine-learning']
          },
          qualityScore: 0.87,
          extractedAt: new Date().toISOString()
        }
      },
      {
        title: 'ArXiv Paper - Neural Network Optimization',
        description: 'Latest research on neural network optimization techniques with 15% performance improvements.',
        url: 'https://arxiv.org/abs/2024.12345',
        notebook_url: 'https://arxiv.org/abs/2024.12345',
        author: 'Dr. Neural Networks',
        category: 'Research',
        tags: ['Neural Networks', 'Optimization', 'Research'],
        featured: false,
        source_platform: 'arxiv',
        extraction_data: {
          originalMetadata: {
            categories: ['cs.AI', 'cs.LG'],
            submitted: '2024-01-15'
          },
          qualityScore: 0.95,
          extractedAt: new Date().toISOString()
        }
      }
    ];

    // Insert directly into notebooks table
    const { data, error } = await supabaseAdmin
      .from('notebooks')
      .insert(testData)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Fresh test data inserted successfully',
      inserted: data.length,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}