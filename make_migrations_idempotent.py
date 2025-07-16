#!/usr/bin/env python3
import os
import re
import glob

def make_idempotent_sql(sql):
    # CREATE TABLE
    sql = re.sub(r'CREATE TABLE (?!IF NOT EXISTS)', 'CREATE TABLE IF NOT EXISTS', sql)
    # CREATE INDEX
    sql = re.sub(r'CREATE INDEX (?!IF NOT EXISTS)', 'CREATE INDEX IF NOT EXISTS', sql)
    # CREATE TRIGGER
    def trigger_repl(match):
        trigger_name = match.group(1)
        table_name = match.group(2)
        return f'DROP TRIGGER IF EXISTS {trigger_name} ON {table_name};\nCREATE TRIGGER {trigger_name} ON {table_name}'
    sql = re.sub(r'CREATE TRIGGER (\w+)\s+ON\s+(\w+)', trigger_repl, sql)
    # CREATE POLICY
    def policy_repl(match):
        policy_name = match.group(1)
        table_name = match.group(2)
        rest = match.group(3)
        return f'''DO $$\nBEGIN\n  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = '{policy_name}' AND tablename = '{table_name}') THEN\n    CREATE POLICY "{policy_name}" ON {table_name} {rest};\n  END IF;\nEND $$;'''
    sql = re.sub(r'CREATE POLICY "([^"]+)" ON (\w+)([\s\S]*?);', policy_repl, sql)
    # ALTER TABLE ... ADD COLUMN
    def add_column_repl(match):
        table = match.group(1)
        col = match.group(2)
        rest = match.group(3)
        return f'''DO $$\nBEGIN\n  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '{table}' AND column_name = '{col}') THEN\n    ALTER TABLE {table} ADD COLUMN {col} {rest};\n  END IF;\nEND $$;'''
    sql = re.sub(r'ALTER TABLE (\w+) ADD COLUMN (\w+) ([^;]+);', add_column_repl, sql)
    return sql

def main():
    migrations_dir = 'supabase/migrations'
    files = glob.glob(os.path.join(migrations_dir, '*.sql'))
    print(f'Found {len(files)} migration files')
    changed = 0
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            orig = f.read()
        new = make_idempotent_sql(orig)
        if new != orig:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new)
            print(f'  ✓ Fixed {file}')
            changed += 1
        else:
            print(f'  - No changes needed for {file}')
    print(f'Idempotency sweep complete. {changed} files updated.')

if __name__ == '__main__':
    main() 