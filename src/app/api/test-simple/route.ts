import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ 
      message: "Simple test working!",
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 10)}...` : 'Not set'
      }
    });
  } catch (error) {
    console.error('Simple test error:', error);
    return NextResponse.json({ 
      error: 'Error in simple test',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: "POST test working!",
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Simple POST test error:', error);
    return NextResponse.json({ 
      error: 'Error in simple POST test',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
