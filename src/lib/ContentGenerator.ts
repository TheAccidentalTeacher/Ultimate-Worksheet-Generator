// src/lib/ContentGenerator.ts
export class ContentGenerator {
  progressCallback: (percentage: number, message: string) => void;

  constructor({ progressCallback }: { progressCallback: (percentage: number, message: string) => void }) {
    this.progressCallback = progressCallback;
  }

  async generateWorksheet(userSelections: import('./types').UserSelections) {
    console.log('[GENERATOR] Starting worksheet generation with:', userSelections);
    this.progressCallback(10, 'Analyzing educational requirements...');
    
    // Step 1: Assemble prompt
    const prompt = this.buildPrompt(userSelections);
    this.progressCallback(20, 'Generating educational content...');
    
    // Step 2: Call GPT API
    const { openai } = await import('./api-services/openaiService');
    let worksheetContent;
    try {
      console.log('[GENERATOR] Calling OpenAI with prompt length:', prompt.length);
      
      // Check if API key is configured
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build' || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        throw new Error('OpenAI API key is not configured. Please set a valid OPENAI_API_KEY environment variable.');
      }
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2048
      });
      worksheetContent = completion.choices[0]?.message?.content;
      console.log('[GENERATOR] OpenAI response received, length:', worksheetContent?.length || 0);
      this.progressCallback(40, 'Processing worksheet structure...');
    } catch (err: any) {
      console.error('[GENERATOR] OpenAI API error:', err);
      let errorMessage = 'Failed to generate worksheet';
      
      if (err.message?.includes('API key')) {
        errorMessage = 'OpenAI API key is not configured. Please check your environment variables.';
      } else if (err.code === 'insufficient_quota') {
        errorMessage = 'OpenAI API quota exceeded. Please check your billing.';
      } else if (err.code === 'invalid_api_key') {
        errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      this.progressCallback(100, 'Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    
    // Step 3: Parse and validate
    let worksheet;
    try {
      worksheet = JSON.parse(worksheetContent || '{}');
      console.log('[GENERATOR] Parsed worksheet:', {
        title: worksheet.title,
        problemsCount: worksheet.problems?.length || 0,
        hasDescription: !!worksheet.description,
        hasInstructions: !!worksheet.instructions
      });
    } catch (e) {
      console.error('[GENERATOR] JSON parsing error:', e);
      console.error('[GENERATOR] Raw content that failed to parse:', worksheetContent);
      this.progressCallback(100, 'Error: Invalid JSON from LLM');
      throw new Error('Invalid JSON from LLM');
    }
    
    // Skip all image processing - just return the worksheet
    this.progressCallback(90, 'Formatting final worksheet...');
    await this.sleep(300);
    this.progressCallback(100, 'Worksheet ready!');
    return worksheet;
  }

  buildPrompt(userSelections: import('./types').UserSelections) {
    console.log('[PROMPT] Building prompt with user selections:', userSelections);
    
    // Full prompt logic from prompt-kitchen-template.md
    const prompt = `SYSTEM PROMPT (for LLM, e.g., GPT-4)
-------------------------------------
You are an expert homeschool educator who creates engaging, age-appropriate worksheets.

Grade Level: ${userSelections.grade}
Subject: ${userSelections.subject}
Topic: ${userSelections.topic}
Style: ${userSelections.worksheetStyle || 'engaging'}
Christian Content: ${userSelections.christianContent || 'Moderately Christian'}
Scaffolding: ${userSelections.scaffolding || 'standard'}
Difficulty: ${userSelections.differentiation || 'grade-appropriate'}
Duration: ${userSelections.timeEstimate || '30 minutes'}

IMPORTANT SUBJECT-SPECIFIC GUIDELINES:
${userSelections.subjectInfo?.specialInstructions || 'Create age-appropriate activities that engage students and reinforce learning objectives.'}

Recommended activity types for ${userSelections.subject}: ${userSelections.subjectInfo?.activityTypes?.join(', ') || 'multiple-choice, short-answer, creative-thinking'}

For Christian content levels:
- Secular: No religious content
- Gently Christian: Occasional positive biblical worldview, wholesome values
- Moderately Christian: Regular scripture references, biblical principles woven in naturally
- Richly Biblical: Heavy scripture integration, explicit faith connections, biblical applications

Return a JSON object with this exact structure:
{
  "title": "Engaging worksheet title",
  "grade": "${userSelections.grade}",
  "subject": "${userSelections.subject}",
  "topic": "${userSelections.topic}",
  "description": "Brief description of what students will learn",
  "instructions": "Clear, student-friendly instructions",
  "estimatedTime": "X minutes",
  "problems": [
    {
      "id": 1,
      "type": "multiple-choice|short-answer|fill-in-blank|true-false|creative-writing|word-problem|diagram-labeling",
      "question": "The question or activity prompt",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Expected answer or completion criteria",
      "explanation": "Why this activity helps learning",
      "christianConnection": "Optional faith connection (if applicable)",
      "materials": "Any specific materials needed"
    }
  ],
  "answerKey": "Brief teacher notes and tips",
  "extensions": ["Optional extension activities"],
  "materials": ["Materials needed for the entire worksheet"]
}

Create exactly ${userSelections.numProblems || 5} ${userSelections.numProblems === 1 ? 'activity' : 'problems/activities'}. ${userSelections.numProblems === 1 ? 'Since this is a single-item worksheet, make the activity comprehensive and engaging, potentially with multiple parts or steps.' : 'Make sure each problem is educational, age-appropriate, and engaging.'}`;

    console.log('[PROMPT] Generated prompt length:', prompt.length);
    return prompt;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
