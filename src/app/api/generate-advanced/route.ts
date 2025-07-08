import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { 
      prompt, 
      grade, 
      subject, 
      topic, 
      numProblems = 10, 
      scaffolding = 'none', 
      differentiation = 'standard',
      christianContent = 2,
      worksheetStyle = 'whimsical',
      timeEstimate = 'medium'
    } = await req.json();

    // Create a comprehensive prompt for OpenAI
    const christianLevels = ['secular', 'gently Christian', 'moderately Christian', 'richly biblical'];
    const christianLevel = christianLevels[christianContent] || 'moderately Christian';
    
    const systemPrompt = `You are an expert homeschool educator who creates engaging, age-appropriate worksheets. Create worksheets that are ${christianLevel} in nature.

Your task is to generate a structured worksheet with exactly ${numProblems} problems/activities.

Guidelines:
- Grade Level: ${grade}
- Subject: ${subject}
- Topic: ${topic}
- Style: ${worksheetStyle}
- Christian Content: ${christianLevel}
- Scaffolding: ${scaffolding}
- Difficulty: ${differentiation}
- Duration: ${timeEstimate}

For Christian content levels:
- Secular: No religious content
- Gently Christian: Occasional positive biblical worldview, wholesome values
- Moderately Christian: Regular scripture references, biblical principles woven in naturally
- Richly Biblical: Heavy scripture integration, explicit faith connections, biblical applications

Return a JSON object with this exact structure:
{
  "title": "Worksheet Title",
  "grade": "${grade}",
  "subject": "${subject}",
  "topic": "${topic}",
  "description": "Brief description of what students will learn",
  "instructions": "Clear instructions for students",
  "estimatedTime": "X minutes",
  "problems": [
    {
      "id": 1,
      "type": "multiple-choice|fill-in-blank|short-answer|word-problem|matching|true-false",
      "question": "The question text",
      "options": ["A", "B", "C", "D"],
      "answer": "Correct answer",
      "explanation": "Why this is correct",
      "christianConnection": "Optional faith connection"
    }
  ],
  "answerKey": "Brief teacher notes or tips",
  "extensions": ["Optional extension activities"],
  "materials": ["Any materials needed"]
}`;

    const userPrompt = prompt || `Create a ${grade} ${subject} worksheet on ${topic} with ${numProblems} problems that is ${christianLevel}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = completion.choices[0].message.content;
    
    // Try to parse the JSON response
    let worksheet;
    try {
      worksheet = JSON.parse(content || '{}');
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      worksheet = {
        title: `${grade} ${subject}: ${topic}`,
        grade,
        subject,
        topic,
        description: "AI-generated worksheet",
        instructions: "Complete the following activities to the best of your ability.",
        estimatedTime: `${timeEstimate === 'short' ? '15-20' : timeEstimate === 'long' ? '45-60' : '25-35'} minutes`,
        problems: [
          {
            id: 1,
            type: "short-answer",
            question: content || "Practice problem generated from your request",
            answer: "Sample answer",
            explanation: "This problem helps reinforce the concepts we're learning."
          }
        ],
        answerKey: "Review student responses for understanding.",
        extensions: ["Additional practice problems", "Real-world applications"],
        materials: ["Pencil", "Paper", "Any subject-specific materials"]
      };
    }

    return NextResponse.json(worksheet);
  } catch (error: any) {
    console.error('Error generating worksheet:', error);
    
    // Return a fallback response
    return NextResponse.json({
      title: "Sample Worksheet",
      grade: "General",
      subject: "Learning",
      topic: "Practice",
      description: "A sample worksheet while we resolve the connection issue.",
      instructions: "Complete the following sample activities.",
      estimatedTime: "20 minutes",
      problems: [
        {
          id: 1,
          type: "short-answer",
          question: "What is your favorite thing about learning?",
          answer: "Student's personal response",
          explanation: "This helps us understand your learning preferences."
        },
        {
          id: 2,
          type: "multiple-choice",
          question: "Learning is most fun when:",
          options: ["A) It's challenging", "B) It's creative", "C) It's collaborative", "D) All of the above"],
          answer: "D) All of the above",
          explanation: "Learning can be enjoyable in many different ways!"
        }
      ],
      answerKey: "Encourage student reflection and discussion.",
      extensions: ["Share responses with family", "Create your own questions"],
      materials: ["Pencil", "Paper", "Positive attitude"],
      error: "Using sample data - API connection issue"
    }, { status: 200 });
  }
}
