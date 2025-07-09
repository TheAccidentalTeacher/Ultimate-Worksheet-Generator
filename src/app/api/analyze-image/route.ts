import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { imageUrl, subject, grade, worksheetType } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    console.log('Analyzing image for worksheet generation:', imageUrl);

    const prompt = `Analyze this image and create a ${worksheetType || 'educational'} worksheet for ${grade || 'elementary'} grade ${subject || 'general'} students. 

Return a JSON object with:
{
  "title": "Worksheet title based on the image",
  "description": "Brief description of what students will learn",
  "instructions": "Clear instructions for students",
  "problems": [
    {
      "question": "Question based on the image",
      "type": "multiple-choice|short-answer|fill-blank|math",
      "options": ["A", "B", "C", "D"] // if multiple choice
    }
  ],
  "imageAnalysis": "What you see in the image that informed the worksheet"
}

Create 5-10 engaging questions that relate directly to what's shown in the image.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GPT-4 Vision API error:', errorData);
      return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
    }

    const data = await response.json();
    const worksheetContent = data.choices[0]?.message?.content;
    
    if (!worksheetContent) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    const worksheet = JSON.parse(worksheetContent);
    return NextResponse.json({ worksheet, originalImage: imageUrl });

  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
