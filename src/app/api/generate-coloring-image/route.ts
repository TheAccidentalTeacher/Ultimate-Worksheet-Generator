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
        console.log('=== ENHANCED PROMPT ===');
        console.log(enhancedPrompt);
        console.log('=== END ENHANCED PROMPT ===');
      } catch (error) {
        console.error('Prompt enhancement failed, using fallback:', error);
        // Create a strong fallback prompt
        enhancedPrompt = `BLACK AND WHITE COLORING PAGE ONLY: ${prompt}. STRICT REQUIREMENTS: Pure black ink lines on white background, NO color, NO shading, NO gradients, NO gray, thick bold outlines only, simple line art for children to color, high contrast black and white, vector-style illustration, coloring book page.`;
        console.log('Using fallback enhanced prompt:', enhancedPrompt);
      }
    } else {
      // If no OpenAI key, use manual enhancement
      enhancedPrompt = `BLACK AND WHITE COLORING PAGE ONLY: ${prompt}. STRICT REQUIREMENTS: Pure black ink lines on white background, NO color, NO shading, NO gradients, NO gray, thick bold outlines only, simple line art for children to color, high contrast black and white, vector-style illustration, coloring book page.`;
      console.log('No GPT-4 available, using manual enhancement:', enhancedPrompt);
    }

    // TEMPORARILY DISABLE DALL-E to force Stable Diffusion testing
    if (false) {
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
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown DALL-E error';
        console.error('DALL-E 3 failed:', errorMessage);
        // Continue to fallback with logged error details
      }
    }

    // SKIP ALL AI MODELS - Go straight to guaranteed SVG generation
    console.log('Generating SVG coloring page (reliable approach)...');
    try {
      const svgUrl = await generateAdvancedSVGColoringPage(prompt);
      if (svgUrl) {
        console.log('Advanced SVG coloring page generated:', svgUrl);
        return NextResponse.json({ imageUrl: svgUrl, source: 'svg-advanced' });
      }
    } catch (error) {
      console.error('Advanced SVG generation failed:', error);
    }

    // Fallback to simple SVG
    console.log('Generating simple SVG coloring page as fallback...');
    try {
      const svgUrl = await generateSimpleSVGColoringPage(prompt);
      if (svgUrl) {
        console.log('Simple SVG coloring page generated:', svgUrl);
        return NextResponse.json({ imageUrl: svgUrl, source: 'svg-simple' });
      }
    } catch (error) {
      console.error('Simple SVG generation failed:', error);
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

async function generateAdvancedSVGColoringPage(prompt: string): Promise<string | null> {
  try {
    console.log('Generating dynamic SVG coloring page for:', prompt);
    
    const width = 1200;
    const height = 1200;
    
    // Use GPT-4 to analyze the prompt and break it down into drawable components
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' && OPENAI_API_KEY.length > 10) {
      try {
        const svgInstructions = await generateSVGInstructions(prompt);
        const svgContent = await buildSVGFromInstructions(svgInstructions);
        
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
          <rect width="100%" height="100%" fill="white"/>
          ${svgContent}
          
          <!-- Border -->
          <rect x="50" y="50" width="${width-100}" height="${height-100}" fill="none" stroke="black" stroke-width="3" rx="20"/>
          
          <!-- Title -->
          <text x="${width/2}" y="100" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="36" font-weight="bold" fill="black">
            Color Me!
          </text>
          
          <!-- Subject label -->
          <text x="${width/2}" y="${height-100}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="black">
            ${prompt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </text>
        </svg>`;
        
        const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
        console.log('Generated dynamic SVG coloring page');
        return svgDataUrl;
        
      } catch (error) {
        console.error('Dynamic SVG generation failed, falling back to template:', error);
      }
    }
    
    // Fallback to template-based generation if GPT-4 fails
    return generateTemplateSVG(prompt, width, height);
    
  } catch (error) {
    console.error('Advanced SVG generation error:', error);
    return null;
  }
}

async function generateSVGInstructions(prompt: string): Promise<any> {
  const systemPrompt = `You are an expert at breaking down any scene, story, or concept into simple geometric shapes that can be drawn as SVG elements for a children's coloring page.

Your task is to analyze the user's prompt and return a JSON object describing how to draw it using basic SVG shapes.

AVAILABLE SVG ELEMENTS:
- circle: {type: "circle", cx: number, cy: number, r: number}
- rectangle: {type: "rect", x: number, y: number, width: number, height: number}
- ellipse: {type: "ellipse", cx: number, cy: number, rx: number, ry: number}
- line: {type: "line", x1: number, y1: number, x2: number, y2: number}
- path: {type: "path", d: "path data"}
- polygon: {type: "polygon", points: "x1,y1 x2,y2 x3,y3"}
- text: {type: "text", x: number, y: number, content: string, fontSize: number}

COORDINATE SYSTEM: 0,0 is top-left, canvas is 1200x1200, leave margins of 150px on all sides.

REQUIREMENTS:
- Break ANY subject into 8-20 simple, recognizable shapes
- Use thick stroke-width (4-6px) for main elements, 2-3px for details
- All elements must have fill="none" and stroke="black"
- Focus on key identifying features that make the subject recognizable
- Make shapes large enough for children to color easily
- For abstract concepts (atoms, maps), use symbolic representations
- For objects (first aid kit), focus on distinctive shape and details
- Consider adding text labels for educational value

EXAMPLES:
- First aid kit: Rectangle with cross symbol and handle
- Map: Irregular coastline shapes with simple geographic features
- Atom: Central circle with orbital paths and electron dots
- Any vehicle: Basic chassis, wheels, distinctive features
- Any building: Basic structure with doors, windows, roof
- Any animal: Head, body, legs, distinctive features (trunk, mane, etc.)
- Any plant: Stem, leaves, flowers/fruit in simple geometric forms

Return a JSON object with this structure:
{
  "elements": [
    {type: "circle", cx: 600, cy: 400, r: 100, strokeWidth: 4, description: "main body"},
    {type: "rect", x: 550, y: 300, width: 100, height: 50, strokeWidth: 3, description: "head"}
  ],
  "sceneDescription": "brief description of what you drew"
}`;

  const userMessage = `Create SVG drawing instructions for: "${prompt}"

Break this down into simple geometric shapes that a child could recognize and color. Think about the most essential elements that would make this recognizable.

SPECIFIC GUIDANCE:
- For objects (first aid kit, tools, etc.): Focus on distinctive shape, key details, and symbols
- For geographic features (maps, etc.): Use simple coastlines, major features, basic labels
- For scientific concepts (atoms, etc.): Use symbolic representations with clear structure
- For vehicles: Basic chassis, wheels, and identifying features
- For buildings: Simple structure with doors, windows, roof
- For people/characters: Basic head, body, clothing, distinctive features
- For plants: Stem, leaves, flowers/fruit in geometric forms
- For animals: Head, body, legs, and distinctive features

Make it educational and recognizable while keeping it simple enough for coloring.`;

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
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`GPT-4 API error: ${response.status}`);
  }

  const data = await response.json();
  const instructions = data.choices?.[0]?.message?.content?.trim();
  
  if (!instructions) {
    throw new Error('No SVG instructions generated');
  }
  
  // Parse the JSON response
  try {
    const parsed = JSON.parse(instructions);
    console.log('GPT-4 SVG instructions:', parsed.sceneDescription);
    return parsed;
  } catch (parseError) {
    console.error('Failed to parse SVG instructions:', parseError);
    throw new Error('Invalid SVG instructions format');
  }
}

async function buildSVGFromInstructions(instructions: any): Promise<string> {
  const elements = instructions.elements || [];
  let svgContent = '';
  
  // Add a comment describing the scene
  if (instructions.sceneDescription) {
    svgContent += `<!-- ${instructions.sceneDescription} -->\n`;
  }
  
  for (const element of elements) {
    const strokeWidth = element.strokeWidth || 3;
    const stroke = 'black';
    const fill = 'none';
    
    switch (element.type) {
      case 'circle':
        svgContent += `<circle cx="${element.cx}" cy="${element.cy}" r="${element.r}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}"/>\n`;
        break;
        
      case 'rect':
        const rx = element.rx ? ` rx="${element.rx}"` : '';
        svgContent += `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}"${rx} stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}"/>\n`;
        break;
        
      case 'ellipse':
        svgContent += `<ellipse cx="${element.cx}" cy="${element.cy}" rx="${element.rx}" ry="${element.ry}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}"/>\n`;
        break;
        
      case 'line':
        svgContent += `<line x1="${element.x1}" y1="${element.y1}" x2="${element.x2}" y2="${element.y2}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
        break;
        
      case 'path':
        svgContent += `<path d="${element.d}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}"/>\n`;
        break;
        
      case 'polygon':
        svgContent += `<polygon points="${element.points}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}"/>\n`;
        break;
        
      case 'text':
        const fontSize = element.fontSize || 24;
        svgContent += `<text x="${element.x}" y="${element.y}" font-family="Arial, sans-serif" font-size="${fontSize}" stroke="${stroke}" stroke-width="1" fill="none">${element.content}</text>\n`;
        break;
        
      default:
        console.warn('Unknown SVG element type:', element.type);
    }
    
    // Add a comment for each element if description is provided
    if (element.description) {
      svgContent = svgContent.trimEnd() + ` <!-- ${element.description} -->\n`;
    }
  }
  
  return svgContent;
}

function generateTemplateSVG(prompt: string, width: number, height: number): string {
  const promptLower = prompt.toLowerCase();
  let svgContent = '';
  
  // Expanded template system with more categories
  if (promptLower.includes('lion') || promptLower.includes('mane')) {
    // ...existing lion code...
    svgContent = `
      <!-- Lion head and mane -->
      <circle cx="600" cy="500" r="200" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="600" cy="350" r="150" fill="none" stroke="black" stroke-width="4"/>
      <!-- Face features -->
      <ellipse cx="550" cy="320" rx="20" ry="30" fill="none" stroke="black" stroke-width="3"/>
      <ellipse cx="650" cy="320" rx="20" ry="30" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="550" cy="320" r="8" fill="black"/>
      <circle cx="650" cy="320" r="8" fill="black"/>
    `;
  } else if (promptLower.includes('first aid') || promptLower.includes('medical kit')) {
    // First aid kit
    svgContent = `
      <!-- Main kit case -->
      <rect x="400" y="300" width="400" height="300" rx="20" fill="none" stroke="black" stroke-width="5"/>
      
      <!-- Red cross symbol -->
      <rect x="570" y="350" width="60" height="200" fill="none" stroke="black" stroke-width="4"/>
      <rect x="500" y="420" width="200" height="60" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Handle -->
      <rect x="550" y="250" width="100" height="30" rx="15" fill="none" stroke="black" stroke-width="4"/>
      <line x1="580" y1="280" x2="580" y2="300" stroke="black" stroke-width="3"/>
      <line x1="620" y1="280" x2="620" y2="300" stroke="black" stroke-width="3"/>
      
      <!-- Latches -->
      <rect x="380" y="380" width="20" height="40" fill="none" stroke="black" stroke-width="3"/>
      <rect x="800" y="380" width="20" height="40" fill="none" stroke="black" stroke-width="3"/>
      <rect x="380" y="480" width="20" height="40" fill="none" stroke="black" stroke-width="3"/>
      <rect x="800" y="480" width="20" height="40" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Medical supplies inside (showing through transparent case) -->
      <rect x="450" y="350" width="40" height="80" fill="none" stroke="black" stroke-width="2"/> <!-- bandage -->
      <circle cx="750" cy="380" r="25" fill="none" stroke="black" stroke-width="2"/> <!-- bottle -->
      <rect x="720" y="500" width="60" height="20" fill="none" stroke="black" stroke-width="2"/> <!-- pills -->
    `;
  } else if (promptLower.includes('map') || promptLower.includes('geography') || promptLower.includes('crimea') || promptLower.includes('country')) {
    // Simple map template
    svgContent = `
      <!-- Map border -->
      <rect x="200" y="200" width="800" height="600" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Landmass/peninsula (general shape that can represent any region) -->
      <path d="M 300 400 Q 400 350 500 400 Q 600 380 700 420 Q 750 450 800 480 Q 820 520 800 560 Q 750 580 700 570 Q 600 590 500 580 Q 400 570 350 540 Q 300 500 300 450 Z" 
            fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Coastal features -->
      <path d="M 350 420 Q 380 400 420 420" fill="none" stroke="black" stroke-width="3"/>
      <path d="M 650 450 Q 680 430 720 450" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Cities/locations (dots) -->
      <circle cx="400" cy="450" r="8" fill="black"/>
      <circle cx="600" cy="470" r="8" fill="black"/>
      <circle cx="700" cy="500" r="8" fill="black"/>
      
      <!-- Compass rose -->
      <circle cx="850" cy="300" r="40" fill="none" stroke="black" stroke-width="3"/>
      <line x1="850" y1="260" x2="850" y2="340" stroke="black" stroke-width="3"/>
      <line x1="810" y1="300" x2="890" y2="300" stroke="black" stroke-width="3"/>
      <text x="850" y="250" text-anchor="middle" font-family="Arial" font-size="16" fill="black">N</text>
      
      <!-- Scale -->
      <line x1="250" y1="750" x2="350" y2="750" stroke="black" stroke-width="3"/>
      <text x="300" y="740" text-anchor="middle" font-family="Arial" font-size="14" fill="black">Scale</text>
      
      <!-- Water indication -->
      <path d="M 200 600 Q 250 580 300 600 Q 350 620 400 600" fill="none" stroke="black" stroke-width="2"/>
      <path d="M 200 650 Q 250 630 300 650 Q 350 670 400 650" fill="none" stroke="black" stroke-width="2"/>
    `;
  } else if (promptLower.includes('atom') || promptLower.includes('electron') || promptLower.includes('nucleus') || promptLower.includes('science')) {
    // Atomic structure
    svgContent = `
      <!-- Nucleus -->
      <circle cx="600" cy="400" r="50" fill="none" stroke="black" stroke-width="5"/>
      
      <!-- Protons and neutrons in nucleus -->
      <circle cx="580" cy="380" r="12" fill="none" stroke="black" stroke-width="2"/>
      <circle cx="620" cy="380" r="12" fill="none" stroke="black" stroke-width="2"/>
      <circle cx="580" cy="420" r="12" fill="none" stroke="black" stroke-width="2"/>
      <circle cx="620" cy="420" r="12" fill="none" stroke="black" stroke-width="2"/>
      <text x="580" y="385" text-anchor="middle" font-family="Arial" font-size="10" fill="black">P</text>
      <text x="620" y="385" text-anchor="middle" font-family="Arial" font-size="10" fill="black">N</text>
      
      <!-- Electron orbits -->
      <ellipse cx="600" cy="400" rx="150" ry="80" fill="none" stroke="black" stroke-width="3"/>
      <ellipse cx="600" cy="400" rx="200" ry="100" fill="none" stroke="black" stroke-width="3"/>
      <ellipse cx="600" cy="400" rx="250" ry="120" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Electrons -->
      <circle cx="750" cy="400" r="8" fill="black"/> <!-- electron 1 -->
      <circle cx="450" cy="400" r="8" fill="black"/> <!-- electron 2 -->
      <circle cx="650" cy="300" r="8" fill="black"/> <!-- electron 3 -->
      <circle cx="550" cy="500" r="8" fill="black"/> <!-- electron 4 -->
      <circle cx="800" cy="350" r="8" fill="black"/> <!-- electron 5 -->
      <circle cx="400" cy="450" r="8" fill="black"/> <!-- electron 6 -->
      
      <!-- Labels -->
      <text x="600" y="550" text-anchor="middle" font-family="Arial" font-size="18" fill="black">Nucleus</text>
      <text x="750" y="430" text-anchor="middle" font-family="Arial" font-size="14" fill="black">e-</text>
      <text x="450" y="430" text-anchor="middle" font-family="Arial" font-size="14" fill="black">e-</text>
    `;
  } else if (promptLower.includes('car') || promptLower.includes('vehicle') || promptLower.includes('truck')) {
    // Generic vehicle
    svgContent = `
      <!-- Main body -->
      <rect x="300" y="400" width="600" height="150" rx="20" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Cab/roof -->
      <rect x="450" y="300" width="300" height="100" rx="15" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Wheels -->
      <circle cx="400" cy="580" r="60" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="400" cy="580" r="30" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="800" cy="580" r="60" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="800" cy="580" r="30" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Windows -->
      <rect x="470" y="320" width="80" height="60" fill="none" stroke="black" stroke-width="3"/>
      <rect x="570" y="320" width="80" height="60" fill="none" stroke="black" stroke-width="3"/>
      <rect x="670" y="320" width="60" height="60" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Headlights -->
      <circle cx="320" cy="450" r="25" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="320" cy="500" r="25" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Door -->
      <line x1="600" y1="400" x2="600" y2="550" stroke="black" stroke-width="3"/>
      <circle cx="580" cy="475" r="5" fill="black"/> <!-- door handle -->
    `;
  } else if (promptLower.includes('house') || promptLower.includes('building') || promptLower.includes('home')) {
    // Simple house
    svgContent = `
      <!-- Main house structure -->
      <rect x="400" y="400" width="400" height="300" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Roof -->
      <polygon points="350,400 600,250 850,400" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Chimney -->
      <rect x="700" y="280" width="40" height="80" fill="none" stroke="black" stroke-width="3"/>
      <rect x="690" y="270" width="60" height="20" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Door -->
      <rect x="550" y="550" width="100" height="150" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="630" cy="625" r="8" fill="black"/> <!-- door knob -->
      
      <!-- Windows -->
      <rect x="450" y="480" width="80" height="80" fill="none" stroke="black" stroke-width="3"/>
      <rect x="670" y="480" width="80" height="80" fill="none" stroke="black" stroke-width="3"/>
      <line x1="490" y1="480" x2="490" y2="560" stroke="black" stroke-width="2"/>
      <line x1="450" y1="520" x2="530" y2="520" stroke="black" stroke-width="2"/>
      <line x1="710" y1="480" x2="710" y2="560" stroke="black" stroke-width="2"/>
      <line x1="670" y1="520" x2="750" y2="520" stroke="black" stroke-width="2"/>
      
      <!-- Foundation -->
      <rect x="380" y="700" width="440" height="30" fill="none" stroke="black" stroke-width="3"/>
    `;
  } else if (promptLower.includes('moses') || promptLower.includes('staff') || promptLower.includes('red sea')) {
    // Biblical scene: Moses with staff
    svgContent = `
      <!-- Moses figure -->
      <circle cx="400" cy="300" r="40" fill="none" stroke="black" stroke-width="4"/> <!-- head -->
      <rect x="370" y="340" width="60" height="120" fill="none" stroke="black" stroke-width="4"/> <!-- robe -->
      <line x1="400" y1="460" x2="400" y2="550" stroke="black" stroke-width="4"/> <!-- body -->
      <line x1="370" y1="580" x2="430" y2="580" stroke="black" stroke-width="3"/> <!-- feet -->
      
      <!-- Staff -->
      <line x1="320" y1="250" x2="320" y2="500" stroke="black" stroke-width="5"/>
      <circle cx="320" cy="240" r="15" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Parted waters -->
      <path d="M 150 400 Q 200 350 250 400 Q 300 450 350 400" fill="none" stroke="black" stroke-width="4"/>
      <path d="M 650 400 Q 700 350 750 400 Q 800 450 850 400" fill="none" stroke="black" stroke-width="4"/>
      <path d="M 150 500 Q 200 450 250 500 Q 300 550 350 500" fill="none" stroke="black" stroke-width="3"/>
      <path d="M 650 500 Q 700 450 750 500 Q 800 550 850 500" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Ground -->
      <line x1="100" y1="600" x2="1100" y2="600" stroke="black" stroke-width="3"/>
    `;
  } else if (promptLower.includes('daniel') || promptLower.includes('den')) {
    // Daniel in the lion's den
    svgContent = `
      <!-- Daniel figure -->
      <circle cx="600" cy="300" r="35" fill="none" stroke="black" stroke-width="4"/> <!-- head -->
      <rect x="575" y="335" width="50" height="100" fill="none" stroke="black" stroke-width="4"/> <!-- robe -->
      <line x1="600" y1="435" x2="600" y2="520" stroke="black" stroke-width="4"/> <!-- body -->
      
      <!-- Lions around Daniel -->
      <circle cx="300" cy="450" r="60" fill="none" stroke="black" stroke-width="3"/> <!-- lion 1 head -->
      <ellipse cx="280" cy="430" rx="15" ry="10" fill="none" stroke="black" stroke-width="2"/> <!-- eye -->
      <ellipse cx="320" cy="430" rx="15" ry="10" fill="none" stroke="black" stroke-width="2"/> <!-- eye -->
      
      <circle cx="900" cy="400" r="55" fill="none" stroke="black" stroke-width="3"/> <!-- lion 2 head -->
      <ellipse cx="880" cy="380" rx="15" ry="10" fill="none" stroke="black" stroke-width="2"/> <!-- eye -->
      <ellipse cx="920" cy="380" rx="15" ry="10" fill="none" stroke="black" stroke-width="2"/> <!-- eye -->
      
      <!-- Cave walls -->
      <path d="M 100 200 Q 150 150 200 200 L 200 700 L 100 700 Z" fill="none" stroke="black" stroke-width="4"/>
      <path d="M 1000 200 Q 1050 150 1100 200 L 1100 700 L 1000 700 Z" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Ground -->
      <line x1="100" y1="650" x2="1100" y2="650" stroke="black" stroke-width="3"/>
    `;
  } else if (promptLower.includes('david') || promptLower.includes('goliath')) {
    // David and Goliath
    svgContent = `
      <!-- David (small figure) -->
      <circle cx="300" cy="450" r="25" fill="none" stroke="black" stroke-width="3"/> <!-- head -->
      <rect x="285" y="475" width="30" height="60" fill="none" stroke="black" stroke-width="3"/> <!-- body -->
      <line x1="300" y1="535" x2="300" y2="600" stroke="black" stroke-width="3"/> <!-- legs -->
      
      <!-- Sling -->
      <path d="M 270 460 Q 250 440 230 460" fill="none" stroke="black" stroke-width="2"/>
      <circle cx="230" cy="460" r="8" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Goliath (large figure) -->
      <circle cx="800" cy="250" r="50" fill="none" stroke="black" stroke-width="4"/> <!-- head -->
      <rect x="760" y="300" width="80" height="150" fill="none" stroke="black" stroke-width="4"/> <!-- body -->
      <line x1="800" y1="450" x2="800" y2="600" stroke="black" stroke-width="5"/> <!-- legs -->
      
      <!-- Shield and spear -->
      <ellipse cx="720" cy="350" rx="30" ry="50" fill="none" stroke="black" stroke-width="3"/>
      <line x1="880" y1="200" x2="880" y2="400" stroke="black" stroke-width="4"/>
      
      <!-- Ground -->
      <line x1="100" y1="600" x2="1100" y2="600" stroke="black" stroke-width="3"/>
    `;
  } else if (promptLower.includes('noah') || promptLower.includes('ark')) {
    // Noah's Ark
    svgContent = `
      <!-- Ark hull -->
      <ellipse cx="600" cy="500" rx="300" ry="80" fill="none" stroke="black" stroke-width="5"/>
      <rect x="300" y="420" width="600" height="80" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Ark house structure -->
      <rect x="450" y="300" width="300" height="120" fill="none" stroke="black" stroke-width="4"/>
      <polygon points="450,300 600,200 750,300" fill="none" stroke="black" stroke-width="4"/>
      
      <!-- Window -->
      <rect x="550" y="340" width="100" height="60" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Animals -->
      <!-- Elephants -->
      <circle cx="400" cy="360" r="20" fill="none" stroke="black" stroke-width="2"/>
      <path d="M 400 380 Q 390 400 395 420" fill="none" stroke="black" stroke-width="2"/> <!-- trunk -->
      
      <!-- Giraffes -->
      <circle cx="700" cy="340" r="15" fill="none" stroke="black" stroke-width="2"/>
      <line x1="700" y1="355" x2="700" y2="250" stroke="black" stroke-width="3"/> <!-- neck -->
      <circle cx="700" cy="240" r="12" fill="none" stroke="black" stroke-width="2"/> <!-- head -->
      
      <!-- Water waves -->
      <path d="M 100 550 Q 150 530 200 550 Q 250 570 300 550" fill="none" stroke="black" stroke-width="3"/>
      <path d="M 900 550 Q 950 530 1000 550 Q 1050 570 1100 550" fill="none" stroke="black" stroke-width="3"/>
    `;
  } else {
    // Generic biblical/story scene template
    svgContent = `
      <!-- Central figure -->
      <circle cx="600" cy="350" r="40" fill="none" stroke="black" stroke-width="4"/> <!-- head -->
      <rect x="570" y="390" width="60" height="120" fill="none" stroke="black" stroke-width="4"/> <!-- robe -->
      <line x1="600" y1="510" x2="600" y2="600" stroke="black" stroke-width="4"/> <!-- body -->
      
      <!-- Background elements -->
      <circle cx="300" cy="200" r="80" fill="none" stroke="black" stroke-width="3"/> <!-- sun -->
      <path d="M 250 150 L 270 180 M 350 150 L 330 180 M 300 120 L 300 140 M 220 200 L 240 200 M 360 200 L 380 200" stroke="black" stroke-width="2"/> <!-- sun rays -->
      
      <!-- Mountains -->
      <polygon points="150,400 250,250 350,400" fill="none" stroke="black" stroke-width="3"/>
      <polygon points="850,400 950,300 1050,400" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Ground -->
      <line x1="100" y1="600" x2="1100" y2="600" stroke="black" stroke-width="3"/>
      
      <!-- Decorative elements -->
      <circle cx="200" cy="500" r="20" fill="none" stroke="black" stroke-width="2"/>
      <circle cx="1000" cy="450" r="25" fill="none" stroke="black" stroke-width="2"/>
    `;
  }
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="white"/>
    ${svgContent}
    
    <!-- Border -->
    <rect x="50" y="50" width="${width-100}" height="${height-100}" fill="none" stroke="black" stroke-width="3" rx="20"/>
    
    <!-- Title -->
    <text x="${width/2}" y="100" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="36" font-weight="bold" fill="black">
      Color Me!
    </text>
    
    <!-- Subject label -->
    <text x="${width/2}" y="${height-100}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="black">
      ${prompt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </text>
  </svg>`;
  
  const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return svgDataUrl;
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
