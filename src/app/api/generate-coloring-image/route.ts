import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with your working API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Stability AI configuration
const STABILITY_API_KEY = process.env.STABILITY_AI_API_KEY;
const STABILITY_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

export async function POST(request: NextRequest) {
  try {
    const { prompt, theme, ageGroup, style = 'coloring page' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('[COLORING API] Generating coloring image for:', { prompt, theme, ageGroup, style });

    // Create explicit coloring sheet prompt with clear instructions
    const coloringPrompt = createColoringSheetPrompt(prompt, theme, ageGroup);
    console.log('[COLORING API] Enhanced prompt:', coloringPrompt);

    let imageUrl: string | null = null;

    // Try OpenAI DALL-E first (best quality for coloring sheets)
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key-for-build') {
      try {
        imageUrl = await generateWithDALLE(coloringPrompt);
        if (imageUrl) {
          console.log('[COLORING API] Successfully generated with DALL-E');
          return NextResponse.json({ imageUrl, source: 'dall-e' });
        }
      } catch (error) {
        console.log('[COLORING API] DALL-E failed, trying Stability AI:', error);
      }
    }

    // Fallback to Stability AI
    if (STABILITY_API_KEY && !imageUrl) {
      try {
        imageUrl = await generateWithStabilityAI(coloringPrompt);
        if (imageUrl) {
          console.log('[COLORING API] Successfully generated with Stability AI');
          return NextResponse.json({ imageUrl, source: 'stability-ai' });
        }
      } catch (error) {
        console.log('[COLORING API] Stability AI failed:', error);
      }
    }

    // If all APIs fail, return an error (no more SVG fallbacks)
    console.log('[COLORING API] All image generation services failed');
    return NextResponse.json({ 
      error: 'Unable to generate coloring image. Please check API configuration.',
      details: 'Both OpenAI and Stability AI services are unavailable'
    }, { status: 500 });

  } catch (error: any) {
    console.error('[COLORING API] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate coloring image',
      details: error.message 
    }, { status: 500 });
  }
}

function createColoringSheetPrompt(basePrompt: string, theme: string, ageGroup: string): string {
  // Create very explicit coloring sheet instructions
  const ageAdjustment = getAgeAppropriateStyle(ageGroup);
  
  return `COLORING BOOK PAGE: ${basePrompt}. 
Style: Black and white line art coloring page, ${ageAdjustment}, clean bold outlines, simple shapes, no shading, no fill colors, white background, designed specifically for coloring with crayons or colored pencils. 
Theme: ${theme}. 
Requirements: Clear black outlines only, no gray areas, no detailed textures, perfect for children to color in. Line art style like a professional coloring book.`;
}

function getAgeAppropriateStyle(ageGroup: string): string {
  switch (ageGroup.toLowerCase()) {
    case 'toddler':
    case 'preschool':
      return 'very simple thick lines, large areas to color, minimal details';
    case 'elementary':
    case 'school age':
      return 'moderate detail level, clear sections, kid-friendly complexity';
    case 'middle school':
    case 'teen':
      return 'more intricate details, fine lines, complex patterns allowed';
    case 'adult':
      return 'intricate mandala-style details, fine line work, complex patterns';
    default:
      return 'moderate detail level, clear sections, family-friendly';
  }
}

async function generateWithDALLE(prompt: string): Promise<string | null> {
  try {
    console.log('[DALL-E] Generating with prompt:', prompt.substring(0, 100) + '...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data?.[0]?.url;
    if (imageUrl) {
      console.log('[DALL-E] Successfully generated image');
      return imageUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error('[DALL-E] Error:', error.message);
    throw error;
  }
}

async function generateWithStabilityAI(prompt: string): Promise<string | null> {
  try {
    console.log('[STABILITY] Generating with prompt:', prompt.substring(0, 100) + '...');
    
    const response = await fetch(STABILITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          },
          {
            text: "blurry, colorful, filled in, painted, shaded, gradient, photo realistic",
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
        style_preset: "line-art"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stability AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.artifacts && data.artifacts[0]) {
      // Convert base64 to data URL
      const base64Image = data.artifacts[0].base64;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      console.log('[STABILITY] Successfully generated image');
      return imageUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error('[STABILITY] Error:', error.message);
    throw error;
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Coloring image generation API is running',
    availableServices: {
      dalleConfigured: !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key-for-build'),
      stabilityConfigured: !!process.env.STABILITY_AI_API_KEY
    }
  });
}
