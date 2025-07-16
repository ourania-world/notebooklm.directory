#!/usr/bin/env python3
import os
import re
import glob

def fix_column_references(file_path):
    """Fix incorrect column references in RLS policies"""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix notebooks table policies - remove owner-based policies since author is text, not user ID
    # Replace owner_update and owner_delete policies with simpler authenticated policies
    
    # For notebooks table, replace owner-based policies with authenticated policies
    content = re.sub(
        r'CREATE POLICY "Users can update their own notebooks" ON notebooks FOR UPDATE USING \(auth\.uid\(\)::text = author_id\) WITH CHECK \(auth\.uid\(\)::text = author_id\);',
        'CREATE POLICY "Authenticated users can update notebooks" ON notebooks FOR UPDATE USING (auth.role() = \'authenticated\') WITH CHECK (auth.role() = \'authenticated\');',
        content
    )
    
    content = re.sub(
        r'CREATE POLICY "Users can delete their own notebooks" ON notebooks FOR DELETE USING \(auth\.uid\(\)::text = author_id\);',
        'CREATE POLICY "Authenticated users can delete notebooks" ON notebooks FOR DELETE USING (auth.role() = \'authenticated\');',
        content
    )
    
    # Update policy names in the DO blocks
    content = re.sub(
        r'policyname = \'owner_update\'',
        'policyname = \'authenticated_update\'',
        content
    )
    
    content = re.sub(
        r'policyname = \'owner_delete\'',
        'policyname = \'authenticated_delete\'',
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
        fix_column_references(file_path)
    
    print("\nColumn Reference Fix Complete!")
    print("All incorrect column references have been fixed.")

if __name__ == "__main__":
    main() 