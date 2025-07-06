// Simple deployment helper script for Vercel
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing NotebookLM Directory for Vercel deployment...');

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
}

// Create .env file for Vercel if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file for Vercel deployment');
  
  const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://ciwlmdnmnsymiwmschej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2xtZG5tbnN5bWl3bXNjaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTQzNjMsImV4cCI6MjA2NzI3MDM2M30.Ri_L-EBOOIvTY3WnMd91oegjauObj76pS4JmVIr4yjw
`;
  
  fs.writeFileSync(envPath, envContent);
}

// Create a .trigger-redeploy file to force Vercel to redeploy
fs.writeFileSync(path.join(__dirname, '.trigger-redeploy'), new Date().toISOString());

console.log('✅ Deployment preparation complete!');
console.log('');
console.log('🔍 Next steps:');
console.log('1. Apply database migrations in Supabase SQL Editor');
console.log('2. Create audio bucket in Supabase Storage');
console.log('3. Deploy serve-audio Edge Function');
console.log('4. Push to GitHub and deploy on Vercel');
console.log('');
console.log('🚀 Ready for deployment!');