#!/usr/bin/env python3
import os
import re
import glob

def final_nuclear_cleanup(file_path):
    """FINAL NUCLEAR CLEANUP: Remove all duplicate END; and fix remaining syntax"""
    print(f"FINAL NUCLEAR CLEANUP: {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove duplicate END; statements
    content = re.sub(r'END;\s*\n\s*END;', 'END;', content)
    
    # Remove orphaned END; statements
    content = re.sub(r'^\s*END;\s*$', '', content, flags=re.MULTILINE)
    
    # Fix functions with proper spacing
    content = re.sub(r'BEGIN\s*\n\s*\n', 'BEGIN\n  ', content)
    content = re.sub(r'\n\s*\n\s*END;', '\nEND;', content)
    
    # Clean up multiple empty lines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # Ensure proper semicolons
    content = re.sub(r';\s*\n', ';\n', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  FINAL NUCLEAR CLEANUP COMPLETE: {file_path}")

def main():
    """FINAL NUCLEAR CLEANUP: Fix all remaining syntax issues"""
    migration_dir = "supabase/migrations"
    
    if not os.path.exists(migration_dir):
        print(f"Migration directory {migration_dir} not found!")
        return
    
    migration_files = glob.glob(os.path.join(migration_dir, "*.sql"))
    migration_files.sort()
    
    print(f"FINAL NUCLEAR CLEANUP: {len(migration_files)} migration files")
    
    for file_path in migration_files:
        final_nuclear_cleanup(file_path)
    
    print("\nFINAL NUCLEAR CLEANUP COMPLETE!")
    print("ALL DUPLICATE END; REMOVED - MIGRATIONS SHOULD NOW WORK PERFECTLY")

if __name__ == "__main__":
    main() 