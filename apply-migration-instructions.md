# Apply Notebooks Migration to Supabase

The application is failing because the `notebooks` table doesn't exist in your Supabase database. Follow these steps to fix this:

## Steps to Apply Migration

1. **Open your Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project dashboard

2. **Access the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query" to create a new SQL query

3. **Copy and Execute the Migration**
   - Copy the entire contents of `supabase/migrations/20250705054804_precious_pond.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

4. **Verify the Table Creation**
   - Go to "Table Editor" in the left sidebar
   - You should see the `notebooks` table with sample data
   - The table should have columns: id, title, description, category, tags, author, institution, notebook_url, audio_overview_url, featured, created_at, updated_at

## What This Migration Does

- Creates the `notebooks` table with proper schema
- Sets up Row Level Security (RLS) policies
- Inserts 6 sample notebook entries
- Creates an auto-update trigger for the `updated_at` column

## After Migration

Once you've successfully run the migration:
1. Refresh your application at `http://localhost:3000`
2. The "Featured Projects" section should now display sample notebooks
3. All database operations should work correctly

## Troubleshooting

If you encounter any issues:
- Make sure you're connected to the correct Supabase project
- Check that your environment variables in `.env.local` match your Supabase project
- Verify the migration ran successfully by checking the Table Editor