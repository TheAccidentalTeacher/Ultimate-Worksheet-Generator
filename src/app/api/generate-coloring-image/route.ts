import { NextRequest, NextResponse } from 'next/server';

// You need to set REPLICATE_API_TOKEN in your .env.local
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
  }
  if (!REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: 'No Replicate API token set' }, { status: 500 });
  }

  // Replicate Stable Diffusion coloring model (SDXL or SD 1.5)
  const replicateUrl = 'https://api.replicate.com/v1/predictions';
  // You can swap to a line-art-specific model if needed, e.g. "t2i-adapter-lineart" or "dreamshaper"
  const model = 'stability-ai/sdxl';
  // Strong, explicit prompt for coloring book line art
  const lineArtPrompt = `${prompt}, black and white line art, coloring book page, simple, thick outlines, no shading, no color, high contrast, kid friendly, vector, clear background, centered subject, minimal background, for children to color`;
  const negativePrompt = 'color, photorealistic, realistic, 3d, shadow, blur, text, watermark, signature, background, grayscale, filled, painting, sketch, pencil, soft, blurry, low quality, cropped, cut off, extra limbs, extra objects, duplicate, error';
  const input = {
    prompt: lineArtPrompt,
    negative_prompt: negativePrompt,
    width: 768,
    height: 768,
    num_outputs: 1
  };

  try {
    const response = await fetch(replicateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model,
        input,
      }),
    });
    const data = await response.json();
    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }
    // Replicate returns a prediction object; poll for completion
    let imageUrl = null;
    let status = data.status;
    let predictionId = data.id;
    let pollUrl = `${replicateUrl}/${predictionId}`;
    while (status !== 'succeeded' && status !== 'failed') {
      await new Promise(r => setTimeout(r, 2000));
      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` },
      });
      const pollData = await pollRes.json();
      status = pollData.status;
      if (status === 'succeeded') {
        imageUrl = pollData.output?.[0];
      }
      if (status === 'failed') {
        return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
      }
    }
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image returned' }, { status: 500 });
    }
    return NextResponse.json({ imageUrl });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
