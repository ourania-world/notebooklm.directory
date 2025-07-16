#!/usr/bin/env python3
import os
import re
import glob

def fix_policyname_to_createpolicy(file_path):
    """For every DO block with a policyname check, set policyname to match the CREATE POLICY name exactly."""
    print(f"Fixing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find DO blocks with policyname checks and CREATE POLICY statements
    def replacer(match):
        do_block = match.group(0)
        # Find the CREATE POLICY name inside the block
        policy_match = re.search(r'CREATE POLICY\s+"([^"]+)"', do_block)
        if not policy_match:
            return do_block  # No CREATE POLICY, skip
        policy_name = policy_match.group(1)
        # Replace the policyname = '...' with the correct name
        fixed = re.sub(r"policyname = '[^']*'", f"policyname = '{policy_name}'", do_block)
        return fixed

    # Pattern: DO $$ ... policyname = '...' ... CREATE POLICY "..." ... END $$;
    pattern = re.compile(r'DO \$\$.*?policyname = \'[^\']*\'.*?CREATE POLICY\s+\"[^\"]+\".*?END \$\$;', re.DOTALL)
    content = pattern.sub(replacer, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  Fixed {file_path}")

def main():
    migration_dir = "supabase/migrations"
    if not os.path.exists(migration_dir):
        print(f"Migration directory {migration_dir} not found!")
        return
    migration_files = glob.glob(os.path.join(migration_dir, "*.sql"))
    migration_files.sort()
    print(f"Fixing {len(migration_files)} migration files")
    for file_path in migration_files:
        fix_policyname_to_createpolicy(file_path)
    print("\nPolicyname-to-CreatePolicy Fix Complete!")
    print("All policyname checks now exactly match CREATE POLICY names.")

if __name__ == "__main__":
    main() 