#!/usr/bin/env python3
import os
import re
import glob

def fix_policy_mapping(file_path):
    """Fix policy name mappings with proper table-specific mappings"""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Define table-specific policy mappings
    table_policy_mappings = {
        'profiles': {
            'public_read': 'Anyone can read profiles',
            'authenticated_update': 'Users can update their own profile',
            'owner_insert': 'Users can insert their own profile'
        },
        'saved_notebooks': {
            'owner_read': 'Users can read their own saved notebooks',
            'owner_insert': 'Users can insert their own saved notebooks',
            'authenticated_delete': 'Users can delete their own saved notebooks'
        },
        'notebooks': {
            'public_read': 'Anyone can read notebooks',
            'authenticated_insert': 'Authenticated users can insert notebooks',
            'authenticated_update': 'Authenticated users can update notebooks',
            'authenticated_delete': 'Authenticated users can delete notebooks'
        },
        'subscription_plans': {
            'public_read': 'Anyone can read subscription plans'
        },
        'subscriptions': {
            'owner_read': 'Users can read their own subscriptions',
            'owner_insert': 'Users can insert their own subscriptions',
            'authenticated_update': 'Users can update their own subscriptions'
        },
        'payments': {
            'owner_read': 'Users can read their own payments',
            'owner_insert': 'Users can insert their own payments'
        },
        'user_interactions': {
            'owner_read': 'Users can read their own interactions',
            'owner_insert': 'Users can insert their own interactions',
            'authenticated_update': 'Users can update their own interactions'
        },
        'scraping_operations': {
            'owner_read': 'Users can read their own scraping operations',
            'owner_insert': 'Users can insert their own scraping operations',
            'authenticated_update': 'Users can update their own scraping operations'
        },
        'scraped_items': {
            'owner_read': 'Users can read their own scraped items',
            'owner_insert': 'Users can insert their own scraped items'
        },
        'user_events': {
            'owner_read': 'Users can read their own events',
            'owner_insert': 'Users can insert their own events'
        },
        'notebook_analytics': {
            'owner_read': 'Users can read their own analytics',
            'owner_insert': 'Users can insert their own analytics'
        },
        'search_analytics': {
            'owner_read': 'Users can read their own search analytics',
            'owner_insert': 'Users can insert their own search analytics'
        },
        'user_preferences': {
            'owner_read': 'Users can read their own preferences',
            'owner_insert': 'Users can insert their own preferences',
            'authenticated_update': 'Users can update their own preferences'
        },
        'user_recommendations': {
            'owner_read': 'Users can read their own recommendations',
            'owner_insert': 'Users can insert their own recommendations'
        }
    }
    
    # For each table, fix the policy name checks
    for table_name, policies in table_policy_mappings.items():
        for short_name, actual_name in policies.items():
            # Find DO blocks for this table and short name
            pattern = rf"DO \$\$\s*BEGIN\s*IF NOT EXISTS \(\s*SELECT 1 FROM pg_policies\s*WHERE tablename = '{table_name}'\s*AND policyname = '[^']*'\s*\) THEN\s*CREATE POLICY \"[^\"]*\" ON {table_name}"
            
            # Replace the policyname check with the correct actual name
            replacement = f"DO $$\nBEGIN\n    IF NOT EXISTS (\n        SELECT 1 FROM pg_policies \n        WHERE tablename = '{table_name}' \n        AND policyname = '{actual_name}'\n    ) THEN\n        CREATE POLICY \"{actual_name}\" ON {table_name}"
            
            content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Fixed {file_path}")

def main():
    """Main function to fix all migration files"""
    migration_dir = "supabase/migrations"
    
    if not os.path.exists(migration_dir):
        print(f"Migration directory {migration_dir} not found!")
        return
    
    # Get all SQL migration files
    migration_files = glob.glob(os.path.join(migration_dir, "*.sql"))
    migration_files.sort()
    
    print(f"Fixing {len(migration_files)} migration files")
    
    for file_path in migration_files:
        fix_policy_mapping(file_path)
    
    print("\nPolicy Mapping Fix Complete!")
    print("All policy names now correctly match their table-specific policies.")

if __name__ == "__main__":
    main() 