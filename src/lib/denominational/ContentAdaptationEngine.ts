import { 
  ChristianContentLevel, 
  Denomination, 
  ContentAdaptation, 
  AdaptationRule, 
  ContentFilter,
  FaithIntegrationRequest 
} from './types';
import { DENOMINATIONAL_PROFILES } from './profiles';

export class ContentAdaptationEngine {
  /**
   * Generate content adaptation configuration based on faith integration request
   */
  static generateAdaptation(request: FaithIntegrationRequest): ContentAdaptation {
    const level = request.level;
    const denomination = request.denomination || "General Christian";
    const profile = DENOMINATIONAL_PROFILES[denomination];

    return {
      level,
      denomination,
      adaptationRules: this.getAdaptationRules(level, denomination),
      contentFilters: this.getContentFilters(level, denomination),
      contextualPrompts: this.generateContextualPrompts(request, profile)
    };
  }

  /**
   * Get adaptation rules based on content level and denomination
   */
  private static getAdaptationRules(level: ChristianContentLevel, denomination: Denomination): AdaptationRule[] {
    const baseRules: AdaptationRule[] = [];
    const profile = DENOMINATIONAL_PROFILES[denomination];

    if (!profile) {
      // Return default rules when profile is not available
      return [
        {
          triggerKeywords: ["kindness", "honesty", "service"],
          denominationalFocus: "General Christian values",
          contentModification: "Emphasize character development",
          level
        }
      ];
    }

    switch (level) {
      case 0:
        // Secular content - no faith integration
        return [
          {
            triggerKeywords: ["religion", "faith", "church", "prayer", "bible"],
            denominationalFocus: "Remove or replace with neutral terms",
            contentModification: "Ensure completely secular approach",
            level: 0
          }
        ];

      case 1:
        // General Christian values
        return [
          {
            triggerKeywords: ["kindness", "honesty", "service", "helping", "caring"],
            denominationalFocus: "Frame within Christian virtue tradition",
            contentModification: "Connect to biblical principles without specific references",
            level: 1
          },
          {
            triggerKeywords: ["stewardship", "responsibility", "community"],
            denominationalFocus: profile?.theologicalEmphases.join(", ") || "Christian character development",
            contentModification: "Emphasize Christian character development",
            level: 1
          }
        ];

      case 2:
        // Biblical themes integrated naturally
        return [
          {
            triggerKeywords: ["creation", "nature", "science", "history"],
            denominationalFocus: "God as Creator and sustainer",
            contentModification: "Integrate biblical worldview naturally",
            level: 2
          },
          {
            triggerKeywords: ["wisdom", "knowledge", "learning", "truth"],
            denominationalFocus: "Scripture as source of wisdom",
            contentModification: "Reference biblical wisdom literature",
            level: 2
          },
          ...profile?.theologicalEmphases.map(emphasis => ({
            triggerKeywords: [emphasis.toLowerCase()],
            denominationalFocus: emphasis,
            contentModification: `Incorporate ${emphasis} into content naturally`,
            level: 2 as ChristianContentLevel
          }))
        ];

      case 3:
        // Explicit doctrinal content
        return [
          {
            triggerKeywords: ["doctrine", "theology", "confession", "creed"],
            denominationalFocus: denomination + " distinctive teaching",
            contentModification: "Include explicit denominational doctrine",
            level: 3
          },
          ...profile?.theologicalEmphases.map(emphasis => ({
            triggerKeywords: [emphasis.toLowerCase(), "doctrine", "teaching"],
            denominationalFocus: emphasis,
            contentModification: `Explicitly teach ${emphasis} according to ${denomination} tradition`,
            level: 3 as ChristianContentLevel
          }))
        ];

      default:
        return baseRules;
    }
  }

  /**
   * Get content filters based on level and denomination
   */
  private static getContentFilters(level: ChristianContentLevel, denomination: Denomination): ContentFilter[] {
    const profile = DENOMINATIONAL_PROFILES[denomination];
    const filters: ContentFilter[] = [];

    // Add exclusion filters for avoided topics
    profile?.avoidedTopics.forEach(topic => {
      filters.push({
        type: "exclude",
        pattern: topic.toLowerCase(),
        level
      });
    });

    // Level-specific filters
    switch (level) {
      case 0:
        filters.push(
          {
            type: "exclude",
            pattern: "religious|spiritual|biblical|christian",
            level: 0
          }
        );
        break;

      case 1:
        filters.push(
          {
            type: "modify",
            pattern: "moral|ethical|character",
            replacement: "Christian character",
            level: 1
          }
        );
        break;

      case 2:
        filters.push(
          {
            type: "include",
            pattern: "biblical|scripture|christian",
            level: 2
          }
        );
        break;

      case 3:
        filters.push(
          {
            type: "include",
            pattern: denomination.toLowerCase(),
            level: 3
          }
        );
        break;
    }

    return filters;
  }

