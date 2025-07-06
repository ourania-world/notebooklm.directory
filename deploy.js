// Deployment helper script for NotebookLM Directory
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing NotebookLM Directory for deployment...');

// Check if all required dependencies are installed
try {
  console.log('📦 Checking dependencies...');
  
  // List of required dependencies
  const requiredDeps = [
    '@stripe/react-stripe-js',
    '@stripe/stripe-js',
    'micro',
    'stripe'
  ];
  
  // Check package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log(`⚠️ Missing dependencies: ${missingDeps.join(', ')}`);
    console.log('📦 Installing missing dependencies...');
    
    execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } else {
    console.log('✅ All required dependencies are installed');
  }
} catch (error) {
  console.error('❌ Error checking dependencies:', error);
}

// Create vercel.json if it doesn't exist
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  console.log('📝 Creating vercel.json configuration');
  
  const vercelConfig = {
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": "https://ciwlmdnmnsymiwmschej.supabase.co",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw"
    }
  };
  
  fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Created vercel.json');
}

// Create .env file for Vercel if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file for Vercel deployment');
  
  const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://ciwlmdnmnsymiwmschej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
}

// Create a .trigger-redeploy file to force Vercel to redeploy
fs.writeFileSync(path.join(__dirname, '.trigger-redeploy'), new Date().toISOString());
console.log('✅ Created .trigger-redeploy file');

// Create a deployment checklist
const checklistPath = path.join(__dirname, 'DEPLOYMENT_CHECKLIST.md');
if (!fs.existsSync(checklistPath)) {
  console.log('📝 Creating deployment checklist');
  
  const checklistContent = `# NotebookLM Directory Deployment Checklist

## Database Setup
- [ ] Apply migration: \`supabase/migrations/20250705070830_jade_poetry.sql\`
- [ ] Apply migration: \`supabase/migrations/20250705072047_crimson_hall.sql\`
- [ ] Apply migration: \`supabase/migrations/20250707000000_create_audio_bucket.sql\`
- [ ] Verify tables exist: notebooks, profiles, saved_notebooks
- [ ] Verify audio bucket exists

## Environment Variables
- [ ] Set NEXT_PUBLIC_SUPABASE_URL
- [ ] Set NEXT_PUBLIC_SUPABASE_ANON_KEY

## Deployment
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Verify deployment works

## Testing
- [ ] Test user authentication
- [ ] Test notebook submission
- [ ] Test saving notebooks
- [ ] Test audio playback
`;
  
  fs.writeFileSync(checklistPath, checklistContent);
  console.log('✅ Created deployment checklist');
}

console.log('\n✅ Deployment preparation complete!');
console.log('\n🔍 Next steps:');
console.log('1. Apply database migrations in Supabase SQL Editor');
console.log('2. Create audio bucket in Supabase Storage');
console.log('3. Deploy serve-audio Edge Function');
console.log('4. Push to GitHub and deploy on Vercel');
console.log('\n🚀 Ready for deployment!');