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

// Check if user has premium access
export async function checkUserSubscription(userId) {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select(`
        status,
        subscription_plans (
          id,
          limits
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.warn('Error checking subscription:', error)
      return { plan: 'free', limits: { savedNotebooks: 5, submittedNotebooks: 2, premiumContent: false } }
    }

    if (!subscription) {
      return { plan: 'free', limits: { savedNotebooks: 5, submittedNotebooks: 2, premiumContent: false } }
    }

    return {
      plan: subscription.subscription_plans?.id || 'free',
      limits: subscription.subscription_plans?.limits || { savedNotebooks: 5, submittedNotebooks: 2, premiumContent: false }
    }
  } catch (error) {
    console.warn('Error checking user subscription:', error)
    return { plan: 'free', limits: { savedNotebooks: 5, submittedNotebooks: 2, premiumContent: false } }
  }
}

// Get user's usage statistics
export async function getUserUsageStats(userId) {
  try {
    const [savedCount, submittedCount] = await Promise.all([
      supabase
        .from('saved_notebooks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabase
        .from('notebooks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
    ])

    return {
      savedNotebooks: savedCount.count || 0,
      submittedNotebooks: submittedCount.count || 0
    }
  } catch (error) {
    console.warn('Error getting usage stats:', error)
    return {
      savedNotebooks: 0,
      submittedNotebooks: 0
    }
  }
}