import { supabase } from './supabase'

// Authentication functions
export async function signUp(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  if (error) throw error
}

export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}