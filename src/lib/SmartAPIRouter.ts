// Smart API Router for Worksheet Generator
// This system intelligently selects the best APIs based on worksheet requirements

import { UserSelections } from './types';

export interface APIStrategy {
  primary: string;
  visual?: string;
  research?: string;
  social?: string;
  backup: string[];
  enhancement: string[];
}

export class SmartAPIRouter {
  private availableAPIs = {
    content: ['OPENAI_API_KEY', 'AZURE_AI_FOUNDRY_KEY', 'AZURE_AI_FOUNDRY_KEY_2'],
    visual: ['STABILITY_AI_API_KEY', 'REPLICATE_API_TOKEN', 'UNSPLASH_ACCESS_KEY', 'PEXELS_API_KEY', 'PIXABAY_API_KEY'],
    research: ['SERPAPI_KEY', 'NEWS_API_KEY', 'YOUTUBE_API_KEY'],
    social: ['REDDIT_CLIENT_ID', 'GIPHY_API_KEY'],
    animation: ['GIPHY_API_KEY']
  };

  /**
   * Determines the optimal API strategy based on worksheet requirements
   */
  public selectAPIStrategy(userSelections: UserSelections): APIStrategy {
    const { subject, grade, topic, christianContent, timeEstimate, numProblems, worksheetStyle } = userSelections;
    
    // Analyze content requirements
    const contentAnalysis = this.analyzeContentRequirements(userSelections);
    
    // Determine complexity level
    const complexity = this.calculateComplexity(grade, subject, numProblems, contentAnalysis);
    
    // Select primary content API with sophisticated logic
    const primary = this.selectPrimaryContentAPI(subject, complexity, contentAnalysis);
    
    // Determine visual needs with enhanced logic
    const visual = this.selectVisualAPI(subject, grade, topic, worksheetStyle, contentAnalysis);
    
    // Enhanced research decision making
    const research = this.shouldUseResearch(userSelections, complexity, contentAnalysis) 
      ? this.selectResearchAPI(subject, contentAnalysis) 
      : undefined;
    
    // Social/community content analysis
    const social = this.shouldUseSocialContent(userSelections, contentAnalysis) 
      ? this.selectSocialAPI(subject, contentAnalysis) 
      : undefined;
    
    // Intelligent fallback chain creation
    const backup = this.createIntelligentBackupChain(primary, complexity, contentAnalysis);
    
    // Enhancement APIs with smart selection
    const enhancement = this.selectEnhancementAPIs(subject, grade, christianContent, contentAnalysis);

    return {
      primary,
      visual,
      research,
      social,
      backup,
      enhancement
    };
  }

  /**
   * Analyze content requirements to inform API selection
   */
  private analyzeContentRequirements(userSelections: UserSelections): any {
    const { subject, topic, grade, worksheetStyle, differentiation } = userSelections;
    const gradeNum = this.gradeToNumber(grade);
    
    return {
      creativityLevel: this.assessCreativityNeeds(subject, topic, worksheetStyle),
      technicalComplexity: this.assessTechnicalComplexity(subject, topic, gradeNum),
      researchDepth: this.assessResearchNeeds(subject, topic, gradeNum),
      visualRequirement: this.assessVisualNeeds(subject, topic, gradeNum, differentiation),
      currentEventsRelevance: this.assessCurrentEventsRelevance(subject, topic),
      interactivityLevel: this.assessInteractivityNeeds(gradeNum, worksheetStyle),
      realWorldApplication: this.assessRealWorldNeeds(subject, topic, gradeNum)
    };
  }

