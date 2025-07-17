#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this after installing Vercel CLI: npm i -g vercel

echo "🚀 Setting up Vercel environment variables for admin dashboard..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it with: npm i -g vercel"
    exit 1
fi

echo "📝 Setting environment variables..."

# Supabase Configuration
vercel env add SUPABASE_URL production <<< "https://ciwlmdnmnsymiwmschej.supabase.co"
vercel env add SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.yD-2vczZuAqxGjbktbvB_mMt2vQHHwXMcWF4xfEzLEM"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY5NDM2MywiZXhwIjoyMDY3MjcwMzYzfQ.nKJ8SQ6-fL7QmQhM5x2QpZa0oRW4s5d6PdNK5BFckKs"

# Public variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://ciwlmdnmnsymiwmschej.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.yD-2vczZuAqxGjbktbvB_mMt2vQHHwXMcWF4xfEzLEM"

# Admin configuration
vercel env add NEXT_PUBLIC_ADMIN_EMAIL production <<< "admin@notebooklm.directory"

echo "✅ Environment variables configured!"
echo "🔄 Triggering new deployment..."

# Trigger a new deployment to pick up the environment variables
vercel --prod

echo "🎉 Setup complete! Your admin dashboard should now be fully functional."
echo "🌐 Access it at: https://notebooklm-directory.vercel.app/enhanced-scraping-dashboard"
echo "🔑 Login with: admin@notebooklm.directory"