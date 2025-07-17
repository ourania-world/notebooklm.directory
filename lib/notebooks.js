import { supabase } from './supabase'
import { supabaseAdmin } from './supabase-admin'

// Fetch all notebooks with optional filtering 
export async function getNotebooks(filters = {}) {
  try {
    // Check if supabase client is properly initialized
    if (!supabase) {
      console.error('Supabase client not initialized');
      return getSampleNotebooks(filters);
    }
    
    try {
      // First try to get from notebooks table using admin client for full access
      let query = supabaseAdmin
        .from('notebooks')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply category filter
      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      // Apply search filter 
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
      }

      // Apply featured filter 
      if (filters.featured) {
        query = query.eq('featured', true);
      }

      // Apply limit if specified
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        console.log('Notebooks table empty or failed, trying scraped_items...');
        
        // Fallback: try to get recent scraped items and format them as notebooks
        const { data: scrapedData, error: scrapedError } = await supabaseAdmin
          .from('scraped_items')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(filters.limit || 20);
        
        if (!scrapedError && scrapedData && scrapedData.length > 0) {
          console.log(`✅ Found ${scrapedData.length} scraped items, converting to notebook format`);
          
          // Convert scraped items to notebook format
          const convertedNotebooks = scrapedData.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            url: item.url,
            author: item.author || 'Unknown',
            category: item.source === 'reddit' ? 'AI' : 
                     item.source === 'github' ? 'Tools' : 
                     item.source === 'arxiv' ? 'Research' :
                     item.source === 'notebooklm' ? 'AI' : 'General',
            tags: ['AI', 'Research'],
            featured: (item.quality_score || 0) > 0.9,
            status: 'published',
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString(),
            popularity_score: Math.floor((item.quality_score || 0.7) * 100),
            source_platform: item.source
          }));
          
          return convertedNotebooks;
        }
      }

      return data || [];
    } catch (dbError) {
      console.log('Database query issue (using fallback):', dbError.message);
      return getSampleNotebooks(filters);
    }
  } catch (error) {
    console.log('Error in getNotebooks (using fallback):', error.message);
    // Fall back to sample data if any error occurs
    return getSampleNotebooks(filters);
  }
}

