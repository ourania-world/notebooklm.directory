import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, limit = 20, category, source } = req.method === 'GET' ? req.query : req.body;

    console.log('🔍 Enhanced search API called:', { query, limit, category, source });

    // Build base query
    let dbQuery = supabase
      .from('notebooks')
      .select('*');

    // Add text search if query provided
    if (query && query.trim()) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Add category filter
    if (category && category !== 'all') {
      dbQuery = dbQuery.eq('category', category);
    }

    // Add source filter
    if (source && source !== 'all') {
      dbQuery = dbQuery.eq('source_type', source);
    }

    // Add ordering and limit
    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .limit(parseInt(limit) || 20);

    const { data, error } = await dbQuery;

    if (error) {
      console.error('Database error:', error);
      return res.status(400).json({ 
        error: 'Database query failed',
        details: error.message 
      });
    }

    // Add mock enhanced data for demonstration
    const enhancedResults = (data || []).map((item, index) => ({
      ...item,
      // Add mock AI scores for demonstration
      quality_score: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
      embedding_score: Math.random() * 0.3 + 0.7,
      popularity: Math.floor(Math.random() * 30) + 70, // 70 to 100
      tags: item.tags || ['AI', 'Research', 'NotebookLM'],
      content_type: item.content_type || 'notebook',
      expertise_level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
      sentiment: ['positive', 'neutral'][Math.floor(Math.random() * 2)]
    }));

    // Sort by relevance (combination of quality and embedding scores)
    const sortedResults = enhancedResults.sort((a, b) => {
      const scoreA = (a.quality_score || 0.5) * (a.embedding_score || 0.5);
      const scoreB = (b.quality_score || 0.5) * (b.embedding_score || 0.5);
      return scoreB - scoreA;
    });

    return res.status(200).json({
      success: true,
      results: sortedResults,
      count: sortedResults.length,
      query: query || 'all',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Enhanced search API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}