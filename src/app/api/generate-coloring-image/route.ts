import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt, preferDalle = false } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    console.log('Image generation request for prompt:', prompt);
    console.log('DALL-E preferred:', preferDalle);
    console.log('OPENAI_API_KEY available:', !!OPENAI_API_KEY);
    console.log('UNSPLASH_ACCESS_KEY available:', !!UNSPLASH_ACCESS_KEY);
    console.log('PIXABAY_API_KEY available:', !!PIXABAY_API_KEY);
    console.log('PIXABAY_API_KEY available:', !!PIXABAY_API_KEY);

    // If DALL-E is specifically requested, try it first
    if (preferDalle && OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10) {
      console.log('Attempting DALL-E 3 image generation (preferred)...');
      try {
        // More reasonable timeout for DALL-E 3 - it needs time to generate quality images
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('DALL-E timeout after 30 seconds')), 30000)
        );
        
        const dallePromise = generateDallE3Image(prompt);
        const imageUrl = await Promise.race([dallePromise, timeoutPromise]);
        
        if (imageUrl) {
          console.log('DALL-E 3 success:', imageUrl);
          return NextResponse.json({ imageUrl, source: 'dall-e-3' });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown DALL-E error';
        console.error('DALL-E 3 failed:', errorMessage);
        // Continue to fallback with logged error details
      }
    }

    // Primary: Use Unsplash for reliable, fast images
    if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'your-unsplash-access-key-here' && UNSPLASH_ACCESS_KEY.length > 10) {
      console.log('Attempting Unsplash image search (primary)...');
      try {
        const imageUrl = await getUnsplashImage(prompt);
        if (imageUrl) {
          console.log('Unsplash success:', imageUrl);
          return NextResponse.json({ imageUrl, source: 'unsplash' });
        }
      } catch (error) {
        console.error('Unsplash failed:', error);
      }
    } else {
      console.log('Skipping Unsplash - access key not configured properly');
    }

    // If DALL-E wasn't preferred but Unsplash failed, try DALL-E as fallback
    if (!preferDalle && OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10) {
      console.log('Attempting DALL-E 3 as fallback...');
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('DALL-E fallback timeout after 30 seconds')), 30000)
        );
        
        const dallePromise = generateDallE3Image(prompt);
        const imageUrl = await Promise.race([dallePromise, timeoutPromise]);
        
        if (imageUrl) {
          console.log('DALL-E 3 fallback success:', imageUrl);
          return NextResponse.json({ imageUrl, source: 'dall-e-3-fallback' });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown DALL-E error';
        console.error('DALL-E 3 fallback failed:', errorMessage);
      }
    }

    // As a last resort, use Pixabay if configured
    if (PIXABAY_API_KEY && PIXABAY_API_KEY !== 'your-pixabay-api-key-here' && PIXABAY_API_KEY.length > 10) {
      console.log('Attempting Pixabay image search (fallback)...');
      try {
        const imageUrl = await getPixabayImage(prompt);
        if (imageUrl) {
          console.log('Pixabay success:', imageUrl);
          return NextResponse.json({ imageUrl, source: 'pixabay' });
        }
      } catch (error) {
        console.error('Pixabay failed:', error);
      }
    } else {
      console.log('Skipping Pixabay - access key not configured properly');
    }

    console.error('All image generation services failed or unavailable');
    return NextResponse.json({ 
      error: 'Image generation services unavailable. Please configure API keys.',
      debug: {
        openaiConfigured: !!(OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10),
        unsplashConfigured: !!(UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'your-unsplash-access-key-here' && UNSPLASH_ACCESS_KEY.length > 10),
        pixabayConfigured: !!(PIXABAY_API_KEY && PIXABAY_API_KEY !== 'your-pixabay-api-key-here' && PIXABAY_API_KEY.length > 10)
      }
    }, { status: 500 });
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getUnsplashImage(prompt: string): Promise<string | null> {
  const searchQuery = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
  
  console.log('Unsplash search query:', searchQuery);
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('Unsplash API error:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('Unsplash error details:', errorText);
    return null;
  }
  
  const data = await response.json();
  console.log('Unsplash response:', data.total, 'results found');
  
  if (data.results && data.results.length > 0) {
    const imageUrl = data.results[0]?.urls?.regular;
    console.log('Selected Unsplash image:', imageUrl);
    return imageUrl;
  }
  
  return null;
}

async function generateDallE3Image(prompt: string): Promise<string | null> {
  // Optimize the prompt for better line art results
  const lineArtPrompt = `Black and white coloring page: ${prompt}. Simple line art with thick black outlines, no shading, no color, white background, suitable for coloring book.`;

  try {
    console.log('Sending optimized DALL-E 3 request with prompt:', lineArtPrompt.substring(0, 100) + '...');
    
    // Remove the fetch timeout to let DALL-E take the time it needs
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
      const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse error response' } }));
      console.error('DALL-E 3 API error:', response.status, errorData);
      throw new Error(`DALL-E 3 API error: ${response.status} ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('DALL-E 3 response received:', !!data.data?.[0]?.url);
    
    if (data.data && data.data[0] && data.data[0].url) {
      return data.data[0].url;
    }
    
    throw new Error('No image URL in DALL-E 3 response');
  } catch (error) {
    console.error('DALL-E 3 generation error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

async function getPixabayImage(prompt: string): Promise<string | null> {
  // Search for line art or illustration style images
  const searchQuery = `${prompt} line art illustration drawing`.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=illustration&category=backgrounds&per_page=3&safesearch=true`;
  
  console.log('Pixabay search query:', searchQuery);
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('Pixabay API error:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('Pixabay error details:', errorText);
    return null;
  }
  
  const data = await response.json();
  console.log('Pixabay response:', data.total, 'results found');
  
  if (data.hits && data.hits.length > 0) {
    // Prefer line art/simple illustrations
    const lineArtImage = data.hits.find((hit: any) => 
      hit.tags.toLowerCase().includes('line') || 
      hit.tags.toLowerCase().includes('drawing') ||
      hit.tags.toLowerCase().includes('outline')
    );
    
    const selectedImage = lineArtImage || data.hits[0];
    const imageUrl = selectedImage?.webformatURL;
    console.log('Selected Pixabay image:', imageUrl);
    return imageUrl;
  }
  
  return null;
}