// Sample data fallback
function getSampleNotebooks(filters = {}) {
  const sampleNotebooks = [ 
    {
      id: '1',
      title: 'Climate Research Analysis with NotebookLM',
      description: 'Comprehensive analysis of 50+ climate research papers using NotebookLM to identify key trends and research gaps in climate science.',
      category: 'Academic',
      tags: ['Climate Science', 'Research', 'Environmental'],
      author: 'Dr. Sarah Chen',
      institution: 'Stanford University',
      notebook_url: 'https://notebooklm.google.com/notebook/example1',
      audio_overview_url: '/overview.mp3',
      featured: true,
      created_at: '2025-01-15T10:00:00Z',
      view_count: 1250,
      save_count: 89
    },
    {
      id: '2',
      title: 'AI Ethics Framework Development',
      description: 'Using NotebookLM to synthesize ethical guidelines from multiple AI research papers and policy documents.',
      category: 'Research',
      tags: ['AI Ethics', 'Policy', 'Framework'],
      author: 'Prof. Michael Rodriguez',
      institution: 'MIT',
      notebook_url: 'https://notebooklm.google.com/notebook/example2',
      featured: true,
      created_at: '2025-01-14T15:30:00Z',
      view_count: 892,
      save_count: 67
    },
    {
      id: '3',
      title: 'Startup Pitch Deck Analysis',
      description: 'Analyzing successful startup pitch decks to extract key patterns and success factors for entrepreneurs.',
      category: 'Business',
      tags: ['Entrepreneurship', 'Business Strategy', 'Startups'],
      author: 'Emma Thompson',
      institution: 'Y Combinator',
      notebook_url: 'https://notebooklm.google.com/notebook/example3',
      featured: false,
      created_at: '2025-01-13T09:15:00Z',
      view_count: 634,
      save_count: 45
    },
    {
      id: '4',
      title: 'Creative Writing Workshop Analysis',
      description: 'Using NotebookLM to analyze award-winning short stories and extract narrative techniques.',
      category: 'Creative',
      tags: ['Creative Writing', 'Literature', 'Storytelling'],
      author: 'James Wilson',
      institution: 'Independent Writer',
      notebook_url: 'https://notebooklm.google.com/notebook/example4',
      featured: false,
      created_at: '2025-01-12T14:20:00Z',
      view_count: 423,
      save_count: 32
    },
    {
      id: '5',
      title: 'Educational Curriculum Design',
      description: 'Designing computer science curriculum for high schools using NotebookLM to analyze effective learning materials.',
      category: 'Education',
      tags: ['Education', 'Curriculum', 'Computer Science'],
      author: 'Dr. Lisa Park',
      institution: 'UC Berkeley',
      notebook_url: 'https://notebooklm.google.com/notebook/example5',
      featured: false,
      created_at: '2025-01-11T11:45:00Z',
      view_count: 567,
      save_count: 41
    },
    {
      id: '6',
      title: 'Personal Finance Optimization',
      description: 'Using NotebookLM to analyze personal spending patterns and create customized financial planning recommendations.',
      category: 'Personal',
      tags: ['Personal Finance', 'Investment', 'Budgeting'],
      author: 'Alex Kim',
      institution: 'Personal Project',
      notebook_url: 'https://notebooklm.google.com/notebook/example6',
      featured: false,
      created_at: '2025-01-10T16:30:00Z',
      view_count: 789,
      save_count: 56
    }
  ]

  let filteredNotebooks = [...sampleNotebooks] 

  // Apply filters
  if (filters.category && filters.category !== 'All') {
    filteredNotebooks = filteredNotebooks.filter(n => n.category === filters.category)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredNotebooks = filteredNotebooks.filter(n => 
      n.title.toLowerCase().includes(searchLower) ||
      n.description.toLowerCase().includes(searchLower) ||
      n.author.toLowerCase().includes(searchLower) ||
      n.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  if (filters.featured) {
    filteredNotebooks = filteredNotebooks.filter(n => n.featured)
  }

  // Apply limit if specified
  if (filters.limit && filteredNotebooks.length > filters.limit) {
    filteredNotebooks = filteredNotebooks.slice(0, filters.limit)
  }
  
  return filteredNotebooks
}

// Fetch a single notebook by ID
export async function getNotebook(id) {
  try {
    const { data, error } = await supabaseAdmin
      .from('notebooks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching notebook:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in getNotebook:', error)
    throw error
  }
}

// Create a new notebook
export async function createNotebook(notebook) {
  try {
    const { data, error } = await supabase 
      .from('notebooks')
      .insert([notebook])
      .select()
      .single()

    if (error) {
      console.error('Error creating notebook:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in createNotebook:', error)
    throw error
  }
}

// Update an existing notebook
export async function updateNotebook(id, updates) {
  try {
    const { data, error } = await supabase 
      .from('notebooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating notebook:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateNotebook:', error)
    throw error
  }
}

// Delete a notebook
export async function deleteNotebook(id) {
  try {
    const { error } = await supabase 
      .from('notebooks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting notebook:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteNotebook:', error)
    throw error
  }
}

// Get category counts for filtering
export async function getCategoryCounts() {
  try {
    const { data, error } = await supabase 
      .from('notebooks')
      .select('category')

    if (error) {
      console.error('Error fetching category counts:', error)
      return {
        'Academic': 2,
        'Business': 1,
        'Creative': 1, 
        'Research': 1,
        'Education': 1,
        'Personal': 1
      }
    }

    const counts = data.reduce((acc, notebook) => {
      acc[notebook.category] = (acc[notebook.category] || 0) + 1
      return acc
    }, {})

    return counts
  } catch (error) {
    console.error('Error in getCategoryCounts:', error)
    return {
      'Academic': 2,
      'Business': 1,
      'Creative': 1, 
      'Research': 1,
      'Education': 1,
      'Personal': 1
    }
  }
}