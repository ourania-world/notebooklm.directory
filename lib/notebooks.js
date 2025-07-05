import { supabase } from './supabase'

// Fetch all notebooks with optional filtering
export async function getNotebooks(filters = {}) {
  try {
    // Sample data for immediate functionality
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

    return filteredNotebooks

    // Original Supabase code (commented out for immediate functionality)
    /*
    let query = supabase
      .from('notebooks')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category)
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Apply featured filter
    if (filters.featured) {
      query = query.eq('featured', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching notebooks:', error)
      throw error
    }

    return data || []
    */
  } catch (error) {
    console.error('Error in getNotebooks:', error)
    // Return sample data even on error for immediate functionality
    return sampleNotebooks || []
  }
}

// Fetch a single notebook by ID
export async function getNotebook(id) {
  const { data, error } = await supabase
    .from('notebooks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching notebook:', error)
    throw error
  }

  return data
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
}

// Delete a notebook
export async function deleteNotebook(id) {
  const { error } = await supabase
    .from('notebooks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting notebook:', error)
    throw error
  }

  return true
}

// Get category counts for filtering
export async function getCategoryCounts() {
  try {
    const { data, error } = await supabase
      .from('notebooks')
      .select('category')

    if (error) {
      console.error('Error fetching category counts:', error)
      return {}
    }

    const counts = data.reduce((acc, notebook) => {
      acc[notebook.category] = (acc[notebook.category] || 0) + 1
      return acc
    }, {})

    return counts
  } catch (error) {
    console.error('Error in getCategoryCounts:', error)
    return {}
  }
}