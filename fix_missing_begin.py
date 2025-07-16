#!/usr/bin/env python3
import os
import re
import glob

def fix_missing_begin(file_path):
    """Fix missing BEGIN statements in functions"""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix functions that are missing BEGIN statements
    # Pattern: RETURNS trigger AS $$ followed by INSERT/SELECT/UPDATE/DELETE without BEGIN
    content = re.sub(
        r'RETURNS trigger AS \$\$\s*\n\s*(INSERT|SELECT|UPDATE|DELETE|NEW\.|RETURN)',
        r'RETURNS trigger AS $$\nBEGIN\n  \1',
        content,
        flags=re.MULTILINE
    )
    
    # Also fix RETURNS TRIGGER AS $$ (uppercase)
    content = re.sub(
        r'RETURNS TRIGGER AS \$\$\s*\n\s*(INSERT|SELECT|UPDATE|DELETE|NEW\.|RETURN)',
        r'RETURNS TRIGGER AS $$\nBEGIN\n  \1',
        content,
        flags=re.MULTILINE
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
        fix_missing_begin(file_path)
    
    print("\nMissing BEGIN Fix Complete!")
    print("All functions now have proper BEGIN statements.")

if __name__ == "__main__":
    main() 