  /**
   * Generate contextual prompts for AI content generation
   */
  private static generateContextualPrompts(
    request: FaithIntegrationRequest, 
    profile: any
  ): string[] {
    const prompts: string[] = [];
    const level = request.level;
    const denomination = request.denomination || "General Christian";

    // Base prompt for the level
    switch (level) {
      case 0:
        prompts.push("Create completely secular educational content with no religious references or implications.");
        break;

      case 1:
        prompts.push(
          "Incorporate general Christian values and character traits naturally into the content.",
          "Focus on virtues like kindness, honesty, service, and stewardship without explicit biblical references.",
          "Emphasize character development and moral reasoning from a Christian perspective."
        );
        break;

      case 2:
        prompts.push(
          "Integrate biblical themes and stories naturally into the educational content.",
          "Reference Scripture and Christian worldview where appropriate to the subject matter.",
          "Connect learning objectives to biblical principles and God's design.",
          `Approach content from a ${denomination} perspective, emphasizing: ${profile?.theologicalEmphases.slice(0, 3).join(", ")}`
        );
        break;

      case 3:
        prompts.push(
          `Create content explicitly reflecting ${denomination} doctrine and practice.`,
          `Incorporate specific ${denomination} theological distinctives: ${profile?.theologicalEmphases.join(", ")}`,
          `Use preferred Bible translation: ${profile?.preferredTranslations[0]}`,
          `Follow ${denomination} educational approaches: ${profile?.preferredApproaches.join(", ")}`
        );
        break;
    }

    // Add denomination-specific prompts
    if (level > 0 && request.denomination) {
      prompts.push(
        `Consider ${denomination} cultural considerations: ${profile?.culturalConsiderations.join(", ")}`,
        `Avoid topics that conflict with ${denomination} beliefs: ${profile?.avoidedTopics.join(", ")}`
      );
    }

    // Add specific requests
    if (request.specificRequests) {
      prompts.push(...request.specificRequests.map(req => `Specific request: ${req}`));
    }

    // Add avoided topics
    if (request.avoidTopics) {
      prompts.push(...request.avoidTopics.map(topic => `Avoid topic: ${topic}`));
    }

    return prompts;
  }

  /**
   * Apply content adaptation to generated content
   */
  static applyAdaptation(content: string, adaptation: ContentAdaptation): string {
    let adaptedContent = content;

    // Apply content filters
    adaptation.contentFilters.forEach(filter => {
      const regex = new RegExp(filter.pattern, 'gi');
      
      switch (filter.type) {
        case "exclude":
          // Remove content matching pattern
          adaptedContent = adaptedContent.replace(regex, '');
          break;
        case "modify":
          // Replace with specified replacement
          if (filter.replacement) {
            adaptedContent = adaptedContent.replace(regex, filter.replacement);
          }
          break;
        case "include":
          // This would be handled during generation, not post-processing
          break;
      }
    });

    return adaptedContent;
  }

  /**
   * Get content guidelines for a specific level and denomination
   */
  static getContentGuidelines(level: ChristianContentLevel, denomination?: Denomination) {
    const denom = denomination || "General Christian";
    const profile = DENOMINATIONAL_PROFILES[denom];
    return profile?.contentGuidelines.find(guideline => guideline.level === level);
  }

  /**
   * Validate content against denominational standards
   */
  static validateContent(
    content: string, 
    level: ChristianContentLevel, 
    denomination?: Denomination
  ): { valid: boolean; issues: string[] } {
    const denom = denomination || "General Christian";
    const profile = DENOMINATIONAL_PROFILES[denom];
    const issues: string[] = [];

    // Check for avoided topics
    profile?.avoidedTopics.forEach(topic => {
      const regex = new RegExp(topic, 'gi');
      if (regex.test(content)) {
        issues.push(`Content includes avoided topic: ${topic}`);
      }
    });

    // Level-specific validation
    switch (level) {
      case 0:
        // Should have no religious content
        const religiousTerms = /religious|spiritual|biblical|christian|prayer|worship/gi;
        if (religiousTerms.test(content)) {
          issues.push("Level 0 content should not include religious references");
        }
        break;

      case 3:
        // Should include denominational distinctives
        const hasDistinctives = profile?.theologicalEmphases.some(emphasis => 
          content.toLowerCase().includes(emphasis.toLowerCase())
        );
        if (!hasDistinctives) {
          issues.push(`Level 3 content should include ${denom} theological distinctives`);
        }
        break;
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}
