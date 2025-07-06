# NotebookLM Directory Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. ✅ A Supabase account and project
2. ✅ A Vercel account (recommended) or Netlify account
3. ✅ Your code pushed to a GitHub repository

## Step 1: Apply Database Migrations

This is the most critical step. You must apply the database migrations in the correct order:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project
3. Click on "SQL Editor" in the left sidebar
4. Create a new query
5. Copy and paste the contents of each migration file in order:
   - `supabase/migrations/20250707000000_create_notebooks.sql`
   - `supabase/migrations/20250707000001_create_profiles.sql`
   - `supabase/migrations/20250707000002_create_audio_bucket.sql`
6. Execute each migration and verify it completes successfully

## Step 2: Deploy Edge Functions

1. Go to your Supabase Dashboard → Edge Functions
2. Create a new function named `serve-audio`
3. Copy the code from `supabase/functions/serve-audio/index.ts`
4. Deploy the function

## Step 3: Set Up Environment Variables

Create a `.env.local` file with these variables for local development:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click "Deploy"

## Step 5: Verify Deployment

After deployment:

1. Visit your deployed site
2. Test user authentication (sign up, sign in)
3. Test notebook submission
4. Test audio playback
5. Test saving notebooks

## Troubleshooting

### Common Issues

1. **"Column notebooks.title does not exist"**
   - You haven't applied the database migrations
   - Go back to Step 1 and apply all migrations

2. **Audio not playing**
   - Check that the `serve-audio` Edge Function is deployed
   - Verify the audio bucket exists in Supabase Storage
   - Upload a test audio file to the audio bucket

3. **Authentication not working**
   - Verify your environment variables are correct
   - Check Supabase Auth settings (redirect URLs, etc.)

4. **Deployment fails**
   - Check build logs for specific errors
   - Verify all dependencies are installed
   - Make sure environment variables are set correctly

## Post-Deployment

1. **Add a custom domain** (optional)
   - Go to Vercel project settings → Domains
   - Add your custom domain

2. **Set up analytics** (optional)
   - Enable Vercel Analytics in project settings
   - Or add Google Analytics

3. **Monitor performance**
   - Check Vercel Analytics for performance metrics
   - Monitor Supabase usage and performance

## Support

If you encounter issues:
- Check Supabase logs for database errors
- Check Vercel deployment logs for build errors
- Verify environment variables are set correctly