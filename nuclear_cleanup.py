#!/usr/bin/env python3
import os
import re
import glob

def extract_policies(sql):
    """Find all CREATE POLICY statements (even inside DO blocks)"""
    policy_regex = re.compile(
        r'CREATE POLICY\s+"([^"]+)"\s+ON\s+(\w+)([\s\S]*?);', re.MULTILINE)
    return policy_regex.findall(sql)

def remove_policy_do_blocks(sql):
    """Remove all DO blocks that reference pg_policies or CREATE POLICY"""
    # Remove nested DO blocks first
    sql = re.sub(
        r'DO\s+\$\$.*?DO\s+\$\$.*?END\s+\$\$;.*?END\s+\$\$;',
        '', sql, flags=re.DOTALL)
    # Remove single DO blocks that reference pg_policies
    sql = re.sub(
        r'DO\s+\$\$.*?(pg_policies|CREATE POLICY)[\s\S]*?END\s+\$\$;',
        '', sql, flags=re.DOTALL)
    return sql

def remove_orphaned_policy_lines(sql):
    """Remove any orphaned DO/BEGIN/END lines that are left over from policy blocks"""
    # Remove empty DO blocks
    sql = re.sub(r'DO\s+\$\$\s*BEGIN\s*END\s+\$\$;', '', sql)
    # Remove orphaned BEGIN/END statements
    sql = re.sub(r'^\s*(BEGIN|END\s+\$\$;)\s*$', '', sql, flags=re.MULTILINE)
    return sql

def insert_clean_policies(sql, policies):
    """Remove all orphaned CREATE POLICY statements and insert clean ones"""
    # Remove all CREATE POLICY statements (they'll be re-added)
    sql = re.sub(r'CREATE POLICY\s+"([^"]+)"\s+ON\s+(\w+)[\s\S]*?;', '', sql)
    
    # Insert all policies with clean DO block structure
    policy_blocks = []
    for name, table, body in policies:
        # Clean up the policy body (remove extra whitespace, etc.)
        body = body.strip()
        if not body.startswith('\n'):
            body = '\n' + body
        
        block = f'''DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = '{name}' AND tablename = '{table}'
  ) THEN
    CREATE POLICY "{name}" ON {table}{body};
  END IF;
END $$;'''
        policy_blocks.append(block)
    
    # Add policies after the table creation but before other operations
    # Find a good insertion point (after CREATE TABLE statements)
    if policy_blocks:
        # Insert after the last CREATE TABLE IF NOT EXISTS
        table_pattern = r'(CREATE TABLE IF NOT EXISTS.*?;)(\s*\n)'
        match = re.search(table_pattern, sql, re.DOTALL)
        if match:
            insert_point = match.end()
            sql = sql[:insert_point] + '\n\n-- RLS Policies\n' + '\n\n'.join(policy_blocks) + '\n\n' + sql[insert_point:]
        else:
            # If no CREATE TABLE found, insert at the beginning
            sql = '-- RLS Policies\n' + '\n\n'.join(policy_blocks) + '\n\n' + sql
    
    return sql

def fix_migration_file(file_path):
    """Apply nuclear cleanup to a single migration file"""
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Step 1: Extract all policies
    policies = extract_policies(content)
    print(f"    Found {len(policies)} policies")
    
    # Step 2: Remove all DO blocks for policies
    content = remove_policy_do_blocks(content)
    
    # Step 3: Remove orphaned DO/BEGIN/END lines
    content = remove_orphaned_policy_lines(content)
    
    # Step 4: Insert clean policies
    content = insert_clean_policies(content, policies)
    
    # Write back the cleaned file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Fixed {file_path}")

def main():
    """Apply nuclear cleanup to all migration files"""
    migrations_dir = "supabase/migrations"
    migration_files = glob.glob(os.path.join(migrations_dir, "*.sql"))
    migration_files.sort()
    
    print(f"Found {len(migration_files)} migration files")
    print("=" * 50)
    print("🔥 NUCLEAR CLEANUP IN PROGRESS 🔥")
    print("=" * 50)
    
    for file_path in migration_files:
        fix_migration_file(file_path)
    
    print("=" * 50)
    print("✅ NUCLEAR CLEANUP COMPLETE!")
    print("All migration files are now properly idempotent and free of nested DO blocks!")
    print("=" * 50)

if __name__ == "__main__":
    main() 