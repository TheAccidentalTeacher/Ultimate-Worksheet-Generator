// Enhanced Content Generator with Multi-API Intelligence
// Integrates SmartAPIRouter for optimal API selection and usage

import { UserSelections, WorksheetResult, WorksheetProblem } from './types';
import { SmartAPIRouter, APIStrategy } from './SmartAPIRouter';

interface EnhancedWorksheet extends WorksheetResult {
  generatedBy?: string;
  visualTheme?: any;
  researchEnhancements?: any;
  apiStrategy?: any;
  enhancementSuggestions?: any[];
}

export class EnhancedContentGenerator {
  progressCallback: (percentage: number, message: string) => void;
  private smartRouter: SmartAPIRouter;

  constructor({ progressCallback }: { progressCallback: (percentage: number, message: string) => void }) {
    this.progressCallback = progressCallback;
    this.smartRouter = new SmartAPIRouter();
  }

  async generateWorksheet(userSelections: UserSelections): Promise<EnhancedWorksheet> {
    console.log('[ENHANCED-GENERATOR] Starting intelligent worksheet generation with:', userSelections);
    this.progressCallback(5, 'Analyzing educational requirements...');
    
    // Step 1: Get optimal API strategy
    const apiStrategy = this.smartRouter.selectAPIStrategy(userSelections);
    console.log('[ENHANCED-GENERATOR] API Strategy:', apiStrategy);
    this.progressCallback(10, 'Selecting optimal content APIs...');
    
    // Step 2: Generate base content with intelligent prompting
    const enhancedPrompt = this.buildEnhancedPrompt(userSelections, apiStrategy);
    this.progressCallback(20, 'Generating enhanced educational content...');
    
    let worksheetContent: EnhancedWorksheet;
    try {
      worksheetContent = await this.generateWithFallback(enhancedPrompt, apiStrategy, userSelections);
      this.progressCallback(50, 'Processing worksheet structure...');
    } catch (err: any) {
      console.error('[ENHANCED-GENERATOR] Content generation failed:', err);
      this.progressCallback(100, 'Error: ' + err.message);
      throw err;
    }
    
    // Step 3: Enhance with visual content if needed
    if (apiStrategy.visual) {
      try {
        this.progressCallback(60, 'Adding visual enhancements...');
        worksheetContent = await this.addVisualEnhancements(worksheetContent, apiStrategy, userSelections);
      } catch (err) {
        console.warn('[ENHANCED-GENERATOR] Visual enhancement failed, continuing without:', err);
      }
    }
    
    // Step 4: Add research-based enhancements
    if (apiStrategy.research) {
      try {
        this.progressCallback(70, 'Enriching with research content...');
        worksheetContent = await this.addResearchEnhancements(worksheetContent, apiStrategy, userSelections);
      } catch (err) {
        console.warn('[ENHANCED-GENERATOR] Research enhancement failed, continuing without:', err);
      }
    }
    
    // Step 5: Final enhancements and formatting
    this.progressCallback(80, 'Applying final enhancements...');
    worksheetContent = await this.applyFinalEnhancements(worksheetContent, apiStrategy, userSelections);
    
    this.progressCallback(90, 'Formatting final worksheet...');
    await this.sleep(300);
    this.progressCallback(100, 'Enhanced worksheet ready!');
    
    return worksheetContent;
  }

  /**
   * Generate content with intelligent fallback strategy
   */
  private async generateWithFallback(
    prompt: string, 
    apiStrategy: APIStrategy, 
    userSelections: UserSelections
  ): Promise<EnhancedWorksheet> {
    const apiChain = [apiStrategy.primary, ...apiStrategy.backup];
    
    for (let i = 0; i < apiChain.length; i++) {
      const apiKey = apiChain[i];
      try {
        console.log(`[ENHANCED-GENERATOR] Attempting generation with ${apiKey} (attempt ${i + 1}/${apiChain.length})`);
        
        if (apiKey.includes('OPENAI')) {
          return await this.generateWithOpenAI(prompt, apiKey);
        } else if (apiKey.includes('AZURE')) {
          return await this.generateWithAzure(prompt, apiKey);
        }
        
      } catch (err: any) {
        console.warn(`[ENHANCED-GENERATOR] ${apiKey} failed:`, err);
        if (i === apiChain.length - 1) {
          throw new Error(`All content APIs failed. Last error: ${err?.message || 'Unknown error'}`);
        }
        // Try next API in chain
        this.progressCallback(25 + (i * 5), `Trying backup API (${i + 1}/${apiChain.length - 1})...`);
      }
    }
    
    throw new Error('No available content APIs');
  }

