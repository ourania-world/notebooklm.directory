#!/bin/bash

echo "🚀 Preparing NotebookLM Directory for Vercel deployment..."

# Check if .env.local exists and copy to .env for Vercel
if [ -f .env.local ]; then
  echo "📋 Copying .env.local to .env for Vercel deployment"
  cp .env.local .env
fi

# Create vercel.json if it doesn't exist
if [ ! -f vercel.json ]; then
  echo "📝 Creating vercel.json configuration"
  cat > vercel.json << EOF
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://ciwlmdnmnsymiwmschej.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw"
  }
}
EOF
  echo "✅ Created vercel.json"
fi

# Create .env file for Vercel if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file for Vercel deployment"
  cat > .env << EOF
NEXT_PUBLIC_SUPABASE_URL=https://ciwlmdnmnsymiwmschej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw
EOF
  echo "✅ Created .env file"
fi

# Create a .trigger-redeploy file to force Vercel to redeploy
echo " " > .trigger-redeploy
echo "✅ Created .trigger-redeploy file"

# Make the file executable
chmod +x deploy-to-vercel.sh

echo "✅ Deployment preparation complete!"
echo ""
echo "🔍 Next steps:"
echo "1. Apply database migrations in Supabase SQL Editor"
echo "2. Create audio bucket in Supabase Storage"
echo "3. Deploy serve-audio Edge Function"
echo "4. Push to GitHub and deploy on Vercel"
echo ""
echo "🚀 Ready for deployment!"