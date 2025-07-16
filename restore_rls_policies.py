#!/usr/bin/env python3
import os
import re
import glob

def clean_orphaned_statements(content):
    """Remove orphaned END IF; statements and policy comments"""
    # Remove orphaned END IF; statements
    content = re.sub(r'^\s*END IF;\s*$', '', content, flags=re.MULTILINE)
    
    # Remove policy comments that don't have actual policies
    content = re.sub(r'^\s*-- Policy for.*$\n', '', content, flags=re.MULTILINE)
    
    # Clean up multiple empty lines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    return content

def add_rls_policies_for_table(content, table_name, policies):
    """Add RLS policies for a specific table"""
    # Find where RLS is enabled for this table
    rls_pattern = rf'ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;'
    
    if rls_pattern in content:
        # Find the position after RLS enable
        rls_pos = content.find(rls_pattern) + len(rls_pattern)
        
        # Insert policies after RLS enable
        policy_block = '\n\n'
        for policy_name, policy_sql in policies:
            policy_block += f"""DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = '{table_name}' 
        AND policyname = '{policy_name}'
    ) THEN
        {policy_sql}
    END IF;
END $$;

"""
        
        # Insert the policy block
        content = content[:rls_pos] + policy_block + content[rls_pos:]
    
    return content

def get_standard_policies():
    """Define standard policies for different table types"""
    return {
        'notebooks': [
            ('public_read', 'CREATE POLICY "Anyone can read notebooks" ON notebooks FOR SELECT USING (true);'),
            ('authenticated_insert', 'CREATE POLICY "Authenticated users can insert notebooks" ON notebooks FOR INSERT WITH CHECK (auth.role() = \'authenticated\');'),
            ('owner_update', 'CREATE POLICY "Users can update their own notebooks" ON notebooks FOR UPDATE USING (auth.uid()::text = author_id) WITH CHECK (auth.uid()::text = author_id);'),
            ('owner_delete', 'CREATE POLICY "Users can delete their own notebooks" ON notebooks FOR DELETE USING (auth.uid()::text = author_id);')
        ],
        'profiles': [
            ('public_read', 'CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);'),
            ('owner_update', 'CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);')
        ],
        'saved_notebooks': [
            ('owner_read', 'CREATE POLICY "Users can read their own saved notebooks" ON saved_notebooks FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own saved notebooks" ON saved_notebooks FOR INSERT WITH CHECK (auth.uid() = user_id);'),
            ('owner_delete', 'CREATE POLICY "Users can delete their own saved notebooks" ON saved_notebooks FOR DELETE USING (auth.uid() = user_id);')
        ],
        'subscription_plans': [
            ('public_read', 'CREATE POLICY "Anyone can read subscription plans" ON subscription_plans FOR SELECT USING (true);')
        ],
        'subscriptions': [
            ('owner_read', 'CREATE POLICY "Users can read their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);'),
            ('owner_update', 'CREATE POLICY "Users can update their own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);')
        ],
        'payments': [
            ('owner_read', 'CREATE POLICY "Users can read their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);')
        ],
        'user_interactions': [
            ('owner_read', 'CREATE POLICY "Users can read their own interactions" ON user_interactions FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own interactions" ON user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);'),
            ('owner_update', 'CREATE POLICY "Users can update their own interactions" ON user_interactions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);')
        ],
        'scraping_operations': [
            ('owner_read', 'CREATE POLICY "Users can read their own scraping operations" ON scraping_operations FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own scraping operations" ON scraping_operations FOR INSERT WITH CHECK (auth.uid() = user_id);'),
            ('owner_update', 'CREATE POLICY "Users can update their own scraping operations" ON scraping_operations FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);')
        ],
        'scraped_items': [
            ('owner_read', 'CREATE POLICY "Users can read their own scraped items" ON scraped_items FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own scraped items" ON scraped_items FOR INSERT WITH CHECK (auth.uid() = user_id);')
        ],
        'user_events': [
            ('owner_read', 'CREATE POLICY "Users can read their own events" ON user_events FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own events" ON user_events FOR INSERT WITH CHECK (auth.uid() = user_id);')
        ],
        'notebook_analytics': [
            ('owner_read', 'CREATE POLICY "Users can read their own analytics" ON notebook_analytics FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own analytics" ON notebook_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);')
        ],
        'search_analytics': [
            ('owner_read', 'CREATE POLICY "Users can read their own search analytics" ON search_analytics FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own search analytics" ON search_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);')
        ],
        'user_preferences': [
            ('owner_read', 'CREATE POLICY "Users can read their own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);'),
            ('owner_update', 'CREATE POLICY "Users can update their own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);')
        ],
        'user_recommendations': [
            ('owner_read', 'CREATE POLICY "Users can read their own recommendations" ON user_recommendations FOR SELECT USING (auth.uid() = user_id);'),
            ('owner_insert', 'CREATE POLICY "Users can insert their own recommendations" ON user_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);')
        ]
    }

def process_migration_file(file_path):
    """Process a single migration file"""
    print(f"Processing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Clean orphaned statements first
    content = clean_orphaned_statements(content)
    
    # Get standard policies
    standard_policies = get_standard_policies()
    
    # Find all tables with RLS enabled
    rls_tables = re.findall(r'ALTER TABLE (\w+) ENABLE ROW LEVEL SECURITY;', content)
    
    # Add policies for each table
    for table_name in rls_tables:
        if table_name in standard_policies:
            content = add_rls_policies_for_table(content, table_name, standard_policies[table_name])
            print(f"  Added policies for {table_name}")
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Completed {file_path}")

def main():
    """Main function to process all migration files"""
    migration_dir = "supabase/migrations"
    
    if not os.path.exists(migration_dir):
        print(f"Migration directory {migration_dir} not found!")
        return
    
    # Get all SQL migration files
    migration_files = glob.glob(os.path.join(migration_dir, "*.sql"))
    migration_files.sort()  # Process in chronological order
    
    print(f"Found {len(migration_files)} migration files")
    
    for file_path in migration_files:
        process_migration_file(file_path)
    
    print("\nRLS Policy Restoration Complete!")
    print("All migration files have been updated with proper RLS policies.")

if __name__ == "__main__":
    main() 