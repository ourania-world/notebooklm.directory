// Direct Node.js script to test database connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ciwlmdnmnsymiwmschej.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY5NDM2MywiZXhwIjoyMDY3MjcwMzYzfQ.QiSIaQmZVd28PSdKMmbHlXk7Xlc2wAjEB467l4Idhok';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function debugPipeline() {
  console.log('🔍 URGENT PIPELINE DEBUG STARTING...');
  
  try {
    // Test 1: Check notebooks table
    console.log('\n1. Checking notebooks table...');
    const { data: notebooks, error: notebooksError, count } = await supabase
      .from('notebooks')
      .select('*', { count: 'exact' })
      .limit(5);
    
    console.log(`   Total notebooks: ${count}`);
    console.log(`   Error: ${notebooksError?.message || 'None'}`);
    console.log(`   Sample data: ${notebooks ? notebooks.length : 0} records`);
    if (notebooks && notebooks.length > 0) {
      console.log(`   First record: ${notebooks[0].title}`);
      console.log(`   Has URL column: ${notebooks[0].hasOwnProperty('url')}`);
      console.log(`   Has source_platform: ${notebooks[0].hasOwnProperty('source_platform')}`);
    }

    // Test 2: Try direct insert
    console.log('\n2. Testing direct insert...');
    const testRecord = {
      title: `DIRECT TEST - ${new Date().toISOString()}`,
      description: 'Direct Node.js test to verify database writes',
      category: 'Academic',
      author: 'Direct Test',
      notebook_url: 'https://directtest.com',
      url: 'https://directtest.com',
      source_platform: 'direct_test',
      extraction_data: { test: true },
      featured: false
    };

    const { data: insertData, error: insertError } = await supabase
      .from('notebooks')
      .insert([testRecord])
      .select();

    console.log(`   Insert success: ${!insertError}`);
    console.log(`   Insert error: ${insertError?.message || 'None'}`);
    console.log(`   Inserted ID: ${insertData?.[0]?.id || 'None'}`);

    // Test 3: Check again
    console.log('\n3. Checking notebooks count after insert...');
    const { count: newCount } = await supabase
      .from('notebooks')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   New total: ${newCount}`);

  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error.message);
  }
}

debugPipeline();