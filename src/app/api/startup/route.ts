import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const serverUrl = isProduction 
      ? 'https://companion-app-production-0cc9.up.railway.app'
      : `http://localhost:${process.env.PORT || 3000}`;
    
    // Basic startup check - no external dependencies
    return NextResponse.json({
      status: 'startup_ready',
      message: 'Application is ready to start',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '3000',
      serverUrl: serverUrl,
      platform: isProduction ? 'Railway Production' : 'Local Development'
    });
  } catch (error) {
    console.error('Startup check error:', error);
    return NextResponse.json({
      status: 'startup_error',
      message: 'Startup check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 