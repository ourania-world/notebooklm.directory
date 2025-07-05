# ⚡ Quick Start - Deploy in 5 Minutes

## 1. Apply Database Migrations (2 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: `ciwlmdnmnsymiwmschej`
3. Click **SQL Editor** → **New Query**
4. Copy/paste `supabase/migrations/20250705070830_jade_poetry.sql` → **Run**
5. Copy/paste `supabase/migrations/20250705072047_crimson_hall.sql` → **Run**

✅ **Verify**: Check Table Editor for `notebooks`, `profiles`, `saved_notebooks` tables

## 2. Deploy to Vercel (3 minutes)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Deploy**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://ciwlmdnmnsymiwmschej.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw
     ```
   - Click **Deploy**

## 3. Test Your Live App

1. **Sign up** for a new account
2. **Submit** a test notebook
3. **Save** some featured notebooks
4. **Check** your profile dashboard

## 🎉 You're Live!

Your NotebookLM Directory is now live and ready for users!

**Share your deployment URL and start building your community of NotebookLM creators!**