import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sql } = req.body;
    
    if (!sql) {
      return res.status(400).json({ error: 'SQL query required' });
    }

    // Execute the SQL using the admin client
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('SQL execution error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to execute SQL',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'SQL executed successfully',
      data
    });
  } catch (error) {
    console.error('Error executing SQL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to execute SQL',
      error: error.message
    });
  }
}