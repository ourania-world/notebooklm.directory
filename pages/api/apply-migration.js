import { supabase } from '../../lib/supabase';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the migration file content
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250710000000_create_basic_tables.sql');
    
    if (!fs.existsSync(migrationPath)) {
      return res.status(404).json({
        success: false,
        message: 'Migration file not found'
      });
    }
    
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationContent });
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to apply migration',
        error: error.message
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Migration applied successfully'
    });
  } catch (error) {
    console.error('Error applying migration:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to apply migration',
      error: error.message
    });
  }
}