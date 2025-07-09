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

    // If DALL-E is specifically requested, try it first
    if (preferDalle && OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10) {
      console.log('Attempting DALL-E 3 image generation (preferred)...');
      try {
        // Reduced timeout for serverless environment (Netlify Functions have 10s limit on hobby plan)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('DALL-E timeout after 8 seconds')), 8000)
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

    // Try Pixabay for line art/coloring pages first
    if (PIXABAY_API_KEY && PIXABAY_API_KEY !== 'your-pixabay-api-key-here' && PIXABAY_API_KEY.length > 10) {
      console.log('Attempting Pixabay for coloring page images...');
      try {
        const imageUrl = await getPixabayColoringPage(prompt);
        if (imageUrl) {
          console.log('Pixabay coloring page success:', imageUrl);
          return NextResponse.json({ imageUrl, source: 'pixabay-coloring' });
        }
      } catch (error) {
        console.error('Pixabay coloring page search failed:', error);
      }
    }

    // Try OpenClipart for line art
    console.log('Attempting OpenClipart for vector line art...');
    try {
      const imageUrl = await getOpenClipartImage(prompt);
      if (imageUrl) {
        console.log('OpenClipart success:', imageUrl);
        return NextResponse.json({ imageUrl, source: 'openclipart' });
      }
    } catch (error) {
      console.error('OpenClipart failed:', error);
    }

    // Try Wikimedia Commons for line art
    console.log('Attempting Wikimedia Commons for line drawings...');
    try {
      const imageUrl = await getWikimediaLineArt(prompt);
      if (imageUrl) {
        console.log('Wikimedia line art success:', imageUrl);
        return NextResponse.json({ imageUrl, source: 'wikimedia-lineart' });
      }
    } catch (error) {
      console.error('Wikimedia line art failed:', error);
    }

    // If DALL-E wasn't preferred but Unsplash failed, try DALL-E as fallback
    if (!preferDalle && OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10) {
      console.log('Attempting DALL-E 3 as fallback...');
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('DALL-E fallback timeout after 8 seconds')), 8000)
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

    // Generate a simple SVG coloring page as last resort
    console.log('Generating simple SVG coloring page as final fallback...');
    try {
      const svgUrl = await generateSimpleSVGColoringPage(prompt);
      if (svgUrl) {
        console.log('Simple SVG coloring page generated:', svgUrl);
        return NextResponse.json({ imageUrl: svgUrl, source: 'svg-generated' });
      }
    } catch (error) {
      console.error('SVG generation failed:', error);
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

async function getPixabayColoringPage(prompt: string): Promise<string | null> {
  // Search specifically for coloring page, line art, and black and white images
  const coloringTerms = ['coloring page', 'line art', 'outline', 'black white drawing', 'sketch'];
  const searchQuery = `${prompt} ${coloringTerms.join(' OR ')}`
    .replace(/[^a-zA-Z0-9\s]/g, '').trim();
  
  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=vector&category=backgrounds&per_page=10&safesearch=true&colors=black_white`;
  
  console.log('Pixabay coloring page search query:', searchQuery);
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('Pixabay API error:', response.status, response.statusText);
    return null;
  }
  
  const data = await response.json();
  console.log('Pixabay coloring page response:', data.total, 'results found');
  
  if (data.hits && data.hits.length > 0) {
    // Prefer images with coloring-related keywords
    const coloringImage = data.hits.find((hit: any) => {
      const tags = hit.tags.toLowerCase();
      return tags.includes('line') || tags.includes('outline') || 
             tags.includes('coloring') || tags.includes('black') ||
             tags.includes('drawing') || tags.includes('sketch');
    });
    
    const selectedImage = coloringImage || data.hits[0];
    const imageUrl = selectedImage?.webformatURL;
    console.log('Selected Pixabay coloring image:', imageUrl);
    return imageUrl;
  }
  
  return null;
}

async function getOpenClipartImage(prompt: string): Promise<string | null> {
  // OpenClipart provides free vector line art perfect for coloring
  const searchQuery = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const url = `https://openclipart.org/search/json/?query=${encodeURIComponent(searchQuery)}&amount=10&page=1`;
  
  console.log('OpenClipart search query:', searchQuery);
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('OpenClipart API error:', response.status, response.statusText);
    return null;
  }
  
  const data = await response.json();
  console.log('OpenClipart response:', data.info?.results || 0, 'results found');
  
  if (data.payload && data.payload.length > 0) {
    // Get a random result for variety
    const randomIndex = Math.floor(Math.random() * Math.min(data.payload.length, 5));
    const selectedImage = data.payload[randomIndex];
    
    // OpenClipart provides SVG which is perfect for line art
    const imageUrl = selectedImage?.svg?.png_full_lossy || selectedImage?.svg?.url;
    console.log('Selected OpenClipart image:', imageUrl);
    return imageUrl;
  }
  
  return null;
}

async function getWikimediaLineArt(prompt: string): Promise<string | null> {
  // Search Wikimedia Commons for line drawings and illustrations
  const searchQuery = `${prompt} line drawing illustration`.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(searchQuery)}&srnamespace=6&srlimit=10&origin=*`;
  
  console.log('Wikimedia line art search query:', searchQuery);
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error('Wikimedia API error:', response.status, response.statusText);
    return null;
  }
  
  const data = await response.json();
  console.log('Wikimedia response:', data.query?.search?.length || 0, 'results found');
  
  if (data.query?.search && data.query.search.length > 0) {
    // Filter for likely line art files
    const lineArtFiles = data.query.search.filter((file: any) => {
      const title = file.title.toLowerCase();
      return title.includes('.svg') || title.includes('line') || 
             title.includes('drawing') || title.includes('illustration') ||
             title.includes('outline');
    });
    
    if (lineArtFiles.length > 0) {
      const selectedFile = lineArtFiles[0];
      const filename = selectedFile.title.replace('File:', '');
      const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=800`;
      console.log('Selected Wikimedia line art:', imageUrl);
      return imageUrl;
    }
  }
  
  return null;
}

