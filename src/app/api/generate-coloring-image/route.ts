import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { prompt, preferDalle = false, subject, grade, worksheetType } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    console.log('Image generation request for prompt:', prompt);
    console.log('Subject:', subject, 'Grade:', grade, 'Type:', worksheetType);
    console.log('DALL-E preferred:', preferDalle);
    console.log('OPENAI_API_KEY available:', !!OPENAI_API_KEY);
    console.log('UNSPLASH_ACCESS_KEY available:', !!UNSPLASH_ACCESS_KEY);
    console.log('PIXABAY_API_KEY available:', !!PIXABAY_API_KEY);
    console.log('REPLICATE_API_TOKEN available:', !!REPLICATE_API_TOKEN);

    // Generate enhanced coloring page prompt using GPT-4
    let enhancedPrompt = prompt;
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10) {
      try {
        console.log('Enhancing prompt with GPT-4 for coloring page generation...');
        enhancedPrompt = await generateColoringPagePrompt(prompt, subject, grade, worksheetType);
        console.log('Enhanced prompt:', enhancedPrompt.substring(0, 200) + '...');
      } catch (error) {
        console.error('Prompt enhancement failed, using original:', error);
        enhancedPrompt = prompt;
      }
    }

    // If DALL-E is specifically requested, try it first
    if (preferDalle && OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10) {
      console.log('Attempting DALL-E 3 image generation (preferred)...');
      try {
        // Reduced timeout for serverless environment (Netlify Functions have 10s limit on hobby plan)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('DALL-E timeout after 8 seconds')), 8000)
        );
        
        const dallePromise = generateDallE3Image(enhancedPrompt);
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

    // Try Stable Diffusion via Replicate for high-quality coloring pages
    if (REPLICATE_API_TOKEN && REPLICATE_API_TOKEN !== 'your_replicate_api_token_here' && REPLICATE_API_TOKEN.length > 10) {
      console.log('Attempting Stable Diffusion via Replicate for coloring pages...');
      try {
        const imageUrl = await generateStableDiffusionColoringPage(enhancedPrompt);
        if (imageUrl) {
          console.log('Stable Diffusion success:', imageUrl);
          return NextResponse.json({ imageUrl, source: 'stable-diffusion' });
        }
      } catch (error) {
        console.error('Stable Diffusion failed:', error);
      }
    } else {
      console.log('Skipping Stable Diffusion - API token not configured properly');
    }

    // Try Pixabay for line art/coloring pages
    if (PIXABAY_API_KEY && PIXABAY_API_KEY !== 'your-pixabay-api-key-here' && PIXABAY_API_KEY.length > 10) {
      console.log('Attempting Pixabay for coloring page images...');
      try {
        const imageUrl = await getPixabayColoringPage(enhancedPrompt);
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
      const imageUrl = await getOpenClipartImage(enhancedPrompt);
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
      const imageUrl = await getWikimediaLineArt(enhancedPrompt);
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
        
        const dallePromise = generateDallE3Image(enhancedPrompt);
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
      const svgUrl = await generateSimpleSVGColoringPage(enhancedPrompt);
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
  try {
    console.log('Sending DALL-E 3 request with enhanced prompt:', prompt.substring(0, 100) + '...');
    
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
        quality: 'hd', // Use HD quality for better line art
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

async function generateStableDiffusionColoringPage(prompt: string): Promise<string | null> {
  try {
    console.log('Generating Stable Diffusion coloring page for prompt:', prompt);
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4', // Stable Diffusion XL
        input: {
          prompt: prompt,
          negative_prompt: 'color, colored, shading, shadows, gradients, complex details, photorealistic, blurry, low quality, gray tones, textures, realistic, photograph, painted, filled areas, detailed shading, watercolor, pencil sketching, thin lines, fine details, small elements, cluttered, busy background, text, words, signatures',
          width: 1152, // Larger for better print quality
          height: 1152, // Square format works well for worksheets
          num_inference_steps: 30, // More steps for better quality
          guidance_scale: 15, // Higher guidance for better adherence to prompt
          scheduler: 'DPMSolverMultistep'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Replicate API error:', response.status, errorText);
      throw new Error(`Replicate API error: ${response.status}`);
    }

    const prediction = await response.json();
    console.log('Stable Diffusion prediction created:', prediction.id);

    // Poll for completion (with timeout)
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max
    
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        }
      });
      
      if (statusResponse.ok) {
        const updatedPrediction = await statusResponse.json();
        Object.assign(prediction, updatedPrediction);
        console.log('Stable Diffusion status:', prediction.status);
      }
      
      attempts++;
    }

    if (prediction.status === 'succeeded' && prediction.output && prediction.output.length > 0) {
      const imageUrl = prediction.output[0];
      console.log('Stable Diffusion completed successfully:', imageUrl);
      return imageUrl;
    } else {
      console.error('Stable Diffusion failed or timed out:', prediction.status, prediction.error);
      return null;
    }

  } catch (error) {
    console.error('Stable Diffusion generation error:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function generateColoringPagePrompt(originalPrompt: string, subject?: string, grade?: string, worksheetType?: string): Promise<string> {
  try {
    console.log('Enhancing prompt with GPT-4...');
    
    const systemPrompt = `You are an expert at creating detailed, specific prompts for AI image generation that produce perfect black and white coloring pages for children. Your task is to transform a simple prompt into a highly detailed, technical prompt that will generate clean line art suitable for coloring.

CRITICAL REQUIREMENTS for coloring pages:
- MUST be black ink outlines only on pure white background
- NO color, NO shading, NO gradients, NO gray tones
- Thick, bold black lines (3-5px width)
- Simple, clear shapes appropriate for children to color
- Age-appropriate content and complexity
- Large, well-defined areas for coloring
- No tiny details that are hard to color

Context information:
- Subject: ${subject || 'General'}
- Grade Level: ${grade || 'Elementary'}
- Worksheet Type: ${worksheetType || 'Coloring Page'}

Transform the user's prompt into a detailed technical prompt that emphasizes these requirements.`;

    const userMessage = `Original prompt: "${originalPrompt}"

Please create a detailed, technical prompt for generating a perfect black and white coloring page. Include specific technical requirements about line weight, contrast, and style. Make sure the prompt is optimized for AI image generation tools like DALL-E and Stable Diffusion.

Example format:
"Black and white coloring page of [subject]. TECHNICAL REQUIREMENTS: Thick black ink outlines only, 4-5px line weight, pure white background (#FFFFFF), no shading, no color, no gradients, no gray tones, simple clean line art, bold contrasting lines, large coloring areas, child-friendly design, printable quality, high contrast black (#000000) on white, suitable for crayons and markers, [age-appropriate details for ${grade || 'elementary'} level]."`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.3, // Lower temperature for more consistent, technical prompts
      }),
    });

    if (!response.ok) {
      throw new Error(`GPT-4 API error: ${response.status}`);
    }

    const data = await response.json();
    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();
    
    if (!enhancedPrompt) {
      throw new Error('No enhanced prompt generated');
    }
    
    console.log('GPT-4 enhanced prompt created successfully');
    return enhancedPrompt;
    
  } catch (error) {
    console.error('GPT-4 prompt enhancement failed:', error);
    // Fallback to a manually enhanced prompt
    return `Black and white coloring page of ${originalPrompt}. TECHNICAL REQUIREMENTS: Thick black ink outlines only, 4-5px line weight, pure white background (#FFFFFF), no shading, no color, no gradients, no gray tones, simple clean line art, bold contrasting lines, large coloring areas, child-friendly design, printable quality, high contrast black (#000000) on white, suitable for crayons and markers, ${grade || 'elementary'} grade appropriate.`;
  }
}
