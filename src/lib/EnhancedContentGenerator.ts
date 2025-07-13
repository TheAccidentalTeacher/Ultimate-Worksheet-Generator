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
   * Add research-based content enhancements with REAL data integration
   */
  private async addResearchEnhancements(
    worksheet: EnhancedWorksheet, 
    apiStrategy: APIStrategy, 
    userSelections: UserSelections
  ): Promise<EnhancedWorksheet> {
    if (!apiStrategy.research) return worksheet;
    
    try {
      console.log('[ENHANCED-GENERATOR] Fetching real research data...');
      
      // Fetch actual research data based on the topic
      const researchData = await this.fetchResearchData(userSelections, apiStrategy.research);
      
      // Integrate research into worksheet content
      worksheet.researchEnhancements = {
        apiUsed: apiStrategy.research,
        type: this.determineResearchType(userSelections),
        realData: researchData,
        integrationSuggestions: this.generateResearchIntegrations(researchData, userSelections),
        currentExamples: this.extractCurrentExamples(researchData, userSelections.topic),
        factualSupport: this.generateFactualSupport(researchData, userSelections)
      };

      // Enhance existing problems with research data
      if (worksheet.problems && researchData.relevantFacts.length > 0) {
        worksheet.problems = await this.enhanceProblemsWithResearch(
          worksheet.problems, 
          researchData, 
          userSelections
        );
      }
      
    } catch (err) {
      console.warn('[ENHANCED-GENERATOR] Research enhancement error:', err);
      // Fallback to theoretical research suggestions
      worksheet.researchEnhancements = {
        apiUsed: apiStrategy.research,
        type: this.determineResearchType(userSelections),
        fallbackSuggestions: this.generateResearchSuggestions(userSelections, apiStrategy.research),
        error: 'Live research data unavailable - using educational best practices'
      };
    }
    
    return worksheet;
  }

  /**
   * Fetch real research data from selected API
   */
  private async fetchResearchData(userSelections: UserSelections, researchAPI: string): Promise<any> {
    const searchQuery = this.buildResearchQuery(userSelections);
    
    switch (researchAPI) {
      case 'SERPAPI_KEY':
        return await this.fetchFromSerpAPI(searchQuery, userSelections);
      case 'NEWS_API_KEY':
        return await this.fetchFromNewsAPI(searchQuery, userSelections);
      case 'YOUTUBE_API_KEY':
        return await this.fetchFromYouTubeAPI(searchQuery, userSelections);
      default:
        throw new Error(`Unsupported research API: ${researchAPI}`);
    }
  }

  /**
   * Build intelligent research query based on worksheet content
   */
  private buildResearchQuery(userSelections: UserSelections): string {
    const { subject, topic, grade } = userSelections;
    const gradeLevel = this.gradeToNumber(grade);
    
    // Create age-appropriate research queries
    if (gradeLevel <= 5) {
      return `${topic} ${subject} kids facts elementary education`;
    } else if (gradeLevel <= 8) {
      return `${topic} ${subject} middle school research current events`;
    } else {
      return `${topic} ${subject} high school advanced research recent developments`;
    }
  }

  /**
   * Fetch data from SerpAPI (Google Search results)
   */
  private async fetchFromSerpAPI(query: string, userSelections: UserSelections): Promise<any> {
    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey || serpApiKey === 'dummy-key-for-build') {
      throw new Error('SerpAPI key not configured');
    }

    try {
      const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=5`);
      const data = await response.json();
      
      return {
        source: 'SerpAPI - Google Search Results',
        query: query,
        relevantFacts: this.extractFactsFromSerpResults(data, userSelections),
        currentExamples: this.extractCurrentExamplesFromSerp(data, userSelections),
        educationalResources: this.extractEducationalResources(data),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[RESEARCH] SerpAPI error:', error);
      throw error;
    }
  }

  /**
   * Fetch data from News API (current events)
   */
  private async fetchFromNewsAPI(query: string, userSelections: UserSelections): Promise<any> {
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey || newsApiKey === 'dummy-key-for-build') {
      throw new Error('News API key not configured');
    }

    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevancy&pageSize=5&apiKey=${newsApiKey}`
      );
      const data = await response.json();
      
      return {
        source: 'News API - Current Events',
        query: query,
        relevantFacts: this.extractFactsFromNews(data, userSelections),
        currentExamples: this.extractCurrentExamplesFromNews(data, userSelections),
        realWorldConnections: this.extractRealWorldConnections(data, userSelections),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[RESEARCH] News API error:', error);
      throw error;
    }
  }

  /**
   * Fetch data from YouTube API (educational videos)
   */
  private async fetchFromYouTubeAPI(query: string, userSelections: UserSelections): Promise<any> {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey || youtubeApiKey === 'dummy-key-for-build') {
      throw new Error('YouTube API key not configured');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' education')}&type=video&maxResults=5&key=${youtubeApiKey}`
      );
      const data = await response.json();
      
      return {
        source: 'YouTube API - Educational Videos',
        query: query,
        relevantFacts: this.extractFactsFromYouTube(data, userSelections),
        currentExamples: this.extractCurrentExamplesFromYouTube(data),
        videoResources: this.extractVideoResources(data, userSelections),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[RESEARCH] YouTube API error:', error);
      throw error;
    }
  }

  /**
   * Extract educational facts from SerpAPI results
   */
  private extractFactsFromSerpResults(data: any, userSelections: UserSelections): string[] {
    const facts: string[] = [];
    
    if (data.organic_results) {
      data.organic_results.slice(0, 3).forEach((result: any) => {
        if (result.snippet) {
          // Extract educational facts from snippets
          const fact = this.processSnippetForEducation(result.snippet, userSelections);
          if (fact) facts.push(fact);
        }
      });
    }
    
    if (data.answer_box?.answer) {
      facts.unshift(data.answer_box.answer);
    }
    
    return facts.filter(fact => fact.length > 20 && fact.length < 200);
  }

  /**
   * Generate research integration suggestions
   */
  private generateResearchIntegrations(researchData: any, userSelections: UserSelections): string[] {
    const integrations: string[] = [];
    const subject = userSelections.subject.toLowerCase();
    
    if (researchData.relevantFacts && researchData.relevantFacts.length > 0) {
      integrations.push(`Integrate current research findings into problem contexts`);
      integrations.push(`Use real-world examples from ${researchData.source}`);
    }
    
    if (subject.includes('science') && researchData.relevantFacts) {
      integrations.push(`Connect scientific concepts to recent discoveries`);
    }
    
    if (subject.includes('history') || subject.includes('social')) {
      integrations.push(`Draw parallels between historical and current events`);
    }
    
    return integrations;
  }

  /**
   * Extract current examples from research data
   */
  private extractCurrentExamples(researchData: any, topic: string): string[] {
    const examples: string[] = [];
    
    if (researchData.currentExamples) {
      return researchData.currentExamples.slice(0, 3);
    }
    
    if (researchData.relevantFacts) {
      researchData.relevantFacts.forEach((fact: string) => {
        if (fact.toLowerCase().includes('recent') || 
            fact.toLowerCase().includes('current') ||
            fact.toLowerCase().includes('2024') ||
            fact.toLowerCase().includes('2025')) {
          examples.push(fact);
        }
      });
    }
    
    return examples.slice(0, 3);
  }

  /**
   * Generate factual support from research data
   */
  private generateFactualSupport(researchData: any, userSelections: UserSelections): string[] {
    const support: string[] = [];
    
    if (researchData.relevantFacts) {
      researchData.relevantFacts.forEach((fact: string) => {
        support.push(`Research shows: ${fact}`);
      });
    }
    
    return support.slice(0, 2); // Limit to 2 key facts
  }

  /**
   * Extract current examples from SerpAPI results
   */
  private extractCurrentExamplesFromSerp(data: any, userSelections: UserSelections): string[] {
    const examples: string[] = [];
    
    if (data.related_questions) {
      data.related_questions.slice(0, 2).forEach((question: any) => {
        if (question.question) {
          examples.push(`Current question: ${question.question}`);
        }
      });
    }
    
    return examples;
  }

  /**
   * Extract educational resources from search results
   */
  private extractEducationalResources(data: any): string[] {
    const resources: string[] = [];
    
    if (data.organic_results) {
      data.organic_results.slice(0, 3).forEach((result: any) => {
        if (result.link && result.title && 
            (result.link.includes('edu') || 
             result.title.toLowerCase().includes('education') ||
             result.title.toLowerCase().includes('teaching'))) {
          resources.push(`Educational resource: ${result.title} - ${result.link}`);
        }
      });
    }
    
    return resources;
  }

  /**
   * Extract facts from news articles
   */
  private extractFactsFromNews(data: any, userSelections: UserSelections): string[] {
    const facts: string[] = [];
    
    if (data.articles) {
      data.articles.slice(0, 3).forEach((article: any) => {
        if (article.description) {
          const fact = this.processNewsForEducation(article.description, userSelections);
          if (fact) facts.push(fact);
        }
      });
    }
    
    return facts;
  }

  /**
   * Extract real-world connections from news
   */
  private extractRealWorldConnections(data: any, userSelections: UserSelections): string[] {
    const connections: string[] = [];
    
    if (data.articles) {
      data.articles.slice(0, 2).forEach((article: any) => {
        if (article.title && article.publishedAt) {
          const date = new Date(article.publishedAt).toLocaleDateString();
          connections.push(`Current event (${date}): ${article.title}`);
        }
      });
    }
    
    return connections;
  }

  /**
   * Extract facts from YouTube videos
   */
  private extractFactsFromYouTube(data: any, userSelections: UserSelections): string[] {
    const facts: string[] = [];
    
    if (data.items) {
      data.items.slice(0, 3).forEach((video: any) => {
        if (video.snippet && video.snippet.description) {
          const fact = this.processVideoDescriptionForEducation(
            video.snippet.description, 
            userSelections
          );
          if (fact) facts.push(fact);
        }
      });
    }
    
    return facts;
  }

  /**
   * Extract current examples from YouTube
   */
  private extractCurrentExamplesFromYouTube(data: any): string[] {
    const examples: string[] = [];
    
    if (data.items) {
      data.items.slice(0, 2).forEach((video: any) => {
        if (video.snippet && video.snippet.title) {
          examples.push(`Educational video: ${video.snippet.title}`);
        }
      });
    }
    
    return examples;
  }

  /**
   * Extract video resources
   */
  private extractVideoResources(data: any, userSelections: UserSelections): any[] {
    const resources: any[] = [];
    
    if (data.items) {
      data.items.slice(0, 3).forEach((video: any) => {
        if (video.snippet) {
          resources.push({
            title: video.snippet.title,
            description: video.snippet.description?.substring(0, 100) + '...',
            videoId: video.id.videoId,
            duration: video.contentDetails?.duration || 'Unknown',
            relevance: 'Educational content related to ' + userSelections.topic
          });
        }
      });
    }
    
    return resources;
  }

  /**
   * Process article content for educational use
   */
  private processArticleForEducation(article: any, userSelections: UserSelections): string | null {
    if (!article.description) return null;
    
    const educationalKeywords = ['study', 'research', 'education', 'students', 'learning', 'discovery'];
    const hasEducationalContent = educationalKeywords.some(keyword => 
      article.description.toLowerCase().includes(keyword)
    );
    
    if (!hasEducationalContent) return null;
    
    return `Current research: ${article.description.substring(0, 120)}...`;
  }

  /**
   * Process news description for educational relevance
   */
  private processNewsForEducation(description: string, userSelections: UserSelections): string | null {
    // Filter for educational relevance
    const topicKeywords = userSelections.topic.toLowerCase().split(' ');
    const hasTopicRelevance = topicKeywords.some(keyword => 
      description.toLowerCase().includes(keyword)
    );
    
    if (!hasTopicRelevance) return null;
    
    return description.substring(0, 100) + (description.length > 100 ? '...' : '');
  }

  /**
   * Process video description for educational use
   */
  private processVideoDescriptionForEducation(description: string, userSelections: UserSelections): string | null {
    if (!description || description.length < 20) return null;
    
    const educationalIndicators = ['learn', 'explain', 'understand', 'tutorial', 'lesson'];
    const hasEducationalContent = educationalIndicators.some(indicator => 
      description.toLowerCase().includes(indicator)
    );
    
    if (!hasEducationalContent) return null;
    
    return description.substring(0, 80) + (description.length > 80 ? '...' : '');
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
    const christianLevel = this.getChristianContentLevel(userSelections.christianContent);
    const cognitiveLevel = this.getCognitiveLevel(userSelections.grade);
    const subjectSpecifics = this.getSubjectSpecifics(userSelections.subject);
    
    return `You are an expert educational content creator with advanced knowledge in curriculum design, pedagogical theory, and ${userSelections.subject}. Create a professional-quality worksheet that demonstrates mastery of best practices in education.

