import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    openaiConfigured: !!(OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10),
    keyLength: OPENAI_API_KEY ? OPENAI_API_KEY.length : 0,
    keyPreview: OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'Not set',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    // Simple test prompt
    const testPrompt = 'Create a black and white line art coloring book page of a simple cat. Style: simple line drawing, thick black outlines, no shading, no color, clean white background, kid-friendly.';
    
    console.log('Testing DALL-E 3 with prompt:', testPrompt);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: testPrompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DALL-E 3 test error:', response.status, errorData);
      return NextResponse.json({ 
        error: 'DALL-E 3 test failed',
        status: response.status,
        details: errorData
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('DALL-E 3 test success:', !!data.data?.[0]?.url);
    
    return NextResponse.json({
      success: true,
      imageUrl: data.data?.[0]?.url,
      message: 'DALL-E 3 is working correctly!'
    });

  } catch (error) {
    console.error('DALL-E 3 test error:', error);
    return NextResponse.json({ 
      error: 'DALL-E 3 test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
