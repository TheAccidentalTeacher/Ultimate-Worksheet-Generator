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

    // [LEGACY ENDPOINT WARNING] This endpoint is deprecated and will be removed in a future release.
    // Please use /api/generate-worksheet for all new worksheet generation requests.
    // To disable this endpoint, set DISABLE_LEGACY_API=true in your environment.
    if (process.env.DISABLE_LEGACY_API === 'true') {
      return NextResponse.json({ error: 'This endpoint is disabled. Please use /api/generate-worksheet.' }, { status: 410 });
    }
    const christianLevels = ['secular', 'gently Christian', 'moderately Christian', 'richly biblical'];
    const christianLevel = christianLevels[christianContent] || 'moderately Christian';
    
    // Subject-specific activity types and instructions
    const subjectGuidelines: Record<string, {
      activityTypes: string[];
      specialInstructions: string;
    }> = {
      'Coloring Sheet': {
        activityTypes: ['coloring-page', 'simple-drawing', 'tracing-activity'],
        specialInstructions: `Create a coloring sheet with simple, clear outlines perfect for children. Include:
        - Large, bold outlines that are easy to color within
        - Age-appropriate complexity based on the grade level
        - Clear, distinct sections for coloring
        - Fun characters or objects related to the topic
        - Positive, encouraging elements
        - Space for the child's name at the top
        - Simple instructions like "Color me!" or "Make me beautiful!"
        DO NOT include multiple choice questions or text-heavy content. Focus on visual elements to color.`
      },
      'Art': {
        activityTypes: ['coloring-page', 'drawing-prompt', 'art-technique', 'art-history', 'creative-project'],
        specialInstructions: 'For Art worksheets, focus on creative activities like coloring pages, drawing prompts, art techniques to practice, and hands-on creative projects. Avoid multiple choice questions.'
      },
      'Music': {
        activityTypes: ['rhythm-practice', 'note-identification', 'listening-activity', 'singing-exercise', 'instrument-practice'],
        specialInstructions: 'For Music worksheets, include rhythm exercises, note identification, listening activities, and practical music-making tasks.'
      },
      'Physical Education': {
        activityTypes: ['exercise-routine', 'movement-game', 'fitness-challenge', 'sports-skill', 'health-habit'],
        specialInstructions: 'For PE worksheets, focus on physical activities, movement games, fitness challenges, and health education.'
      },
      'Math': {
        activityTypes: ['word-problem', 'calculation', 'pattern-recognition', 'geometry-exercise', 'measurement-activity'],
        specialInstructions: 'For Math worksheets, include a variety of problem types: word problems, calculations, visual problems, and real-world applications.'
      },
      'Science': {
        activityTypes: ['experiment', 'observation', 'diagram-labeling', 'hypothesis', 'classification'],
        specialInstructions: 'For Science worksheets, include hands-on experiments, observations, diagram labeling, and scientific thinking exercises.'
      },
      'ELA/Language Arts': {
        activityTypes: ['reading-comprehension', 'creative-writing', 'grammar-practice', 'vocabulary', 'poetry'],
        specialInstructions: 'For Language Arts worksheets, include reading comprehension, creative writing prompts, grammar exercises, and vocabulary activities.'
      }
    };

    const subjectInfo = subjectGuidelines[subject] || {
      activityTypes: ['multiple-choice', 'short-answer', 'fill-in-blank', 'true-false'],
      specialInstructions: 'Create age-appropriate activities that match the subject matter.'
    };
    
    const systemPrompt = `You are an expert homeschool educator who creates engaging, age-appropriate worksheets. Create worksheets that are ${christianLevel} in nature.

Your task is to generate a structured worksheet with exactly ${numProblems} activities.

Guidelines:
- Grade Level: ${grade}
- Subject: ${subject}
- Topic: ${topic}
- Style: ${worksheetStyle}
- Christian Content: ${christianLevel}
- Scaffolding: ${scaffolding}
- Difficulty: ${differentiation}
- Duration: ${timeEstimate}

IMPORTANT SUBJECT-SPECIFIC GUIDELINES:
${subjectInfo.specialInstructions}

Recommended activity types for ${subject}: ${subjectInfo.activityTypes.join(', ')}

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
      "type": "Choose from: ${subjectInfo.activityTypes.join('|')}",
      "question": "The activity description or question",
      "options": ["Only include if multiple choice"],
      "answer": "Expected response or completion criteria",
      "explanation": "Why this activity helps learning",
      "christianConnection": "Optional faith connection",
      "materials": "Any specific materials needed for this activity"
    }
  ],
  "answerKey": "Brief teacher notes or tips",
  "extensions": ["Optional extension activities"],
  "materials": ["Any materials needed for the entire worksheet"]
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

    return NextResponse.json({ ...worksheet, legacy: true, warning: 'This endpoint is deprecated. Please use /api/generate-worksheet.' });
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

// Function calling schema for structured worksheet generation
const worksheetSchema = {
  name: "generate_worksheet",
  description: "Generate an educational worksheet with structured content",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The title of the worksheet"
      },
      description: {
        type: "string", 
        description: "Brief description of the worksheet's learning objectives"
      },
      instructions: {
        type: "string",
        description: "Clear instructions for students"
      },
      problems: {
        type: "array",
        description: "Array of problems/questions",
        items: {
          type: "object",
          properties: {
            question: { type: "string", description: "The question text" },
            type: { 
              type: "string", 
              enum: ["multiple-choice", "short-answer", "fill-blank", "math", "true-false", "matching"],
              description: "Type of question"
            },
            options: {
              type: "array",
              items: { type: "string" },
              description: "Options for multiple choice questions"
            },
            answer: { type: "string", description: "Correct answer" },
            points: { type: "number", description: "Points for this question" },
            difficulty: {
              type: "string",
              enum: ["easy", "medium", "hard"],
              description: "Difficulty level"
            }
          },
          required: ["question", "type", "answer"]
        }
      },
      visualAssets: {
        type: "array",
        description: "Visual elements needed for the worksheet",
        items: {
          type: "object",
          properties: {
            description: { type: "string", description: "What image is needed" },
            searchQuery: { type: "string", description: "Search terms for finding the image" },
            placement: { type: "string", description: "Where to place this image" }
          }
        }
      },
      answerKey: {
        type: "object",
        description: "Answer key with explanations",
        properties: {
          answers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                questionNumber: { type: "number" },
                answer: { type: "string" },
                explanation: { type: "string" }
              }
            }
          }
        }
      }
    },
    required: ["title", "description", "instructions", "problems"]
  }
};