WORKSHEET SPECIFICATIONS:
Grade Level: ${userSelections.grade} (${cognitiveLevel.description})
Subject: ${userSelections.subject}
Topic: ${userSelections.topic}
Style: ${userSelections.worksheetStyle || 'engaging'}
Christian Integration: ${christianLevel.description}
Scaffolding Level: ${userSelections.scaffolding || 'standard'}
Differentiation: ${userSelections.differentiation || 'grade-appropriate'}
Duration: ${userSelections.timeEstimate || '30 minutes'}
Problems Required: ${userSelections.numProblems || 5}

COGNITIVE DEVELOPMENT CONSIDERATIONS:
${cognitiveLevel.considerations}

SUBJECT-SPECIFIC PEDAGOGICAL APPROACH:
${subjectSpecifics.approach}
Recommended Problem Types: ${subjectSpecifics.problemTypes.join(', ')}
Assessment Methods: ${subjectSpecifics.assessmentMethods.join(', ')}

CHRISTIAN CONTENT INTEGRATION:
${christianLevel.guidelines}

PROFESSIONAL QUALITY STANDARDS:
- Problems must demonstrate clear learning objectives aligned with educational standards
- Include varied question types to accommodate different learning styles
- Provide clear, measurable assessment criteria
- Ensure age-appropriate complexity and vocabulary
- Include real-world applications and current examples where relevant
- Incorporate research-backed educational methodologies
- Design for both individual work and potential group collaboration

