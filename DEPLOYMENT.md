# Deployment Guide for NotebookLM Directory

## Prerequisites

Before deploying, ensure you have:

1. ✅ Applied the database migration to Supabase
2. ✅ Verified the application works locally
3. ✅ Pushed your code to GitHub
4. ✅ Your Supabase project is active

## Step 1: Apply Database Migration (CRITICAL)

**⚠️ This must be done before deployment!**

1. Go to your [Supabase Dashboard](https://supabase.com)
2. Navigate to your project: `ciwlmdnmnsymiwmschej`
3. Click "SQL Editor" → "New Query"
4. Copy the entire contents of `supabase/migrations/20250705054804_precious_pond.sql`
5. Paste and execute the query
6. Verify the `notebooks` table exists with sample data

## Step 2: Deploy to Vercel

### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/notebooklm-directory&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Option B: Manual Deploy

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   
   Add these environment variables in Vercel:
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://ciwlmdnmnsymiwmschej.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw` |

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `your-project.vercel.app`

## Step 3: Verify Deployment

After deployment:

1. ✅ Visit your Vercel URL
2. ✅ Check that featured projects load
3. ✅ Test the "Connect a New Notebook" button
4. ✅ Browse projects page works
5. ✅ Submit form functions correctly

## Step 4: Custom Domain (Optional)

To add a custom domain:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys the changes
```

## Troubleshooting

### Common Issues

1. **"Column notebooks.title does not exist"**
   - ❌ Database migration not applied
   - ✅ Apply the migration in Supabase SQL Editor

2. **Environment variables not working**
   - ❌ Variables not set in Vercel dashboard
   - ✅ Add them in Project Settings → Environment Variables

3. **Build fails**
   - ❌ Missing dependencies or syntax errors
   - ✅ Test locally first with `npm run build`

4. **Database connection fails**
   - ❌ Wrong Supabase URL or key
   - ✅ Verify credentials in Supabase dashboard

### Performance Optimization

For production, consider:

1. **Image Optimization**
   - Use Next.js Image component for any images
   - Configure image domains in `next.config.js`

2. **Caching**
   - Implement SWR or React Query for data fetching
   - Use Vercel's edge caching

3. **Analytics**
   - Enable Vercel Analytics
   - Add Google Analytics if needed

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review [Supabase documentation](https://supabase.com/docs)
3. Open an issue on the GitHub repository

## Security Notes

- The Supabase anon key is safe to expose in frontend code
- Row Level Security (RLS) is enabled on the database
- Consider implementing authentication for production use