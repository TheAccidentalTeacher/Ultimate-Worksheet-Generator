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
      console.log('[GENERATOR] OpenAI response preview:', worksheetContent?.substring(0, 200) + '...');
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
    this.progressCallback(50, 'Planning visual assets...');
    // Step 4: Visual asset selection (simplified to avoid photo APIs)
    if (worksheet && worksheet.visualAssets && Array.isArray(worksheet.visualAssets)) {
      const { generateAiImage } = await import('./api-services/imageGenerationService');
      for (let i = 0; i < worksheet.visualAssets.length; i++) {
        const asset = worksheet.visualAssets[i];
        this.progressCallback(55 + Math.floor((i * 30) / worksheet.visualAssets.length), `Preparing visual asset ${i + 1} of ${worksheet.visualAssets.length}...`);
        
        // Simplified: Use AI generation only for worksheet images
        let imageResult;
        try {
          imageResult = await generateAiImage(asset.description || asset.query);
          asset.imageUrl = imageResult.url;
          asset.source = 'AI Generated';
        } catch (error) {
          console.warn(`[GENERATOR] Failed to generate image for ${asset.description}:`, error);
          asset.imageUrl = '';
          asset.source = 'Placeholder';
        }
      }
    }
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

  async determineOptimalImageSource(asset: import('./types').WorksheetVisualAsset, userSelections: import('./types').UserSelections) {
    const { openai } = await import('./api-services/openaiService');
    const prompt = `As an expert educational content curator, analyze this visual asset request and determine the optimal source.\n\n## VISUAL ASSET DETAILS\nDescription: ${asset.description}\nPurpose: ${asset.purpose}\nEducational Context: ${userSelections.grade} grade ${userSelections.subject} about ${userSelections.topic}\n\n## AVAILABLE IMAGE SOURCES\n1. Wikimedia Commons - Best for: historical images, scientific diagrams, maps, public domain educational content\n2. Unsplash - Best for: high-quality photographs, modern settings, nature, general concepts\n3. Pixabay - Best for: illustrations, clipart, simple diagrams\n4. AI Image Generation - Best for: custom educational illustrations, coloring pages, conceptual diagrams not readily available in stock photos\n\n## SPECIAL CONSIDERATIONS\n- For K-6 grade coloring pages, AI generation is typically best\n- For historical figures/events, Wikimedia Commons usually has authentic images\n- For abstract concepts, AI generation may create the most relevant educational illustration\n- For general photographs of nature, places, or common objects, stock photos are often best\n\n## REQUIRED OUTPUT\nProvide your analysis as a JSON object with the following structure:\n{\n  "recommendedSource": "wikimedia|unsplash|pixabay|ai-generation",\n  "rationale": "Brief explanation of why this source is best",\n  "enhancedQuery": "Optimized search query for stock photo APIs",\n  "enhancedPrompt": "Optimized prompt for AI image generation",\n  "imageType": "photo|illustration|vector|all"\n}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.3
    });
    try {
      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
      // Fallback to AI generation if parsing fails
      return {
        recommendedSource: 'ai-generation',
        rationale: 'Fallback due to decision processing error',
        enhancedQuery: asset.description,
        enhancedPrompt: `Educational illustration for ${userSelections.grade} grade ${userSelections.subject} about ${asset.description}. ${asset.purpose}`,
        imageType: 'all'
      };
    }
  }



  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