  /**
   * Assess creativity needs for content generation
   */
  private assessCreativityNeeds(subject: string, topic: string, worksheetStyle?: string): 'low' | 'medium' | 'high' {
    const creativeSubjects = ['art', 'creative writing', 'music', 'drama', 'poetry', 'literature'];
    const creativeTopics = ['story', 'creative', 'imaginative', 'design', 'artistic'];
    const creativeStyles = ['creative', 'artistic', 'imaginative'];
    
    if (creativeSubjects.some(s => subject.toLowerCase().includes(s)) ||
        creativeTopics.some(t => topic.toLowerCase().includes(t)) ||
        creativeStyles.some(s => worksheetStyle?.toLowerCase().includes(s))) {
      return 'high';
    }
    
    if (subject.toLowerCase().includes('language arts') || 
        topic.toLowerCase().includes('writing') ||
        worksheetStyle?.toLowerCase().includes('engaging')) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Assess technical complexity requirements
   */
  private assessTechnicalComplexity(subject: string, topic: string, gradeNum: number): 'low' | 'medium' | 'high' {
    const highTechSubjects = ['physics', 'chemistry', 'calculus', 'computer science', 'engineering'];
    const mediumTechSubjects = ['math', 'algebra', 'geometry', 'biology', 'economics'];
    
    if (highTechSubjects.some(s => subject.toLowerCase().includes(s)) || gradeNum >= 11) {
      return 'high';
    }
    
    if (mediumTechSubjects.some(s => subject.toLowerCase().includes(s)) || gradeNum >= 6) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Assess research depth requirements
   */
  private assessResearchNeeds(subject: string, topic: string, gradeNum: number): 'none' | 'basic' | 'moderate' | 'extensive' {
    const researchHeavySubjects = ['history', 'social studies', 'current events', 'science', 'literature'];
    const currentTopics = ['current', 'recent', 'modern', 'today', '2024', '2025'];
    
    if (gradeNum >= 9 && (
        researchHeavySubjects.some(s => subject.toLowerCase().includes(s)) ||
        currentTopics.some(t => topic.toLowerCase().includes(t))
    )) {
      return 'extensive';
    }
    
    if (gradeNum >= 6 && researchHeavySubjects.some(s => subject.toLowerCase().includes(s))) {
      return 'moderate';
    }
    
    if (gradeNum >= 4 && currentTopics.some(t => topic.toLowerCase().includes(t))) {
      return 'basic';
    }
    
    return 'none';
  }

  /**
   * Assess visual learning needs
   */
  private assessVisualNeeds(subject: string, topic: string, gradeNum: number, differentiation?: string): 'low' | 'medium' | 'high' {
    // Visual learners need high visual support
    if (differentiation?.includes('visual')) return 'high';
    
    // Younger grades need more visuals
    if (gradeNum <= 3) return 'high';
    
    // Visual subjects
    const visualSubjects = ['art', 'science', 'geography', 'biology', 'math', 'geometry'];
    if (visualSubjects.some(s => subject.toLowerCase().includes(s))) return 'high';
    
    // Visual topics
    const visualTopics = ['diagram', 'chart', 'map', 'structure', 'system', 'process'];
    if (visualTopics.some(t => topic.toLowerCase().includes(t))) return 'medium';
    
    return 'low';
  }

  /**
   * Assess current events relevance
   */
  private assessCurrentEventsRelevance(subject: string, topic: string): 'none' | 'low' | 'medium' | 'high' {
    const currentKeywords = ['current', 'recent', 'today', 'modern', '2024', '2025', 'contemporary'];
    const currentSubjects = ['social studies', 'history', 'current events', 'politics', 'economics'];
    
    if (currentKeywords.some(k => topic.toLowerCase().includes(k))) return 'high';
    if (currentSubjects.some(s => subject.toLowerCase().includes(s))) return 'medium';
    
    return 'none';
  }

  /**
   * Assess interactivity needs
   */
  private assessInteractivityNeeds(gradeNum: number, worksheetStyle?: string): 'low' | 'medium' | 'high' {
    if (worksheetStyle?.includes('interactive') || worksheetStyle?.includes('engaging')) return 'high';
    if (gradeNum <= 5) return 'high'; // Younger students need more interactivity
    if (gradeNum <= 8) return 'medium';
    return 'low';
  }

  /**
   * Assess real-world application needs
   */
  private assessRealWorldNeeds(subject: string, topic: string, gradeNum: number): 'low' | 'medium' | 'high' {
    const practicalSubjects = ['math', 'science', 'economics', 'health', 'life skills'];
    const realWorldTopics = ['application', 'real world', 'practical', 'everyday', 'career'];
    
    if (gradeNum >= 9 && practicalSubjects.some(s => subject.toLowerCase().includes(s))) return 'high';
    if (realWorldTopics.some(t => topic.toLowerCase().includes(t))) return 'high';
    if (gradeNum >= 6) return 'medium';
    
    return 'low';
  }

  /**
   * Enhanced primary API selection with sophisticated logic
   */
  private selectPrimaryContentAPI(subject: string, complexity: string, contentAnalysis: any): string {
    // High creativity needs favor OpenAI
    if (contentAnalysis.creativityLevel === 'high') {
      return 'OPENAI_API_KEY';
    }
    
    // High technical complexity with advanced grades
    if (contentAnalysis.technicalComplexity === 'high' && complexity === 'advanced') {
      return 'AZURE_AI_FOUNDRY_KEY'; // Better for structured, technical content
    }
    
    // Moderate technical with research needs
    if (contentAnalysis.technicalComplexity === 'medium' && 
        contentAnalysis.researchDepth !== 'none') {
      return 'AZURE_AI_FOUNDRY_KEY_2'; // Secondary Azure for research-heavy technical
    }
    
    // Default to OpenAI for most educational content (best for general education)
    return 'OPENAI_API_KEY';
  }

  /**
   * Calculate worksheet complexity level (enhanced)
   */
  private calculateComplexity(grade: string, subject: string, numProblems?: number, contentAnalysis?: any): 'basic' | 'intermediate' | 'advanced' {
    const gradeNum = this.gradeToNumber(grade);
    const problemCount = numProblems || 5;
    
    // Use content analysis if available
    if (contentAnalysis) {
      if (contentAnalysis.technicalComplexity === 'high' || 
          contentAnalysis.researchDepth === 'extensive') {
        return 'advanced';
      }
      if (contentAnalysis.technicalComplexity === 'medium' || 
          contentAnalysis.researchDepth === 'moderate') {
        return 'intermediate';
      }
    }
    
    // Advanced subjects or higher grades = more complex
    const advancedSubjects = ['Physics', 'Chemistry', 'Calculus', 'Advanced Biology', 'AP History'];
    const isAdvancedSubject = advancedSubjects.some(adv => subject.includes(adv));
    
    if (gradeNum >= 9 || isAdvancedSubject || problemCount > 15) return 'advanced';
    if (gradeNum >= 6 || problemCount > 8) return 'intermediate';
    return 'basic';
  }

  /**
   * Enhanced visual API selection
   */
  private selectVisualAPI(subject: string, grade: string, topic: string, worksheetStyle?: string, contentAnalysis?: any): string | undefined {
    const gradeNum = this.gradeToNumber(grade);
    
    // Use content analysis if available
    if (contentAnalysis && contentAnalysis.visualRequirement === 'low') {
      return undefined; // No visual needed
    }
    
    // Younger grades need more visuals
    if (gradeNum <= 3) {
      // Art/creative subjects need custom generation
      if (subject.includes('Art') || topic.includes('coloring') || topic.includes('drawing')) {
        return 'STABILITY_AI_API_KEY';
      }
      // Educational photos for other subjects
      return 'UNSPLASH_ACCESS_KEY';
    }
    
    // High creativity needs custom generation
    if (contentAnalysis && contentAnalysis.creativityLevel === 'high') {
      return 'STABILITY_AI_API_KEY';
    }
    
    // Science benefits from photos and animations
    if (subject.includes('Science') || subject.includes('Biology') || subject.includes('Chemistry')) {
      return Math.random() > 0.5 ? 'UNSPLASH_ACCESS_KEY' : 'PEXELS_API_KEY';
    }
    
    // Math can use custom diagrams
    if (subject.includes('Math') && gradeNum >= 4) {
      return 'STABILITY_AI_API_KEY';
    }
    
    // History/Social Studies use stock photos
    if (subject.includes('History') || subject.includes('Social Studies')) {
      return 'PIXABAY_API_KEY'; // Often has good historical content
    }
    
    // Default for visual enhancement
    return 'UNSPLASH_ACCESS_KEY';
  }

  /**
   * Enhanced research API selection
   */
  private selectResearchAPI(subject: string, contentAnalysis?: any): string {
    // Academic subjects benefit from scholarly research
    if (subject.includes('History') || subject.includes('Science') || subject.includes('Literature')) {
      return 'SERPAPI_KEY'; // Best for academic research
    }
    
    // Current events and social studies
    if (subject.includes('Social Studies') || subject.includes('Current Events') ||
        (contentAnalysis && contentAnalysis.currentEventsRelevance === 'high')) {
      return 'NEWS_API_KEY'; // Best for current events
    }
    
    // Educational content with video resources
    if (contentAnalysis && contentAnalysis.interactivityLevel === 'high') {
      return 'YOUTUBE_API_KEY'; // Educational videos
    }
    
    // Default research API
    return 'SERPAPI_KEY';
  }

  /**
   * Enhanced social API selection
   */
  private selectSocialAPI(subject: string, contentAnalysis?: any): string {
    // Interactive and engaging content
    if (contentAnalysis && contentAnalysis.interactivityLevel === 'high') {
      return 'GIPHY_API_KEY'; // Animations and engagement
    }
    
    // Social studies and current events
    if (subject.includes('Social') || subject.includes('Current')) {
      return 'REDDIT_CLIENT_ID'; // Community insights
    }
    
    // Default social API
    return 'GIPHY_API_KEY';
  }

  /**
   * Enhanced enhancement API selection
   */
  private selectEnhancementAPIs(subject: string, grade: string, christianContent?: string, contentAnalysis?: any): string[] {
    const enhancements: string[] = [];
    
    // High interactivity gets animations
    if (contentAnalysis && contentAnalysis.interactivityLevel === 'high') {
      enhancements.push('GIPHY_API_KEY');
    }
    
    // Research-heavy content gets video resources
    if (contentAnalysis && contentAnalysis.researchDepth !== 'none') {
      enhancements.push('YOUTUBE_API_KEY');
    }
    
    // Current events get news integration
    if (contentAnalysis && contentAnalysis.currentEventsRelevance === 'high') {
      enhancements.push('NEWS_API_KEY');
    }
    
    return enhancements;
  }

  /**
   * Convert grade string to number for logic (enhanced)
   */
  private gradeToNumber(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      'Pre-K': 0, 'K': 0, '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5,
      '6th': 6, '7th': 7, '8th': 8, '9th': 9, '10th': 10, '11th': 11, '12th': 12
    };
    
    return gradeMap[grade] || 5; // Default to 5th grade
  }

  /**
   * Enhanced research decision making
   */
  private shouldUseResearch(userSelections: UserSelections, complexity: string, contentAnalysis: any): boolean {
    const gradeNum = this.gradeToNumber(userSelections.grade);
    
    // Always use research for extensive research needs
    if (contentAnalysis.researchDepth === 'extensive') return true;
    
    // Use research for moderate needs with advanced complexity
    if (contentAnalysis.researchDepth === 'moderate' && complexity !== 'basic') return true;
    
    // Use research for current events relevance
    if (contentAnalysis.currentEventsRelevance === 'high') return true;
    
    // Use research for high school and real-world applications
    if (gradeNum >= 9 && contentAnalysis.realWorldApplication === 'high') return true;
    
    return false;
  }

  /**
   * Enhanced social content decision making
   */
  private shouldUseSocialContent(userSelections: UserSelections, contentAnalysis: any): boolean {
    const gradeNum = this.gradeToNumber(userSelections.grade);
    
    // Social media integration for high school
    if (gradeNum >= 9 && contentAnalysis.currentEventsRelevance === 'high') return true;
    
    // Interactive content for younger grades
    if (gradeNum <= 8 && contentAnalysis.interactivityLevel === 'high') return true;
    
    return false;
  }

  /**
   * Create intelligent backup chain
   */
  private createIntelligentBackupChain(primary: string, complexity: string, contentAnalysis: any): string[] {
    const allContentAPIs = this.availableAPIs.content.filter(api => api !== primary);
    
    // For high creativity, prioritize OpenAI alternatives
    if (contentAnalysis.creativityLevel === 'high') {
      return ['OPENAI_API_KEY', 'AZURE_AI_FOUNDRY_KEY', 'AZURE_AI_FOUNDRY_KEY_2'].filter(api => api !== primary);
    }
    
    // For high technical complexity, prioritize Azure alternatives
    if (contentAnalysis.technicalComplexity === 'high') {
      return ['AZURE_AI_FOUNDRY_KEY', 'AZURE_AI_FOUNDRY_KEY_2', 'OPENAI_API_KEY'].filter(api => api !== primary);
    }
    
    // Default intelligent ordering
    return allContentAPIs;
  }

  /**
   * Get API priority explanation for debugging
   */
  public explainStrategy(strategy: APIStrategy, userSelections: UserSelections): string {
    const { subject, grade, topic } = userSelections;
    
    let explanation = `📊 **API Strategy for ${grade} ${subject} - ${topic}**\n\n`;
    explanation += `🎯 **Primary Content**: ${strategy.primary}\n`;
    if (strategy.visual) explanation += `🖼️ **Visual Enhancement**: ${strategy.visual}\n`;
    if (strategy.research) explanation += `🔍 **Research Support**: ${strategy.research}\n`;
    if (strategy.social) explanation += `👥 **Community Content**: ${strategy.social}\n`;
    explanation += `🔄 **Backup Chain**: ${strategy.backup.join(' → ')}\n`;
    explanation += `✨ **Enhancements**: ${strategy.enhancement.join(', ') || 'None'}\n`;
    
    return explanation;
  }
}

export const smartAPIRouter = new SmartAPIRouter();
