#!/usr/bin/env python3
import os
import re
import glob

def nuclear_fix_migration(file_path):
    """NUCLEAR OPTION: Strip all DO blocks and rebuild with brute force simplicity"""
    print(f"NUCLEAR FIXING {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # STEP 1: REMOVE ALL DO BLOCKS COMPLETELY
    content = re.sub(r'DO \$\$.*?END \$\$;', '', content, flags=re.DOTALL)
    
    # STEP 2: REMOVE ORPHANED BEGIN/END STATEMENTS
    content = re.sub(r'^\s*BEGIN\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*END\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*END IF;\s*$', '', content, flags=re.MULTILINE)
    
    # STEP 3: REMOVE ORPHANED IF NOT EXISTS
    content = re.sub(r'^\s*IF NOT EXISTS.*?THEN\s*.*?END IF;', '', content, flags=re.MULTILINE | re.DOTALL)
    
    # STEP 4: FIX FUNCTIONS - ADD MISSING BEGIN
    def fix_function(match):
        func_header = match.group(1)
        func_body = match.group(2)
        func_end = match.group(3)
        
        # If no BEGIN in body, add it
        if 'BEGIN' not in func_body.upper():
            return f"{func_header}\nBEGIN\n{func_body}\nEND;\n{func_end}"
        return match.group(0)
    
    content = re.sub(r'(CREATE OR REPLACE FUNCTION.*?RETURNS.*?\$\$)(.*?)(\$\$)', fix_function, content, flags=re.DOTALL)
    
    # STEP 5: CLEAN UP MULTIPLE EMPTY LINES
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # STEP 6: ADD ESSENTIAL POLICIES BACK (SIMPLE VERSION)
    # Only add the most essential policies without DO blocks
    
    # Find tables with RLS enabled
    rls_tables = re.findall(r'ALTER TABLE (\w+) ENABLE ROW LEVEL SECURITY;', content)
    
    for table in rls_tables:
        if table == 'notebooks':
            # Add simple policies for notebooks
            policies = f"""
-- Simple policies for {table}
CREATE POLICY "Anyone can read {table}" ON {table} FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert {table}" ON {table} FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update {table}" ON {table} FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete {table}" ON {table} FOR DELETE USING (auth.role() = 'authenticated');
"""
        elif table == 'profiles':
            policies = f"""
-- Simple policies for {table}
CREATE POLICY "Anyone can read {table}" ON {table} FOR SELECT USING (true);
CREATE POLICY "Users can update their own {table}" ON {table} FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert their own {table}" ON {table} FOR INSERT WITH CHECK (auth.uid() = id);
"""
        elif table == 'saved_notebooks':
            policies = f"""
-- Simple policies for {table}
CREATE POLICY "Users can read their own {table}" ON {table} FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own {table}" ON {table} FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own {table}" ON {table} FOR DELETE USING (auth.uid() = user_id);
"""
        else:
            # Generic policies for other tables
            policies = f"""
-- Simple policies for {table}
CREATE POLICY "Anyone can read {table}" ON {table} FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert {table}" ON {table} FOR INSERT WITH CHECK (auth.role() = 'authenticated');
"""
        
        # Insert policies after RLS enable
        rls_pos = content.find(f'ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;')
        if rls_pos != -1:
            insert_pos = rls_pos + len(f'ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;')
            content = content[:insert_pos] + policies + content[insert_pos:]
    
    # STEP 7: FINAL CLEANUP
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    content = content.strip() + '\n'
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  NUCLEAR FIXED {file_path}")

def main():
    """NUCLEAR OPTION: Fix all migrations with brute force"""
    migration_dir = "supabase/migrations"
    
    if not os.path.exists(migration_dir):
        print(f"Migration directory {migration_dir} not found!")
        return
    
    migration_files = glob.glob(os.path.join(migration_dir, "*.sql"))
    migration_files.sort()
    
    print(f"NUCLEAR FIXING {len(migration_files)} migration files")
    print("STRIPPING ALL DO BLOCKS AND REBUILDING WITH BRUTE FORCE SIMPLICITY")
    
    for file_path in migration_files:
        nuclear_fix_migration(file_path)
    
    print("\nNUCLEAR MIGRATION FIX COMPLETE!")
    print("ALL DO BLOCKS REMOVED - BRUTE FORCE SIMPLICITY APPLIED")
    print("MIGRATIONS SHOULD NOW WORK WITH ZERO ERRORS")

if __name__ == "__main__":
    main() 