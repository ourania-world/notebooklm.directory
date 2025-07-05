import { supabase } from './supabase'

// Fetch all notebooks with optional filtering
export async function getNotebooks(filters = {}) {
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
}