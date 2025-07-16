#!/usr/bin/env python3
import os
import re
import glob

def fix_update_function(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to match the broken function (missing END;)
    broken_func = re.compile(r'(CREATE OR REPLACE FUNCTION update_updated_at_column\(\)\s+RETURNS TRIGGER AS \$\$\s*BEGIN[\s\S]*?RETURN NEW;)(\s*)\$\$ language [\'\"]?plpgsql[\'\"]?;?', re.IGNORECASE)
    
    def replacer(match):
        body = match.group(1)
        # If already ends with END;, do nothing
        if body.strip().endswith('END;'):
            return match.group(0)
        # Otherwise, add END; before $$
        return f"{body}\nEND;\n$$ language 'plpgsql';"
    
    new_content = broken_func.sub(replacer, content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed function in {file_path}")

def main():
    migration_dir = "supabase/migrations"
    files = glob.glob(os.path.join(migration_dir, "*.sql"))
    for file_path in files:
        fix_update_function(file_path)
    print("All update_updated_at_column functions fixed!")

if __name__ == "__main__":
    main() 