import { createClient } from '@supabase/supabase-js';

// Get environment variables - these must be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw';

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found. Using fallback values.');
}

// Ensure we're using the correct Supabase URL
const finalSupabaseUrl = supabaseUrl.includes('ciwlmdnmnsymiwmschej') 
  ? supabaseUrl 
  : 'https://ciwlmdnmnsymiwmschej.supabase.co';

console.log('🔧 Supabase URL being used:', finalSupabaseUrl);

// Create the Supabase client with proper options for browser environment
export const supabase = createClient(finalSupabaseUrl, supabaseAnonKey, { 
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