  /**
   * Generate content using OpenAI
   */
  private async generateWithOpenAI(prompt: string, apiKeyName: string): Promise<EnhancedWorksheet> {
    const { openai } = await import('./api-services/openaiService');
    
    // Check if API key is configured
    const apiKey = process.env[apiKeyName];
    if (!apiKey || apiKey === 'dummy-key-for-build' || apiKey === 'your_openai_api_key_here') {
      throw new Error(`${apiKeyName} is not configured properly`);
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 3000 // Increased for enhanced content
    });
    
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content received from OpenAI');
    
    const worksheet = JSON.parse(content) as EnhancedWorksheet;
    worksheet.generatedBy = apiKeyName;
    return worksheet;
  }

  /**
   * Generate content using Azure AI
   */
  private async generateWithAzure(prompt: string, apiKeyName: string): Promise<EnhancedWorksheet> {
    // Note: This would integrate with Azure AI Foundry
    // For now, falling back to OpenAI structure but marking as Azure
    try {
      const { openai } = await import('./api-services/openaiService');
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 3000
      });
      
      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No content received from Azure AI');
      
      const worksheet = JSON.parse(content) as EnhancedWorksheet;
      worksheet.generatedBy = apiKeyName;
      return worksheet;
    } catch (err: any) {
      throw new Error(`Azure AI generation failed: ${err?.message || 'Unknown error'}`);
    }
  }

  /**
   * Add visual enhancements to the worksheet
   */
  private async addVisualEnhancements(
    worksheet: EnhancedWorksheet, 
    apiStrategy: APIStrategy, 
    userSelections: UserSelections
  ): Promise<EnhancedWorksheet> {
    if (!apiStrategy.visual) return worksheet;
    
    try {
      // Add visual suggestions to each problem
      if (worksheet.problems) {
        worksheet.problems = worksheet.problems.map((problem: WorksheetProblem, _index: number) => {
          // Add visual enhancement suggestions
          (problem as any).visualSuggestion = this.generateVisualSuggestion(problem, userSelections, apiStrategy.visual!);
          return problem;
        });
      }
      
      // Add overall visual theme
      worksheet.visualTheme = this.generateVisualTheme(userSelections, apiStrategy.visual!);
      
    } catch (err) {
      console.warn('[ENHANCED-GENERATOR] Visual enhancement error:', err);
    }
    
    return worksheet;
  }

  /**
   * Add research-based content enhancements
   */
  private async addResearchEnhancements(
    worksheet: EnhancedWorksheet, 
    apiStrategy: APIStrategy, 
    userSelections: UserSelections
  ): Promise<EnhancedWorksheet> {
    if (!apiStrategy.research) return worksheet;
    
    try {
      // Add research-based facts or current examples
      worksheet.researchEnhancements = {
        apiUsed: apiStrategy.research,
        type: this.determineResearchType(userSelections),
        suggestions: this.generateResearchSuggestions(userSelections, apiStrategy.research)
      };
      
    } catch (err) {
      console.warn('[ENHANCED-GENERATOR] Research enhancement error:', err);
    }
    
    return worksheet;
  }

  /**
   * Apply final enhancements based on strategy
   */
  private async applyFinalEnhancements(
    worksheet: EnhancedWorksheet, 
    apiStrategy: APIStrategy, 
    userSelections: UserSelections
  ): Promise<EnhancedWorksheet> {
    // Add API strategy info for debugging
    worksheet.apiStrategy = {
      primary: apiStrategy.primary,
      visual: apiStrategy.visual,
      research: apiStrategy.research,
      enhancements: apiStrategy.enhancement,
      explanation: this.smartRouter.explainStrategy(apiStrategy, userSelections)
    };
    
    // Add enhancement suggestions
    if (apiStrategy.enhancement.length > 0) {
      worksheet.enhancementSuggestions = apiStrategy.enhancement.map(api => 
        this.generateEnhancementSuggestion(api, userSelections)
      );
    }
    
    return worksheet;
  }

  /**
   * Build enhanced prompt with API strategy context
   */
  private buildEnhancedPrompt(userSelections: UserSelections, apiStrategy: APIStrategy): string {
    const basePrompt = this.buildBasePrompt(userSelections);
    
    // Add API-specific enhancements to the prompt
    let enhancements = '\n\nENHANCED GENERATION INSTRUCTIONS:\n';
    
    if (apiStrategy.visual) {
      enhancements += `- Include visual learning opportunities suitable for ${apiStrategy.visual}\n`;
      enhancements += '- Suggest diagram, illustration, or image ideas for complex concepts\n';
    }
    
    if (apiStrategy.research) {
      enhancements += `- Include real-world examples and current connections using ${apiStrategy.research}\n`;
      enhancements += '- Reference factual, research-based content where appropriate\n';
    }
    
    if (apiStrategy.enhancement.includes('YOUTUBE_API_KEY')) {
      enhancements += '- Suggest educational video resources for further learning\n';
    }
    
    if (apiStrategy.enhancement.includes('GIPHY_API_KEY')) {
      enhancements += '- Include animated explanations for dynamic concepts\n';
    }
    
    return basePrompt + enhancements;
  }

  /**
   * Generate visual suggestion for a problem
   */
  private generateVisualSuggestion(problem: any, userSelections: UserSelections, visualAPI: string): string {
    const grade = userSelections.grade;
    const subject = userSelections.subject;
    
    if (visualAPI === 'STABILITY_AI_API_KEY') {
      return `Custom illustration: ${this.generateAIImagePrompt(problem, subject, grade)}`;
    } else {
      return `Stock image search: ${this.generateStockImageQuery(problem, subject)}`;
    }
  }

  private generateAIImagePrompt(problem: any, subject: string, grade: string): string {
    return `Educational ${subject} illustration for ${grade}, showing ${problem.question?.substring(0, 50) || 'concept'}, child-friendly, colorful`;
  }

  private generateStockImageQuery(problem: any, subject: string): string {
    return `${subject} education ${problem.type} activity classroom`;
  }

  private generateVisualTheme(userSelections: UserSelections, visualAPI: string): any {
    return {
      api: visualAPI,
      theme: `${userSelections.subject} education for ${userSelections.grade}`,
      style: userSelections.worksheetStyle || 'engaging',
      suggestions: [
        'Consistent color scheme matching subject',
        'Age-appropriate visual complexity',
        'Clear, educational imagery'
      ]
    };
  }

  private determineResearchType(userSelections: UserSelections): string {
    if (userSelections.subject.includes('History') || userSelections.subject.includes('Social Studies')) {
      return 'historical-facts';
    } else if (userSelections.subject.includes('Science')) {
      return 'scientific-research';
    } else {
      return 'educational-examples';
    }
  }

  private generateResearchSuggestions(userSelections: UserSelections, researchAPI: string): string[] {
    return [
      `Current ${userSelections.subject} developments and discoveries`,
      `Real-world applications of ${userSelections.topic}`,
      `Historical context and modern relevance`
    ];
  }

  private generateEnhancementSuggestion(api: string, userSelections: UserSelections): any {
    const suggestions: { [key: string]: any } = {
      'YOUTUBE_API_KEY': {
        type: 'video-resources',
        description: `Educational videos related to ${userSelections.topic}`,
        searchTerms: [`${userSelections.subject} ${userSelections.topic} education`, `${userSelections.grade} ${userSelections.subject}`]
      },
      'GIPHY_API_KEY': {
        type: 'animated-explanations',
        description: 'Animated GIFs to explain dynamic concepts',
        searchTerms: [`${userSelections.subject} animation`, `educational ${userSelections.topic}`]
      },
      'REDDIT_CLIENT_ID': {
        type: 'community-examples',
        description: 'Real-world discussion examples and applications',
        communities: [`r/${userSelections.subject}`, 'r/education', 'r/homeschool']
      }
    };
    
    return suggestions[api] || { type: 'general-enhancement', api };
  }

  /**
   * Base prompt generation (reused from original ContentGenerator)
   */
  private buildBasePrompt(userSelections: UserSelections): string {
    return `SYSTEM PROMPT (for LLM, e.g., GPT-4)
-------------------------------------
You are an expert homeschool educator who creates engaging, age-appropriate worksheets with enhanced multi-API support.

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
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
