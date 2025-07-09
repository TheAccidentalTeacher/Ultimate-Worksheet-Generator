import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    // Skip DALL-E 3 for now to test Unsplash
    console.log('Skipping DALL-E 3 for debugging');

    // Try Unsplash fallback
    if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'your-unsplash-access-key-here' && UNSPLASH_ACCESS_KEY.length > 10) {
      try {
        const imageUrl = await getUnsplashImage(prompt);
        if (imageUrl) {
          return NextResponse.json({ imageUrl, source: 'unsplash' });
        }
      } catch (error) {
        console.error('Unsplash failed:', error);
      }
    }

    return NextResponse.json({ 
      error: 'Image generation services unavailable. Please configure API keys.'
    }, { status: 500 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getUnsplashImage(prompt: string): Promise<string | null> {
  try {
    const searchQuery = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    console.log('Calling Unsplash API...');
    const response = await fetch(url);
    console.log('Unsplash response status:', response.status);
    
    if (!response.ok) {
      console.error('Unsplash API error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('Unsplash data received, results:', data.results?.length || 0);
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0]?.urls?.regular;
      console.log('Selected image URL:', imageUrl);
      return imageUrl;
    }
    
    console.log('No results found');
    return null;
  } catch (error) {
    console.error('Unsplash function error:', error);
    return null;
  }
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
    throw new Error(`DALL-E 3 API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.data && data.data[0] && data.data[0].url) {
    return data.data[0].url;
  }
  
  return null;
}
