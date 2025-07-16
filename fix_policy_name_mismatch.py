#!/usr/bin/env python3
import os
import re
import glob

def fix_policy_name_mismatch(file_path):
    """Fix policy name mismatches between CREATE POLICY and policyname checks"""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Define the mapping of short names to actual policy names
    policy_mapping = {
        # Profiles table
        'public_read': 'Anyone can read profiles',
        'authenticated_update': 'Users can update their own profile',
        'owner_insert': 'Users can insert their own profile',
        
        # Saved notebooks table
        'owner_read': 'Users can read their own saved notebooks',
        'owner_insert': 'Users can insert their own saved notebooks',
        'authenticated_delete': 'Users can delete their own saved notebooks',
        
        # Notebooks table
        'public_read': 'Anyone can read notebooks',
        'authenticated_insert': 'Authenticated users can insert notebooks',
        'authenticated_update': 'Authenticated users can update notebooks',
        'authenticated_delete': 'Authenticated users can delete notebooks',
        
        # Subscription plans table
        'public_read': 'Anyone can read subscription plans',
        
        # Subscriptions table
        'owner_read': 'Users can read their own subscriptions',
        'owner_insert': 'Users can insert their own subscriptions',
        'authenticated_update': 'Users can update their own subscriptions',
        
        # Payments table
        'owner_read': 'Users can read their own payments',
        'owner_insert': 'Users can insert their own payments',
        
        # User interactions table
        'owner_read': 'Users can read their own interactions',
        'owner_insert': 'Users can insert their own interactions',
        'authenticated_update': 'Users can update their own interactions',
        
        # Scraping operations table
        'owner_read': 'Users can read their own scraping operations',
        'owner_insert': 'Users can insert their own scraping operations',
        'authenticated_update': 'Users can update their own scraping operations',
        
        # Scraped items table
        'owner_read': 'Users can read their own scraped items',
        'owner_insert': 'Users can insert their own scraped items',
        
        # User events table
        'owner_read': 'Users can read their own events',
        'owner_insert': 'Users can insert their own events',
        
        # Notebook analytics table
        'owner_read': 'Users can read their own analytics',
        'owner_insert': 'Users can insert their own analytics',
        
        # Search analytics table
        'owner_read': 'Users can read their own search analytics',
        'owner_insert': 'Users can insert their own search analytics',
        
        # User preferences table
        'owner_read': 'Users can read their own preferences',
        'owner_insert': 'Users can insert their own preferences',
        'authenticated_update': 'Users can update their own preferences',
        
        # User recommendations table
        'owner_read': 'Users can read their own recommendations',
        'owner_insert': 'Users can insert their own recommendations'
    }
    
    # Fix each policy name mismatch
    for short_name, actual_name in policy_mapping.items():
        # Replace the policyname check to match the actual policy name
        content = re.sub(
            rf"policyname = '{short_name}'",
            f"policyname = '{actual_name}'",
            content
        )
    
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
        fix_policy_name_mismatch(file_path)
    
    print("\nPolicy Name Mismatch Fix Complete!")
    print("All policy names now match between CREATE POLICY and policyname checks.")

if __name__ == "__main__":
    main() 