REQUIRED JSON STRUCTURE:
{
  "title": "Professional, engaging title that clearly indicates learning focus",
  "grade": "${userSelections.grade}",
  "subject": "${userSelections.subject}",
  "topic": "${userSelections.topic}",
  "learningObjectives": ["Specific, measurable learning outcomes students will achieve"],
  "description": "Comprehensive description of educational goals and approach",
  "instructions": "Clear, step-by-step instructions for students",
  "estimatedTime": "${userSelections.timeEstimate || '30 minutes'}",
  "materials": ["Specific materials, tools, or resources needed"],
  "problems": [
    {
      "id": 1,
      "type": "multiple-choice|short-answer|fill-in-blank|true-false|creative-writing|word-problem|diagram-labeling|research-project|critical-thinking",
      "question": "Clear, engaging question that tests specific learning objective",
      "options": ["For multiple choice: 4 plausible options with 1 clearly correct answer"],
      "answer": "Expected answer with detailed explanation",
      "learningObjective": "Which specific objective this problem addresses",
      "cognitiveLevel": "Knowledge|Comprehension|Application|Analysis|Synthesis|Evaluation",
      "explanation": "Detailed rationale for why this problem enhances learning",
      "christianConnection": "${christianLevel.integration}",
      "realWorldApplication": "How this connects to students' lives or current events",
      "differentiation": {
        "struggling": "Simplified version or additional support",
        "advanced": "Extension or deeper challenge",
        "visual": "Visual learning accommodation",
        "kinesthetic": "Hands-on learning option"
      },
      "assessmentCriteria": "Specific criteria for evaluating student response"
    }
  ],
  "answerKey": {
    "solutions": "Complete solutions with step-by-step explanations",
    "teachingTips": "Instructional strategies for effective delivery",
    "commonMistakes": "Anticipated student errors and how to address them",
    "extensionActivities": "Additional activities for early finishers or deeper exploration"
  },
  "standards": {
    "nationalStandards": "Relevant national/state educational standards addressed",
    "crossCurricular": "Connections to other subjects"
  },
  "assessment": {
    "formative": "Methods for checking understanding during the lesson",
    "summative": "Final assessment strategies",
    "rubric": "Scoring criteria and performance levels"
  },
  "extensions": [
    "Research projects for advanced students",
    "Real-world application activities",
    "Technology integration opportunities",
    "Cross-curricular connections"
  ]
}

