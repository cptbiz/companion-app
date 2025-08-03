#!/usr/bin/env node

console.log('🚀 Railway Environment Setup for Companion App');
console.log('=============================================\n');

console.log('📋 Required Environment Variables for Railway:');
console.log('');

console.log('1. DATABASE_URL (from Railway PostgreSQL service)');
console.log('   - Add PostgreSQL service in Railway Dashboard');
console.log('   - Copy the DATABASE_URL from the PostgreSQL service');
console.log('');

console.log('2. Clerk Authentication:');
console.log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
console.log('   - CLERK_SECRET_KEY');
console.log('   - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in');
console.log('   - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up');
console.log('   - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/');
console.log('   - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/');
console.log('');

console.log('3. OpenAI API:');
console.log('   - OPENAI_API_KEY');
console.log('');

console.log('4. Vector Database:');
console.log('   - VECTOR_DB=postgresql (use PostgreSQL with pgvector)');
console.log('');

console.log('5. Redis (Upstash):');
console.log('   - UPSTASH_REDIS_REST_URL');
console.log('   - UPSTASH_REDIS_REST_TOKEN');
console.log('');

console.log('6. Railway API URL:');
console.log('   - NEXT_PUBLIC_RAILWAY_API_URL=https://companion-app-production-0cc9.up.railway.app');
console.log('');

console.log('7. Additional Services (optional):');
console.log('   - REPLICATE_API_TOKEN');
console.log('   - TWILIO_ACCOUNT_SID');
console.log('   - TWILIO_AUTH_TOKEN');
console.log('');

console.log('🔧 Setup Steps:');
console.log('1. Add PostgreSQL service in Railway Dashboard');
console.log('2. Copy DATABASE_URL from PostgreSQL service');
console.log('3. Set VECTOR_DB=postgresql');
console.log('4. Add all environment variables to your Railway service');
console.log('5. Deploy your application');
console.log('');

console.log('⚠️  Important Notes:');
console.log('- Remove all Supabase-related environment variables');
console.log('- Use only DATABASE_URL for both regular DB and vector storage');
console.log('- The app will automatically set up pgvector extension');
console.log('- Make sure your PostgreSQL service supports pgvector extension');
console.log('- Use the correct Railway URL: https://companion-app-production-0cc9.up.railway.app');
console.log('');

console.log('📞 Support:');
console.log('- Railway Docs: https://docs.railway.app');
console.log('- Clerk Docs: https://clerk.com/docs');
console.log('- pgvector Docs: https://github.com/pgvector/pgvector');
console.log('');

console.log('🎯 Your Railway App URL:');
console.log('https://companion-app-production-0cc9.up.railway.app');
console.log('');

console.log('🧪 Test URLs:');
console.log('- Health Check: https://companion-app-production-0cc9.up.railway.app/api/health');
console.log('- Test API: https://companion-app-production-0cc9.up.railway.app/api/test');
console.log('- Startup Check: https://companion-app-production-0cc9.up.railway.app/api/startup'); 