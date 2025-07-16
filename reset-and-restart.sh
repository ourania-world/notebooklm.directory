#!/bin/bash

echo "🔄 Resetting Supabase database..."
supabase db reset

echo "🚀 Starting Supabase..."
supabase start

echo "✅ Reset and restart complete!"
echo "Your database is now fresh and ready for development." 