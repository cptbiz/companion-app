import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Check if required environment variables are set
    const requiredEnvVars = [
      'DATABASE_URL',
      'OPENAI_API_KEY',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        status: 'warning',
        message: 'Some environment variables are missing',
        missing: missingVars,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }, { status: 200 });
    }

    return NextResponse.json({
      status: 'healthy',
      message: 'All environment variables are set',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 