async function generateSimpleSVGColoringPage(prompt: string): Promise<string | null> {
  // Generate a simple SVG coloring page based on the prompt
  try {
    // Create basic shapes based on common coloring page themes
    let svgContent = '';
    const width = 800;
    const height = 600;
    
    // Define some simple shapes based on the prompt
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('flower') || promptLower.includes('garden')) {
      svgContent = `
        <circle cx="400" cy="300" r="80" fill="none" stroke="black" stroke-width="3"/>
        <circle cx="400" cy="300" r="30" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="350" cy="250" rx="25" ry="40" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="450" cy="250" rx="25" ry="40" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="350" cy="350" rx="25" ry="40" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="450" cy="350" rx="25" ry="40" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="320" cy="300" rx="40" ry="25" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="480" cy="300" rx="40" ry="25" fill="none" stroke="black" stroke-width="2"/>
        <line x1="400" y1="380" x2="400" y2="500" stroke="black" stroke-width="3"/>
        <ellipse cx="380" cy="450" rx="20" ry="8" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="420" cy="470" rx="20" ry="8" fill="none" stroke="black" stroke-width="2"/>
      `;
    } else if (promptLower.includes('cat') || promptLower.includes('animal')) {
      svgContent = `
        <ellipse cx="400" cy="350" rx="100" ry="80" fill="none" stroke="black" stroke-width="3"/>
        <circle cx="400" cy="250" r="60" fill="none" stroke="black" stroke-width="3"/>
        <polygon points="350,220 370,180 390,220" fill="none" stroke="black" stroke-width="2"/>
        <polygon points="410,220 430,180 450,220" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="380" cy="240" r="8" fill="black"/>
        <circle cx="420" cy="240" r="8" fill="black"/>
        <ellipse cx="400" cy="260" rx="15" ry="10" fill="none" stroke="black" stroke-width="2"/>
        <path d="M 400 270 Q 390 280 380 275" fill="none" stroke="black" stroke-width="2"/>
        <path d="M 400 270 Q 410 280 420 275" fill="none" stroke="black" stroke-width="2"/>
        <line x1="340" y1="260" x2="280" y2="250" stroke="black" stroke-width="2"/>
        <line x1="340" y1="270" x2="280" y2="270" stroke="black" stroke-width="2"/>
        <line x1="460" y1="260" x2="520" y2="250" stroke="black" stroke-width="2"/>
        <line x1="460" y1="270" x2="520" y2="270" stroke="black" stroke-width="2"/>
      `;
    } else if (promptLower.includes('tree') || promptLower.includes('nature')) {
      svgContent = `
        <ellipse cx="400" cy="200" rx="120" ry="100" fill="none" stroke="black" stroke-width="3"/>
        <rect x="380" y="300" width="40" height="150" fill="none" stroke="black" stroke-width="3"/>
        <ellipse cx="350" cy="180" rx="60" ry="50" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="450" cy="180" rx="60" ry="50" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="400" cy="130" rx="50" ry="40" fill="none" stroke="black" stroke-width="2"/>
        <path d="M 350 350 Q 330 340 320 360" fill="none" stroke="black" stroke-width="2"/>
        <path d="M 450 350 Q 470 340 480 360" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="300" cy="500" r="20" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="500" cy="480" r="25" fill="none" stroke="black" stroke-width="2"/>
      `;
    } else {
      // Generic simple shapes for any other prompt
      svgContent = `
        <circle cx="400" cy="300" r="100" fill="none" stroke="black" stroke-width="3"/>
        <rect x="300" y="200" width="200" height="200" fill="none" stroke="black" stroke-width="3"/>
        <polygon points="400,150 350,250 450,250" fill="none" stroke="black" stroke-width="3"/>
        <ellipse cx="400" cy="450" rx="80" ry="40" fill="none" stroke="black" stroke-width="2"/>
      `;
    }
    
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      ${svgContent}
      <text x="400" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="black">Color Me: ${prompt}</text>
    </svg>`;
    
    // Convert SVG to data URL
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    console.log('Generated simple SVG coloring page');
    return svgDataUrl;
    
  } catch (error) {
    console.error('SVG generation error:', error);
    return null;
  }
}
