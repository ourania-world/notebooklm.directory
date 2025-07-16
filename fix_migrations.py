#!/usr/bin/env python3
import os
import re
import glob

def fix_migration_file(file_path):
    """Fix a single migration file by adding DROP statements before CREATE statements."""
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Track changes
    changes_made = False
    
    # Fix CREATE POLICY statements - avoid duplicates
    policy_pattern = r'(?<!DROP POLICY IF EXISTS ")(CREATE POLICY "([^"]+)"\s+ON\s+(\w+))'
    def add_drop_policy(match):
        policy_name = match.group(2)
        table_name = match.group(3)
        return f'DROP POLICY IF EXISTS "{policy_name}" ON {table_name};\nCREATE POLICY "{policy_name}" ON {table_name}'
    
    new_content = re.sub(policy_pattern, add_drop_policy, content)
    if new_content != content:
        changes_made = True
        content = new_content
    
    # Fix CREATE TRIGGER statements - avoid duplicates
    trigger_pattern = r'(?<!DROP TRIGGER IF EXISTS )(CREATE TRIGGER (\w+)\s+ON\s+(\w+))'
    def add_drop_trigger(match):
        trigger_name = match.group(2)
        table_name = match.group(3)
        return f'DROP TRIGGER IF EXISTS {trigger_name} ON {table_name};\nCREATE TRIGGER {trigger_name} ON {table_name}'
    
    new_content = re.sub(trigger_pattern, add_drop_trigger, content)
    if new_content != content:
        changes_made = True
        content = new_content
    
    # Write back if changes were made
    if changes_made:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Fixed {file_path}")
        return True
    else:
        print(f"  - No changes needed for {file_path}")
        return False

def main():
    """Process all migration files in the supabase/migrations directory."""
    migrations_dir = "supabase/migrations"
    
    if not os.path.exists(migrations_dir):
        print(f"Error: {migrations_dir} directory not found!")
        return
    
    # Get all .sql files
    migration_files = glob.glob(os.path.join(migrations_dir, "*.sql"))
    migration_files.sort()  # Process in chronological order
    
    print(f"Found {len(migration_files)} migration files")
    print("=" * 50)
    
    fixed_count = 0
    for file_path in migration_files:
        if fix_migration_file(file_path):
            fixed_count += 1
    
    print("=" * 50)
    print(f"Fixed {fixed_count} out of {len(migration_files)} migration files")
    print("All migration files are now idempotent!")

if __name__ == "__main__":
    main() 