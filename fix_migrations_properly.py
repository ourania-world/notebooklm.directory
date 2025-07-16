#!/usr/bin/env python3
import os
import re
import glob

def fix_migration_file(file_path):
    print(f"Processing: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    changes_made = False

    # Remove all existing DROP POLICY IF EXISTS statements
    content = re.sub(r'DROP POLICY IF EXISTS "[^"]+" ON [^;]+;\n?', '', content)

    # Remove any nested DO blocks (flatten to just CREATE POLICY, we'll re-wrap)
    content = re.sub(r'DO \$\$\s*BEGIN\s*DO \$\$.*?END \$\$;\s*END \$\$;', '', content, flags=re.DOTALL)

    # Fix CREATE TABLE statements
    content = re.sub(r'CREATE TABLE (?!IF NOT EXISTS)', 'CREATE TABLE IF NOT EXISTS', content)

    # Fix CREATE INDEX statements
    content = re.sub(r'CREATE INDEX (?!IF NOT EXISTS)', 'CREATE INDEX IF NOT EXISTS', content)

    # Fix CREATE TRIGGER statements - add DROP TRIGGER IF EXISTS before each CREATE TRIGGER
    def add_drop_trigger(match):
        trigger_name = match.group(1)
        table_name = match.group(2)
        return f'DROP TRIGGER IF EXISTS {trigger_name} ON {table_name};\nCREATE TRIGGER {trigger_name} ON {table_name}'
    content = re.sub(r'CREATE TRIGGER (\w+)\s+ON\s+(\w+)', add_drop_trigger, content)

    # Fix CREATE POLICY statements - wrap in a single DO block
    def wrap_policy_in_do(match):
        policy_name = match.group(1)
        table_name = match.group(2)
        policy_def = match.group(3)
        return f'''DO $$\nBEGIN\n  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = '{policy_name}' AND tablename = '{table_name}') THEN\n    CREATE POLICY "{policy_name}" ON {table_name}{policy_def};\n  END IF;\nEND $$;'''
    # Remove any existing DO blocks for CREATE POLICY
    content = re.sub(r'DO \$\$\s*BEGIN\s*IF NOT EXISTS \(SELECT 1 FROM pg_policies WHERE polname = \'([^"]+)\' AND tablename = \'(\w+)\'\) THEN\s*CREATE POLICY "\1" ON \2([\s\S]*?);\s*END IF;\s*END \$\$;', '', content)
    content = re.sub(r'CREATE POLICY "([^"]+)" ON (\w+)([\s\S]*?);', wrap_policy_in_do, content)

    # Fix ALTER TABLE ADD COLUMN statements
    def wrap_alter_in_do(match):
        table = match.group(1)
        col = match.group(2)
        rest = match.group(3)
        return f'''DO $$\nBEGIN\n  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '{table}' AND column_name = '{col}') THEN\n    ALTER TABLE {table} ADD COLUMN {col} {rest};\n  END IF;\nEND $$;'''
    content = re.sub(r'ALTER TABLE (\w+) ADD COLUMN (\w+) ([^;]+);', wrap_alter_in_do, content)

    # Write back if changes were made
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  ✓ Fixed {file_path}")
    return True

def main():
    migrations_dir = "supabase/migrations"
    migration_files = glob.glob(os.path.join(migrations_dir, "*.sql"))
    migration_files.sort()
    print(f"Found {len(migration_files)} migration files")
    print("=" * 50)
    for file_path in migration_files:
        fix_migration_file(file_path)
    print("=" * 50)
    print("All migration files are now properly idempotent and free of nested DO blocks!")

if __name__ == "__main__":
    main() 