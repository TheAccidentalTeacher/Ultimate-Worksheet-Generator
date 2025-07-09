import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { prompt } = await req.json();
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        timing: `${Date.now() - startTime}ms`
      });
    }

    console.log('Testing optimized DALL-E with prompt:', prompt);
    
    // Optimized prompt for faster generation
    const lineArtPrompt = `Black and white coloring page: ${prompt}. Simple line art, thick black outlines, no shading, no color, white background, coloring book style.`;
    
    // Add timeout control
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: lineArtPrompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      }),
    });

    clearTimeout(timeoutId);
    
    const fetchTime = Date.now() - startTime;
    console.log(`DALL-E fetch completed in ${fetchTime}ms`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse error response' } }));
      console.error('DALL-E 3 API error:', response.status, errorData);
      return NextResponse.json({ 
        error: `DALL-E 3 API error: ${response.status}`,
        details: errorData,
        timing: `${Date.now() - startTime}ms`
      });
    }

    const data = await response.json();
    const totalTime = Date.now() - startTime;
    
    console.log(`DALL-E total time: ${totalTime}ms`);
    
    if (data.data && data.data[0] && data.data[0].url) {
      return NextResponse.json({ 
        success: true,
        imageUrl: data.data[0].url,
        timing: `${totalTime}ms`,
        prompt: lineArtPrompt.substring(0, 100) + '...'
      });
    }
    
    return NextResponse.json({ 
      error: 'No image URL in DALL-E 3 response',
      timing: `${totalTime}ms`,
      responseData: data
    });
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('DALL-E 3 request aborted due to timeout');
      return NextResponse.json({ 
        error: 'DALL-E 3 request timed out',
        timing: `${totalTime}ms (timeout)`
      });
    }
    
    console.error('DALL-E 3 test error:', error);
    return NextResponse.json({ 
      error: 'DALL-E 3 test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timing: `${totalTime}ms`
    });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'DALL-E 3 optimized test endpoint',
    method: 'POST',
    body: { prompt: 'your prompt here' }
  });
}
