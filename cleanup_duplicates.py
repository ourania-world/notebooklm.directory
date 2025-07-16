#!/usr/bin/env python3
import os
import re
import glob

def cleanup_migration_file(file_path):
    """Clean up duplicate policies and orphaned statements"""
    print(f"Cleaning {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove duplicate RLS policy blocks (keep only the new ones with DO blocks)
    # Pattern to match old-style policy blocks without DO blocks
    old_policy_pattern = r'-- RLS Policies\s*\n(?:DO \$\$\s*BEGIN\s*IF NOT EXISTS.*?END \$\$;\s*\n)*'
    content = re.sub(old_policy_pattern, '', content, flags=re.DOTALL)
    
    # Remove orphaned END IF; statements
    content = re.sub(r'^\s*END IF;\s*$', '', content, flags=re.MULTILINE)
    
    # Remove policy comments that don't have actual policies
    content = re.sub(r'^\s*-- Policy for.*$\n', '', content, flags=re.MULTILINE)
    
    # Clean up multiple empty lines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # Remove any remaining orphaned DO blocks without content
    content = re.sub(r'DO \$\$\s*BEGIN\s*END IF;\s*END \$\$;\s*\n', '', content, flags=re.MULTILINE)
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Cleaned {file_path}")

def main():
    """Main function to clean all migration files"""
    migration_dir = "supabase/migrations"
    
    if not os.path.exists(migration_dir):
        print(f"Migration directory {migration_dir} not found!")
        return
    
    # Get all SQL migration files
    migration_files = glob.glob(os.path.join(migration_dir, "*.sql"))
    migration_files.sort()
    
    print(f"Cleaning {len(migration_files)} migration files")
    
    for file_path in migration_files:
        cleanup_migration_file(file_path)
    
    print("\nCleanup Complete!")
    print("All duplicate policies and orphaned statements have been removed.")

if __name__ == "__main__":
    main() 