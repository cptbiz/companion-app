#!/usr/bin/env node

const https = require('https');

console.log('🌐 Domain Management for Companion App');
console.log('=====================================\n');

const domains = {
  railway: 'https://companion-app-production-0cc9.up.railway.app',
  vercel1: 'https://companion-app-git-main-itcbrio.vercel.app',
  vercel2: 'https://companion-8j6mcqkhn-itcbrio.vercel.app',
  vercel3: 'https://companion-app-tau.vercel.app'
};

const endpoints = [
  '/',
  '/api/health',
  '/api/test',
  '/api/startup'
];

function testEndpoint(baseUrl, endpoint) {
  return new Promise((resolve) => {
    const url = baseUrl + endpoint;
    https.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        error: err.message
      });
    });
  });
}

async function testAllDomains() {
  console.log('🔍 Testing all domains...\n');

  for (const [name, baseUrl] of Object.entries(domains)) {
    console.log(`📋 ${name.toUpperCase()}: ${baseUrl}`);
    console.log('─'.repeat(50));

    for (const endpoint of endpoints) {
      const result = await testEndpoint(baseUrl, endpoint);
      
      if (result.status === 200) {
        console.log(`✅ ${endpoint} - ${result.status}`);
      } else if (result.status === 'ERROR') {
        console.log(`❌ ${endpoint} - ${result.error}`);
      } else {
        console.log(`⚠️  ${endpoint} - ${result.status} ${result.statusText}`);
      }
    }
    console.log('');
  }
}

function showRecommendations() {
  console.log('🎯 Recommendations:');
  console.log('==================\n');

  console.log('1. 🚀 Primary Production (Recommended):');
  console.log(`   URL: ${domains.railway}`);
  console.log('   Platform: Railway');
  console.log('   Type: Full Stack (Frontend + Backend)');
  console.log('   Status: ✅ Production Ready\n');

  console.log('2. 🔧 Development/Preview:');
  console.log(`   URL: ${domains.vercel1}`);
  console.log('   Platform: Vercel');
  console.log('   Type: Frontend Only');
  console.log('   Status: 🔄 Git-based deployment\n');

  console.log('3. 🧪 Testing:');
  console.log(`   URL: ${domains.vercel2}`);
  console.log('   Platform: Vercel');
  console.log('   Type: Frontend Only');
  console.log('   Status: 🔄 Direct deployment\n');

  console.log('4. 🚀 Latest Deployment:');
  console.log(`   URL: ${domains.vercel3}`);
  console.log('   Platform: Vercel');
  console.log('   Type: Frontend Only');
  console.log('   Status: ✅ Latest (from main branch)\n');
}

function showEnvironmentSetup() {
  console.log('🔧 Environment Setup:');
  console.log('====================\n');

  console.log('Railway Environment Variables:');
  console.log('DATABASE_URL=postgresql://username:password@host:port/database');
  console.log('VECTOR_DB=postgresql');
  console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****');
  console.log('CLERK_SECRET_KEY=sk_test_****');
  console.log('OPENAI_API_KEY=sk-****');
  console.log('UPSTASH_REDIS_REST_URL=https://****');
  console.log('UPSTASH_REDIS_REST_TOKEN=AZ****\n');

  console.log('Vercel Environment Variables:');
  console.log(`NEXT_PUBLIC_RAILWAY_API_URL=${domains.railway}`);
  console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****');
  console.log('NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in');
  console.log('NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up');
  console.log('NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/');
  console.log('NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/\n');
}

function showCommands() {
  console.log('🛠️  Useful Commands:');
  console.log('===================\n');

  console.log('Railway CLI:');
  console.log('npm install -g @railway/cli');
  console.log('railway login');
  console.log('railway status');
  console.log('railway logs');
  console.log('railway up\n');

  console.log('Vercel CLI:');
  console.log('npm install -g vercel');
  console.log('vercel login');
  console.log('vercel ls');
  console.log('vercel domains ls\n');

  console.log('Health Checks:');
  console.log(`curl ${domains.railway}/api/health`);
  console.log(`curl ${domains.railway}/api/test`);
  console.log(`curl ${domains.railway}/api/startup`);
  console.log(`curl ${domains.vercel1}/`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    await testAllDomains();
  } else if (args.includes('--recommendations')) {
    showRecommendations();
  } else if (args.includes('--env')) {
    showEnvironmentSetup();
  } else if (args.includes('--commands')) {
    showCommands();
  } else {
    console.log('Usage:');
    console.log('  npm run domains:test      - Test all domains');
    console.log('  npm run domains:recommend - Show recommendations');
    console.log('  npm run domains:env       - Show environment setup');
    console.log('  npm run domains:commands  - Show useful commands');
    console.log('  npm run domains           - Show this help\n');
    
    showRecommendations();
  }
}

main().catch(console.error); 