import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const debugInfo: any = {
      prompt,
      openaiConfigured: !!(OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10),
      unsplashConfigured: !!(UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'your-unsplash-access-key-here' && UNSPLASH_ACCESS_KEY.length > 10),
      openaiKeyLength: OPENAI_API_KEY?.length || 0,
      unsplashKeyLength: UNSPLASH_ACCESS_KEY?.length || 0,
      steps: []
    };

    // Try DALL-E 3 first if OpenAI API key is available
    if (debugInfo.openaiConfigured) {
      debugInfo.steps.push('Attempting DALL-E 3...');
      try {
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('DALL-E timeout after 15 seconds')), 15000)
        );
        
        const dallePromise = generateDallE3Image(prompt);
        const imageUrl = await Promise.race([dallePromise, timeoutPromise]);
        
        if (imageUrl) {
          debugInfo.steps.push('DALL-E 3 success!');
          return NextResponse.json({ imageUrl, source: 'dall-e-3', debug: debugInfo });
        }
      } catch (error) {
        debugInfo.steps.push(`DALL-E 3 failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      debugInfo.steps.push('Skipping DALL-E 3 - not configured');
    }

    // Try Unsplash fallback
    if (debugInfo.unsplashConfigured) {
      debugInfo.steps.push('Attempting Unsplash...');
      try {
        const imageUrl = await getUnsplashImage(prompt);
        if (imageUrl) {
          debugInfo.steps.push('Unsplash success!');
          return NextResponse.json({ imageUrl, source: 'unsplash', debug: debugInfo });
        } else {
          debugInfo.steps.push('Unsplash returned no results');
        }
      } catch (error) {
        debugInfo.steps.push(`Unsplash failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      debugInfo.steps.push('Skipping Unsplash - not configured');
    }

    debugInfo.steps.push('All services failed');
    return NextResponse.json({ 
      error: 'Image generation services unavailable.',
      debug: debugInfo
    }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getUnsplashImage(prompt: string): Promise<string | null> {
  const searchQuery = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unsplash API ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  
  if (data.results && data.results.length > 0) {
    return data.results[0]?.urls?.regular;
  }
  
  return null;
}

async function generateDallE3Image(prompt: string): Promise<string | null> {
  const lineArtPrompt = `Create a black and white line art coloring book page of: ${prompt}. Style: simple line drawing, thick black outlines, no shading, no color, no background, clean white background, kid-friendly, suitable for children to color, vector-style illustration, clear defined shapes, minimal detail, high contrast.`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: lineArtPrompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`DALL-E 3 API ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  
  if (data.data && data.data[0] && data.data[0].url) {
    return data.data[0].url;
  }
  
  throw new Error('No image URL in DALL-E 3 response');
}
