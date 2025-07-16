#!/usr/bin/env python3
import os
import re
import glob

def fix_duplicate_end_if(file_path):
    """Fix duplicate END IF; statements in DO blocks"""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove duplicate END IF; statements
    content = re.sub(r'END IF;\s*END IF;', 'END IF;', content)
    
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
        fix_duplicate_end_if(file_path)
    
    print("\nDuplicate END IF Fix Complete!")
    print("All duplicate END IF; statements have been removed.")

if __name__ == "__main__":
    main() 