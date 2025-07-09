import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en';
    const prompt = formData.get('prompt') as string; // Optional context for better transcription
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    console.log('Transcribing audio file:', audioFile.name, 'Size:', audioFile.size);

    // Create FormData for OpenAI API
    const openaiFormData = new FormData();
    openaiFormData.append('file', audioFile);
    openaiFormData.append('model', 'whisper-1');
    openaiFormData.append('language', language);
    if (prompt) {
      openaiFormData.append('prompt', prompt);
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Whisper API error:', errorData);
      return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }

    const data = await response.json();
    
    // Now use GPT to convert the transcription into worksheet parameters
    const worksheetPrompt = `Convert this voice input into worksheet generation parameters:
    
    Transcription: "${data.text}"
    
    Extract and return JSON with:
    {
      "subject": "detected subject (math, science, reading, etc.)",
      "grade": "detected grade level (K-12)",
      "topic": "specific topic mentioned",
      "worksheetType": "type of worksheet requested",
      "additionalRequirements": "any special requirements mentioned",
      "transcription": "${data.text}"
    }`;

    const interpretResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: worksheetPrompt }],
        response_format: { type: 'json_object' },
        max_tokens: 500
      }),
    });

    const interpretData = await interpretResponse.json();
    const worksheetParams = JSON.parse(interpretData.choices[0]?.message?.content || '{}');
    
    return NextResponse.json({ 
      transcription: data.text,
      worksheetParameters: worksheetParams
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 });
  }
}