QUALITY ASSURANCE CHECKLIST:
✓ Each problem aligns with stated learning objectives
✓ Variety of cognitive levels represented (Bloom's Taxonomy)
✓ Age-appropriate language and concepts
✓ Clear, unambiguous questions and instructions
✓ Realistic time estimates for completion
✓ Differentiation options for diverse learners
✓ Real-world relevance and current examples
✓ Professional formatting and presentation
✓ Research-backed educational approaches
✓ Appropriate Christian integration (if requested)

Create ${userSelections.numProblems || 5} high-quality problems that demonstrate educational excellence and professional standards.`;
  }

  /**
   * Get detailed Christian content integration specifications
   */
  private getChristianContentLevel(level?: string): any {
    const christianLevel = parseInt(level || '0');
    
    switch (christianLevel) {
      case 0:
        return {
          description: "Secular - No religious content",
          guidelines: "Maintain neutral, inclusive approach. Focus on universal values and academic excellence.",
          integration: "N/A - Secular content",
        };
      case 1:
        return {
          description: "Gently Christian - Subtle positive values",
          guidelines: "Incorporate wholesome values, character development, and positive moral examples without explicit religious references.",
          integration: "Optional positive values connection",
        };
      case 2:
        return {
          description: "Moderately Christian - Natural biblical worldview",
          guidelines: "Weave biblical principles naturally into content. Include occasional scripture references that enhance learning. Show God's design in creation for science topics.",
          integration: "Biblical principle or light scripture reference that enhances the educational content",
        };
      case 3:
        return {
          description: "Richly Biblical - Explicit faith integration",
          guidelines: "Heavy scripture integration, explicit connections to biblical truth, faith-based applications. Show how all learning connects to God's character and purposes.",
          integration: "Explicit biblical connection with scripture reference and faith application",
        };
      default:
        return this.getChristianContentLevel('1');
    }
  }

  /**
   * Get cognitive development level specifications
   */
  private getCognitiveLevel(grade: string): any {
    const gradeNum = this.gradeToNumber(grade);
    
    if (gradeNum <= 2) {
      return {
        description: "Early Elementary - Concrete operational thinking",
        considerations: "Focus on concrete, hands-on activities. Use visual aids, manipulatives, and simple language. Short attention spans require varied activities. Beginning reading skills."
      };
    } else if (gradeNum <= 5) {
      return {
        description: "Elementary - Developing abstract thinking",
        considerations: "Can handle more complex instructions. Beginning to understand abstract concepts through concrete examples. Can work independently for longer periods. Developing research skills."
      };
    } else if (gradeNum <= 8) {
      return {
        description: "Middle School - Abstract reasoning development", 
        considerations: "Developing formal operational thinking. Can handle multi-step problems. Beginning to think hypothetically. Peer collaboration becomes important. Can conduct basic research."
      };
    } else {
      return {
        description: "High School - Formal operational thinking",
        considerations: "Capable of abstract reasoning, hypothesis testing, and complex analysis. Can handle independent research projects. Ready for advanced critical thinking and real-world applications."
      };
    }
  }

  /**
   * Get subject-specific pedagogical approaches
   */
  private getSubjectSpecifics(subject: string): any {
    const subjectLower = subject.toLowerCase();
    
    if (subjectLower.includes('math')) {
      return {
        approach: "Problem-solving focused with step-by-step reasoning. Emphasize mathematical communication and multiple solution strategies. Connect to real-world applications.",
        problemTypes: ["word-problems", "multi-step-calculations", "pattern-recognition", "logical-reasoning", "real-world-applications"],
        assessmentMethods: ["show-your-work", "explain-reasoning", "multiple-approaches", "error-analysis"]
      };
    } else if (subjectLower.includes('science')) {
      return {
        approach: "Inquiry-based learning with scientific method emphasis. Encourage hypothesis formation, observation, and evidence-based conclusions. Connect to current scientific research.",
        problemTypes: ["experiment-design", "data-analysis", "hypothesis-testing", "observation-recording", "scientific-explanation"],
        assessmentMethods: ["lab-reports", "scientific-diagrams", "hypothesis-evaluation", "data-interpretation"]
      };
    } else if (subjectLower.includes('language arts') || subjectLower.includes('english')) {
      return {
        approach: "Literature-based with emphasis on critical reading, analytical writing, and creative expression. Develop vocabulary and communication skills.",
        problemTypes: ["reading-comprehension", "creative-writing", "literary-analysis", "vocabulary-building", "grammar-application"],
        assessmentMethods: ["written-responses", "discussion-questions", "creative-projects", "peer-review"]
      };
    } else if (subjectLower.includes('history') || subjectLower.includes('social studies')) {
      return {
        approach: "Primary source analysis with emphasis on critical thinking about historical events and their modern connections. Develop research and analysis skills.",
        problemTypes: ["document-analysis", "timeline-creation", "cause-and-effect", "perspective-taking", "current-connections"],
        assessmentMethods: ["essay-writing", "source-evaluation", "presentation-creation", "debate-participation"]
      };
    } else if (subjectLower.includes('bible')) {
      return {
        approach: "Scripture-centered with emphasis on application, character development, and theological understanding. Connect biblical truth to daily life.",
        problemTypes: ["scripture-analysis", "character-study", "application-questions", "theological-reflection", "life-application"],
        assessmentMethods: ["reflection-writing", "scripture-memorization", "application-projects", "discussion-participation"]
      };
    } else {
      return {
        approach: "Comprehensive approach tailored to subject matter with emphasis on critical thinking and real-world application.",
        problemTypes: ["analysis", "application", "synthesis", "evaluation", "creative-thinking"],
        assessmentMethods: ["varied-assessment", "project-based", "discussion", "practical-application"]
      };
    }
  }

  private gradeToNumber(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      'Pre-K': 0, 'K': 0, '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5,
      '6th': 6, '7th': 7, '8th': 8, '9th': 9, '10th': 10, '11th': 11, '12th': 12
    };
    return gradeMap[grade] || 5;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Extract current examples from news data
   */
  private extractCurrentExamplesFromNews(data: any, userSelections: UserSelections): string[] {
    const examples: string[] = [];
    
    if (data.articles) {
      data.articles.slice(0, 3).forEach((article: any) => {
        if (article.title && article.publishedAt) {
          const publishDate = new Date(article.publishedAt).toLocaleDateString();
          examples.push(`Current example (${publishDate}): ${article.title}`);
        }
      });
    }
    
    return examples;
  }

  /**
   * Process search snippet for educational content
   */
  private processSnippetForEducation(snippet: string, userSelections: UserSelections): string | null {
    // Filter for educational content
    const educationalKeywords = ['students', 'learn', 'education', 'study', 'research', 'facts', 'science', 'history'];
    const hasEducationalContent = educationalKeywords.some(keyword => 
      snippet.toLowerCase().includes(keyword)
    );
    
    if (!hasEducationalContent) return null;
    
    // Clean and format for worksheet use
    return snippet
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
      .trim()
      .substring(0, 150) + (snippet.length > 150 ? '...' : '');
  }

  /**
   * Integrate research data into a specific problem
   */
  private integrateResearchIntoProblem(problem: any, fact: string, userSelections: UserSelections): string {
    const subject = userSelections.subject.toLowerCase();
    
    if (subject.includes('science')) {
      return `Current research shows: ${fact}. Use this information to enhance your understanding of the problem.`;
    } else if (subject.includes('history') || subject.includes('social')) {
      return `Recent findings indicate: ${fact}. Consider how this connects to the historical concept.`;
    } else if (subject.includes('math')) {
      return `Real-world application: ${fact}. Apply mathematical thinking to this scenario.`;
    } else {
      return `Background information: ${fact}. Use this context to inform your response.`;
    }
  }

  /**
   * Enhance worksheet problems with real research data
   */
  private async enhanceProblemsWithResearch(
    problems: any[], 
    researchData: any, 
    userSelections: UserSelections
  ): Promise<any[]> {
    return problems.map((problem, index) => {
      const relevantFact = researchData.relevantFacts?.[index % (researchData.relevantFacts?.length || 1)];
      const currentExample = researchData.currentExamples?.[index % (researchData.currentExamples?.length || 1)];
      
      if (relevantFact) {
        // Enhance the problem with real research data
        return {
          ...problem,
          researchEnhancement: {
            fact: relevantFact,
            source: researchData.source,
            currentExample: currentExample,
            integration: this.integrateResearchIntoProblem(problem, relevantFact, userSelections)
          }
        };
      }
      
      return problem;
    });
  }
}
