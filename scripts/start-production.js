#!/usr/bin/env node

console.log('🚀 Railway Production Server');
console.log('=====================================');
console.log('');
console.log('📋 Server Information:');
console.log(`   ✅ Production URL: https://companion-app-production-0cc9.up.railway.app`);
console.log(`   ✅ Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   ✅ Port: ${process.env.PORT || 3000}`);
console.log(`   ✅ Note: Next.js will show localhost:8080 in logs, but app runs on Railway URL`);
console.log('');
console.log('🔍 Health Check Endpoints:');
console.log('   - Health: /api/health');
console.log('   - Test: /api/test');
console.log('   - Startup: /api/startup');
console.log('');
console.log('🌐 Your Domains:');
console.log('   - Railway: https://companion-app-production-0cc9.up.railway.app');
console.log('   - Vercel (Latest): https://companion-app-tau.vercel.app');
console.log('   - Vercel (Git): https://companion-app-git-main-itcbrio.vercel.app');
console.log('');
console.log('✅ Starting server...');
console.log('');

// Start the Next.js server
const { spawn } = require('child_process');
const nextStart = spawn('npx', ['next', 'start'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

nextStart.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

nextStart.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
}); 