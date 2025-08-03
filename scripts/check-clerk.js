#!/usr/bin/env node

console.log('🔐 Clerk Configuration Checker');
console.log('=====================================');
console.log('');

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CLERK_JWKS_URL'
];

console.log('📋 Environment Variables Check:');
console.log('');

let allGood = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allGood = false;
  }
});

console.log('');

// Check JWKS URL
const jwksUrl = process.env.CLERK_JWKS_URL;
if (jwksUrl) {
  console.log('🔍 JWKS URL Check:');
  console.log(`   URL: ${jwksUrl}`);
  
  // Test JWKS endpoint
  const https = require('https');
  const url = require('url');
  
  const parsedUrl = url.parse(jwksUrl);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.path,
    method: 'GET'
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const jwks = JSON.parse(data);
        console.log(`✅ JWKS endpoint accessible (${res.statusCode})`);
        console.log(`   Keys available: ${jwks.keys ? jwks.keys.length : 0}`);
      } catch (error) {
        console.log(`❌ JWKS endpoint returned invalid JSON`);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ JWKS endpoint error: ${error.message}`);
  });
  
  req.end();
} else {
  console.log('❌ CLERK_JWKS_URL not set');
  allGood = false;
}

console.log('');

// Check Railway URL
const railwayUrl = process.env.NEXT_PUBLIC_RAILWAY_API_URL;
if (railwayUrl) {
  console.log('🚂 Railway URL Check:');
  console.log(`   URL: ${railwayUrl}`);
  
  // Test Railway health endpoint
  const https = require('https');
  const url = require('url');
  
  const healthUrl = `${railwayUrl}/api/health`;
  const parsedUrl = url.parse(healthUrl);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.path,
    method: 'GET'
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const health = JSON.parse(data);
        console.log(`✅ Railway health check: ${health.status}`);
        if (health.missing && health.missing.length > 0) {
          console.log(`   Missing variables: ${health.missing.join(', ')}`);
        }
      } catch (error) {
        console.log(`❌ Railway health check failed: ${error.message}`);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ Railway health check error: ${error.message}`);
  });
  
  req.end();
} else {
  console.log('❌ NEXT_PUBLIC_RAILWAY_API_URL not set');
  allGood = false;
}

console.log('');

// Summary
if (allGood) {
  console.log('✅ All Clerk configuration checks passed!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Add your real Clerk keys to Railway Variables');
  console.log('   2. Add your domains to Clerk Dashboard');
  console.log('   3. Test authentication flow');
} else {
  console.log('❌ Some Clerk configuration issues found');
  console.log('');
  console.log('🔧 Fix these issues:');
  console.log('   1. Set missing environment variables');
  console.log('   2. Check JWKS URL accessibility');
  console.log('   3. Verify Railway deployment');
}

console.log('');
console.log('📚 For more help, see: CLERK_SETUP.md'); 