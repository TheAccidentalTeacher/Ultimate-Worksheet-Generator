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
    const { subject, grade, topic, christianContent, timeEstimate, numProblems } = userSelections;
    
    // Determine complexity level
    const complexity = this.calculateComplexity(grade, subject, numProblems);
    
    // Select primary content API
    const primary = this.selectPrimaryContentAPI(subject, complexity);
    
    // Determine visual needs
    const visual = this.selectVisualAPI(subject, grade, topic);
    
    // Check if research is needed
    const research = this.needsResearch(subject, grade, complexity) ? this.selectResearchAPI(subject) : undefined;
    
    // Check if social/community content helps
    const social = this.needsSocialContent(subject, grade) ? this.selectSocialAPI(subject) : undefined;
    
    // Set up fallback chain
    const backup = this.createBackupChain(primary);
    
    // Enhancement APIs for rich content
    const enhancement = this.selectEnhancementAPIs(subject, grade, christianContent);

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
   * Calculate worksheet complexity level
   */
  private calculateComplexity(grade: string, subject: string, numProblems?: number): 'basic' | 'intermediate' | 'advanced' {
    const gradeNum = this.gradeToNumber(grade);
    const problemCount = numProblems || 5;
    
    // Advanced subjects or higher grades = more complex
    const advancedSubjects = ['Physics', 'Chemistry', 'Calculus', 'Advanced Biology', 'AP History'];
    const isAdvancedSubject = advancedSubjects.some(adv => subject.includes(adv));
    
    if (gradeNum >= 9 || isAdvancedSubject || problemCount > 15) return 'advanced';
    if (gradeNum >= 6 || problemCount > 8) return 'intermediate';
    return 'basic';
  }

  /**
   * Select the best primary content generation API
   */
  private selectPrimaryContentAPI(subject: string, complexity: string): string {
    // For creative subjects, prefer OpenAI for its creativity
    const creativeSubjects = ['Art', 'Creative Writing', 'Music', 'Drama', 'Poetry'];
    const isCreative = creativeSubjects.some(creative => subject.includes(creative));
    
    // For technical subjects, Azure might be better for structured content
    const technicalSubjects = ['Math', 'Science', 'Physics', 'Chemistry', 'Computer Science'];
    const isTechnical = technicalSubjects.some(tech => subject.includes(tech));
    
    if (isCreative) return 'OPENAI_API_KEY';
    if (isTechnical && complexity === 'advanced') return 'AZURE_AI_FOUNDRY_KEY';
    
    // Default to OpenAI for most educational content
    return 'OPENAI_API_KEY';
  }

  /**
   * Select visual API based on subject and requirements
   */
  private selectVisualAPI(subject: string, grade: string, topic: string): string | undefined {
    const gradeNum = this.gradeToNumber(grade);
    
    // Younger grades need more visuals
    if (gradeNum <= 3) {
      // Art/creative subjects need custom generation
      if (subject.includes('Art') || topic.includes('coloring') || topic.includes('drawing')) {
        return 'STABILITY_AI_API_KEY';
      }
      // Educational photos for other subjects
      return 'UNSPLASH_ACCESS_KEY';
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
   * Determine if research APIs would enhance the worksheet
   */
  private needsResearch(subject: string, grade: string, complexity: string): boolean {
    const gradeNum = this.gradeToNumber(grade);
    
    // Advanced grades benefit from research
    if (gradeNum >= 8 && complexity !== 'basic') return true;
    
    // Research-heavy subjects
    const researchSubjects = ['History', 'Social Studies', 'Science', 'Current Events', 'Geography'];
    return researchSubjects.some(research => subject.includes(research));
  }

  /**
   * Select the best research API
   */
  private selectResearchAPI(subject: string): string {
    // Academic subjects benefit from scholarly research
    if (subject.includes('History') || subject.includes('Science') || subject.includes('Literature')) {
      return 'SERPAPI_KEY';
    }
    
    // Current events and social studies use news
    if (subject.includes('Social Studies') || subject.includes('Current Events') || subject.includes('Geography')) {
      return 'NEWS_API_KEY';
    }
    
    return 'SERPAPI_KEY'; // Default to academic research
  }

  /**
   * Determine if social/community content would help
   */
  private needsSocialContent(subject: string, grade: string): boolean {
    const gradeNum = this.gradeToNumber(grade);
    
    // Older students benefit from real-world examples
    if (gradeNum >= 7) {
      const socialSubjects = ['Social Studies', 'Current Events', 'Psychology', 'Sociology', 'Communications'];
      return socialSubjects.some(social => subject.includes(social));
    }
    
    return false;
  }

  /**
   * Select social/community API
   */
  private selectSocialAPI(subject: string): string {
    // Discussion-based subjects use Reddit for examples
    if (subject.includes('Social Studies') || subject.includes('Psychology') || subject.includes('Ethics')) {
      return 'REDDIT_CLIENT_ID';
    }
    
    // Engagement through animations
    return 'GIPHY_API_KEY';
  }

  /**
   * Create intelligent backup API chain
   */
  private createBackupChain(primary: string): string[] {
    const backupChains: { [key: string]: string[] } = {
      'OPENAI_API_KEY': ['AZURE_AI_FOUNDRY_KEY', 'AZURE_AI_FOUNDRY_KEY_2'],
      'AZURE_AI_FOUNDRY_KEY': ['OPENAI_API_KEY', 'AZURE_AI_FOUNDRY_KEY_2'],
      'AZURE_AI_FOUNDRY_KEY_2': ['OPENAI_API_KEY', 'AZURE_AI_FOUNDRY_KEY'],
      'STABILITY_AI_API_KEY': ['REPLICATE_API_TOKEN', 'UNSPLASH_ACCESS_KEY'],
      'UNSPLASH_ACCESS_KEY': ['PEXELS_API_KEY', 'PIXABAY_API_KEY'],
      'SERPAPI_KEY': ['NEWS_API_KEY', 'YOUTUBE_API_KEY']
    };
    
    return backupChains[primary] || [];
  }

  /**
   * Select enhancement APIs for richer content
   */
  private selectEnhancementAPIs(subject: string, grade: string, christianContent: string): string[] {
    const enhancements: string[] = [];
    const gradeNum = this.gradeToNumber(grade);
    
    // Bible studies always get religious image enhancement
    if (subject.includes('Bible') || subject.includes('Christian') || parseInt(christianContent) >= 2) {
      enhancements.push('UNSPLASH_ACCESS_KEY'); // For biblical imagery
    }
    
    // Science gets animations for processes
    if (subject.includes('Science') && gradeNum >= 4) {
      enhancements.push('GIPHY_API_KEY');
    }
    
    // Older students get video recommendations
    if (gradeNum >= 6) {
      enhancements.push('YOUTUBE_API_KEY');
    }
    
    return enhancements;
  }

  /**
   * Convert grade string to number for logic
   */
  private gradeToNumber(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      'Pre-K': 0, 'K': 0, '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5,
      '6th': 6, '7th': 7, '8th': 8, '9th': 9, '10th': 10, '11th': 11, '12th': 12
    };
    
    return gradeMap[grade] || 5; // Default to 5th grade
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
