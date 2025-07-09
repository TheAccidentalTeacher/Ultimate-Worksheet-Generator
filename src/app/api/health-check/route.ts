import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    openaiConfigured: !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10)
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'POST request received',
    status: 'success'
  });
}
