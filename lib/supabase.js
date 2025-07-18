import { createClient } from '@supabase/supabase-js';

// Always use the correct Supabase URL and key - no environment variable dependency
const finalSupabaseUrl = 'https://ciwlmdnmnsymiwmschej.supabase.co';
const finalSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw';

console.log('�� Supabase URL being used:', finalSupabaseUrl);
console.log('�� Supabase Key being used:', finalSupabaseKey.substring(0, 20) + '...');

// Create the Supabase client with proper options for browser environment
export const supabase = createClient(finalSupabaseUrl, finalSupabaseKey, { 
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
    
    // Handle missing session gracefully
    if (error) {
      if (error.name === 'AuthSessionMissingError' || error.message?.includes('session missing')) {
        console.info('No auth session, user is browsing as guest');
        return null;
      }
      // Only log real errors
      console.error('Error getting current user:', error);
      return null;
    }
    
    // Check if user actually exists
    if (!data?.user) {
      console.info('No user session found, continuing as guest');
      return null;
    }
    
    return data.user;
  } catch (error) {
    // Handle specific auth errors
    if (error.name === 'AuthSessionMissingError') {
      console.info('No auth session, user is not logged in');
      return null;
    }
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
    
    // Handle missing session gracefully
    if (error) {
      if (error.name === 'AuthSessionMissingError' || error.message?.includes('session missing')) {
        console.info('No auth session exists');
        return null;
      }
      // Only log real errors
      console.error('Error getting session:', error);
      return null;
    }
    
    // Check if session actually exists
    if (!data?.session) {
      console.info('No active session');
      return null;
    }
    
    return data.session;
  } catch (error) {
    // Handle specific auth errors
    if (error.name === 'AuthSessionMissingError') {
      console.info('No auth session exists');
      return null;
    }
    console.error('Unexpected error getting session:', error);
    return null;
  }
}