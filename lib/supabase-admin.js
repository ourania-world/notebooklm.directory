import { createClient } from '@supabase/supabase-js';

// Service role key for server-side operations that bypass RLS
const supabaseUrl = 'https://ciwlmdnmnsymiwmschej.supabase.co';

// This is a service role key - it bypasses RLS and should only be used server-side
// For security, this should be in environment variables in production
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY5NDM2MywiZXhwIjoyMDY3MjcwMzYzfQ.nKJ8SQ6-fL7QmQhM5x2QpZa0oRW4s5d6PdNK5BFckKs';

// Create admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔐 Supabase Admin client initialized for server-side operations');

// Helper function to safely use admin client only on server-side
export function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('Supabase admin client should only be used server-side!');
  }
  return supabaseAdmin;
}

// Admin helper functions for scraping operations
export async function createScrapingOperation(operationData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('scraping_operations')
      .insert(operationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating scraping operation:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating scraping operation:', error);
    return { data: null, error };
  }
}

export async function insertScrapedItems(items) {
  try {
    const { data, error } = await supabaseAdmin
      .from('scraped_items')
      .insert(items);
    
    if (error) {
      console.error('Error inserting scraped items:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error inserting scraped items:', error);
    return { data: null, error };
  }
}

export async function updateScrapingOperation(id, updateData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('scraping_operations')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating scraping operation:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating scraping operation:', error);
    return { data: null, error };
  }
}