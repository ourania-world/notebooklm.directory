import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create the Supabase client with proper options for browser environment
export const supabase = createClient(supabaseUrl, supabaseAnonKey, { 
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false // Disable URL detection to avoid issues
  }
});

// Safe helper function to get current user without throwing errors
export async function getCurrentUser() {
  try {
    // Only run on client side
    if (typeof window === 'undefined') {
      return null;
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Cannot get current user: Missing Supabase environment variables');
      return null;
    }
    
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.warn('Error getting current user:', error);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    return null;
  }
}

// Safe helper function to get session without throwing errors
export async function getSession() {
  try {
    // Only run on client side
    if (typeof window === 'undefined') {
      return null;
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Cannot get session: Missing Supabase environment variables');
      return null;
    }
    
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Error getting session:', error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
}