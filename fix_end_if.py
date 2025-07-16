#!/usr/bin/env python3
import os
import re
import glob

def fix_end_if_statements(file_path):
    """Fix missing END IF; statements in DO blocks"""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match DO blocks that are missing END IF;
    # Look for DO blocks that end with just END $$; without END IF;
    pattern = r'(CREATE POLICY.*?;)\s*\n\s*END \$\$;'
    
    def replace_match(match):
        policy_statement = match.group(1)
        return f'{policy_statement}\n    END IF;\nEND $$;'
    
    content = re.sub(pattern, replace_match, content, flags=re.DOTALL)
    
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
        fix_end_if_statements(file_path)
    
    print("\nEND IF Fix Complete!")
    print("All DO blocks now have proper END IF; statements.")

if __name__ == "__main__":
    main() 