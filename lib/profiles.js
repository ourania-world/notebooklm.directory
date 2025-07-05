import { supabase } from './supabase'

// Create user profile
export async function createProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      ...profileData
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Get user profile
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Update user profile
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Save/unsave notebook
export async function toggleSavedNotebook(userId, notebookId) {
  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_notebooks')
    .select('id')
    .eq('user_id', userId)
    .eq('notebook_id', notebookId)
    .single()

  if (existing) {
    // Remove from saved
    const { error } = await supabase
      .from('saved_notebooks')
      .delete()
      .eq('user_id', userId)
      .eq('notebook_id', notebookId)
    
    if (error) throw error
    return false // unsaved
  } else {
    // Add to saved
    const { error } = await supabase
      .from('saved_notebooks')
      .insert([{
        user_id: userId,
        notebook_id: notebookId
      }])
    
    if (error) throw error
    return true // saved
  }
}

// Get user's saved notebooks
export async function getSavedNotebooks(userId) {
  const { data, error } = await supabase
    .from('saved_notebooks')
    .select(`
      notebook_id,
      notebooks (*)
    `)
    .eq('user_id', userId)

  if (error) throw error
  return data?.map(item => item.notebooks) || []
}

// Get user's submitted notebooks
export async function getUserNotebooks(userId) {
  const { data, error } = await supabase
    .from('notebooks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}