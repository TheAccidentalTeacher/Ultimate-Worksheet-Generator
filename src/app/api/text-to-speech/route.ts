import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { text, voice = 'alloy', speed = 1.0 } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    console.log('Generating audio for text length:', text.length);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice, // alloy, echo, fable, onyx, nova, shimmer
        speed: speed,
        response_format: 'mp3'
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('TTS API error:', errorData);
      return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
    }

    // Convert the audio response to a base64 string
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    
    return NextResponse.json({ 
      audioData: `data:audio/mp3;base64,${audioBase64}`,
      voice,
      speed
    });

  } catch (error) {
    console.error('TTS generation error:', error);
    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
  }
}
