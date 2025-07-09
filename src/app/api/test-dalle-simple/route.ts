import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' });
    }

    console.log('Testing DALL-E with prompt:', prompt);
    
    // Very simple DALL-E call without timeouts
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      }),
    });

    console.log('DALL-E response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('DALL-E error:', errorData);
      return NextResponse.json({ 
        error: 'DALL-E API error', 
        details: errorData,
        status: response.status 
      });
    }

    const data = await response.json();
    console.log('DALL-E success, URL length:', data.data?.[0]?.url?.length || 0);
    
    return NextResponse.json({
      success: true,
      imageUrl: data.data?.[0]?.url,
      revisedPrompt: data.data?.[0]?.revised_prompt
    });
  } catch (error) {
    console.error('DALL-E test error:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
