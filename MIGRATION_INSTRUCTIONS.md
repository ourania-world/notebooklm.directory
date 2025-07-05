# URGENT: Apply Database Migration

## The Problem
Your application is failing because the migration file `supabase/migrations/20250705054804_precious_pond.sql` exists in your codebase but hasn't been applied to your Supabase database yet.

## Solution: Apply the Migration Manually

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in and navigate to your project: `ciwlmdnmnsymiwmschej`

### Step 2: Access SQL Editor
1. Click "SQL Editor" in the left sidebar
2. Click "New Query"

### Step 3: Execute the Migration
1. Copy the ENTIRE contents of `supabase/migrations/20250705054804_precious_pond.sql`
2. Paste it into the SQL Editor
3. Click "Run" to execute

### Step 4: Verify Success
After running the migration, check:
1. Go to "Table Editor" → You should see the `notebooks` table
2. The table should have these columns:
   - id (uuid)
   - title (text) ← This is the missing column causing the error
   - description (text)
   - category (text)
   - tags (text[])
   - author (text)
   - institution (text)
   - notebook_url (text)
   - audio_overview_url (text)
   - featured (boolean)
   - created_at (timestamptz)
   - updated_at (timestamptz)
3. You should see 6 sample notebook entries

### Step 5: Test the Application
1. Refresh your browser at `http://localhost:3000`
2. The errors should be resolved
3. Featured projects should display correctly

## Why This Happened
- The migration file was created but never executed in your database
- Your application code expects the `notebooks` table with a `title` column
- The database doesn't have this table/column yet
- This causes the "column notebooks.title does not exist" error

## After Migration Success
Once the migration is applied:
- All database operations will work
- The "Connect a New Notebook" button will function
- Featured projects will display
- Browse page will work correctly