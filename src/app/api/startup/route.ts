import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Basic startup check - no external dependencies
    return NextResponse.json({
      status: 'startup_ready',
      message: 'Application is ready to start',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '3000'
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