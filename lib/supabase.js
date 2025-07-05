import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables')
  // Create a mock client for development
  export const supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null }),
      signUp: () => ({ data: null, error: null }),
      signInWithPassword: () => ({ data: null, error: null }),
      signOut: () => ({ error: null })
    }
  }
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}