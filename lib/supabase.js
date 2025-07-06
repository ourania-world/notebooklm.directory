import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw';

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