// Main integration for Phase 1: Enhanced Template System
// Ties together all components: Templates, Denominational Integration, Workflow, and Professional Output

import { WorksheetTemplate } from '../templates/types';
import { TemplateEngine } from './TemplateEngine';
import { WorkflowEngine } from './workflow/WorkflowEngine';
import { WorkflowState, GenerationRequest } from './workflow/types';
import { ContentAdaptationEngine } from './denominational/ContentAdaptationEngine';
import { ProfessionalOutputEngine, OutputFormat } from './output/ProfessionalOutputEngine';

export interface EnhancedGenerationResult {
  content: string;
  adaptedContent: string;
  professionalOutput: string | Buffer;
  metadata: {
    template: WorksheetTemplate;
    faithIntegration: any;
    accessibility: any;
    generationTime: number;
  };
}

export class EnhancedWorksheetGenerator {
  /**
   * Main entry point for enhanced worksheet generation
   * Orchestrates the entire Phase 1 system
   */
  static async generateWorksheet(
    request: GenerationRequest,
    outputFormat: OutputFormat = {
      type: "HTML",
      quality: "Standard",
      options: {
        fontFamily: "Inter, sans-serif",
        fontSize: 14,
        lineHeight: 1.5,
        letterSpacing: 0,
        pageSize: "Letter",
        orientation: "Portrait",
        margins: { top: 1, right: 1, bottom: 1, left: 1 },
        colorScheme: "Full Color",
        theme: "Modern",
        largeText: false,
        highContrast: false,
        simpleLanguage: false,
        altTextForImages: true,
        includeLogo: false,
        customHeader: "",
        customFooter: "",
        interactive: false,
        autoGrading: false,
        progressTracking: false
      }
    }
  ): Promise<EnhancedGenerationResult> {
    const startTime = Date.now();

    try {
      // Step 1: Generate content adaptation based on faith integration
      const contentAdaptation = ContentAdaptationEngine.generateAdaptation(
        request.faithIntegration
      );

      // Step 2: Generate base content using existing AI systems
      // This would integrate with your existing EnhancedContentGenerator
      const baseContent = await this.generateBaseContent(request, contentAdaptation);

      // Step 3: Apply denominational content adaptation
      const adaptedContent = ContentAdaptationEngine.applyAdaptation(
        baseContent,
        contentAdaptation
      );

      // Step 4: Validate content against denominational standards
      const validation = ContentAdaptationEngine.validateContent(
        adaptedContent,
        request.faithIntegration.level,
        request.faithIntegration.denomination
      );

      if (!validation.valid) {
        console.warn('Content validation issues:', validation.issues);
        // Could implement retry logic here
      }

      // Step 5: Apply professional output formatting
      const professionalResult = await ProfessionalOutputEngine.generateProfessionalOutput(
        request,
        adaptedContent,
        outputFormat
      );

      const generationTime = Date.now() - startTime;

      return {
        content: baseContent,
        adaptedContent,
        professionalOutput: professionalResult.output,
        metadata: {
          template: await this.getTemplateById(request.template.templateId),
          faithIntegration: contentAdaptation,
          accessibility: professionalResult.accessibility,
          generationTime
        }
      };

    } catch (error) {
      console.error('Enhanced worksheet generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Worksheet generation failed: ${errorMessage}`);
    }
  }

  /**
   * Generate base content using existing AI systems
   * This integrates with your current EnhancedContentGenerator
   */
  private static async generateBaseContent(
    request: GenerationRequest,
    adaptation: any
  ): Promise<string> {
    // This would call your existing content generation logic
    // For now, returning a mock implementation
    
    const template = await this.getTemplateById(request.template.templateId);
    const prompts = adaptation.contextualPrompts;
    
    // Mock content generation based on template and prompts
    let content = `# ${request.finalReview.title}\n\n`;
    content += `**Grade Level:** ${request.basicInfo.gradeLevel}\n`;
    content += `**Subject:** ${request.basicInfo.subject}\n`;
    content += `**Topic:** ${request.topic.mainTopic}\n\n`;
    
    content += `## Instructions\n`;
    content += `Complete the following activities about ${request.topic.mainTopic}.\n\n`;
    
    // Generate content based on template type
    content += this.generateTemplateContent(template, request);
    
    return content;
  }

  /**
   * Generate content specific to template type
   */
  private static generateTemplateContent(
    template: WorksheetTemplate,
    request: GenerationRequest
  ): string {
    switch (template.category) {
      case "Labeling & Identification":
        return this.generateLabelingContent(template, request);
      case "Fill-in-the-Blank":
        return this.generateFillInBlankContent(template, request);
      case "Matching & Sorting":
        return this.generateMatchingContent(template, request);
      case "Math Practice":
        return this.generateMathContent(template, request);
      case "Creative Writing":
        return this.generateCreativeWritingContent(template, request);
      case "Timeline & Sequence":
        return this.generateTimelineContent(template, request);
      case "Assessment & Review":
        return this.generateAssessmentContent(template, request);
      default:
        return this.generateGeneralContent(template, request);
    }
  }

  /**
   * Template-specific content generators
   */
  private static generateLabelingContent(template: WorksheetTemplate, request: GenerationRequest): string {
    return `## Labeling Activity\n\nUse the word bank below to label the diagram.\n\n**Word Bank:** [Words would be generated based on topic]\n\n[Diagram would be inserted here]\n\n1. _______________\n2. _______________\n3. _______________\n4. _______________\n5. _______________\n`;
  }

  private static generateFillInBlankContent(template: WorksheetTemplate, request: GenerationRequest): string {
    return `## Fill in the Blanks\n\nComplete the sentences using the word bank.\n\n**Word Bank:** [Topic-specific words]\n\n1. The _______ is an important part of the _______.\n2. Scientists study _______ to understand _______.\n3. _______ helps us learn about _______.\n4. The process of _______ involves _______.\n5. We can observe _______ by _______.\n`;
  }

  private static generateMatchingContent(template: WorksheetTemplate, request: GenerationRequest): string {
    return `## Matching Activity\n\nMatch the items in Column A with their definitions in Column B.\n\n**Column A:**\n1. Term 1\n2. Term 2\n3. Term 3\n4. Term 4\n5. Term 5\n\n**Column B:**\na) Definition A\nb) Definition B\nc) Definition C\nd) Definition D\ne) Definition E\n\n**Answers:** 1.___ 2.___ 3.___ 4.___ 5.___\n`;
  }

  private static generateMathContent(template: WorksheetTemplate, request: GenerationRequest): string {
    return `## Math Problems\n\nSolve the following problems. Show your work.\n\n1. Problem 1 text here = ___\n\n2. Problem 2 text here = ___\n\n3. Problem 3 text here = ___\n\n4. Problem 4 text here = ___\n\n5. Problem 5 text here = ___\n`;
  }

  private static generateCreativeWritingContent(template: WorksheetTemplate, request: GenerationRequest): string {
    return `## Creative Writing\n\n**Story Starter:** [Engaging opening related to ${request.topic.mainTopic}]\n\n**Your Task:** Continue the story using at least 5 sentences. Include details about the characters, setting, and what happens next.\n\n_________________________________\n_________________________________\n_________________________________\n_________________________________\n_________________________________\n_________________________________\n_________________________________\n_________________________________\n`;
  }

  private static generateTimelineContent(template: WorksheetTemplate, request: GenerationRequest): string {
    return `## Timeline Activity\n\nArrange the following events in chronological order by writing numbers 1-5 in the boxes.\n\n☐ Event A\n☐ Event B\n☐ Event C\n☐ Event D\n☐ Event E\n\n**Timeline:**\n\n1st _____________ 2nd _____________ 3rd _____________ 4th _____________ 5th _____________\n`;
  }

  private static generateAssessmentContent(template: WorksheetTemplate, request: GenerationRequest): string {
    return `## Assessment Questions\n\n**Part A: Multiple Choice** (Circle the best answer)\n\n1. Question 1?\na) Option A\nb) Option B\nc) Option C\nd) Option D\n\n2. Question 2?\na) Option A\nb) Option B\nc) Option C\nd) Option D\n\n**Part B: Short Answer**\n\n3. Explain the importance of ${request.topic.mainTopic}.\n_________________________________\n_________________________________\n\n4. Describe how ${request.topic.mainTopic} affects our daily lives.\n_________________________________\n_________________________________\n`;
  }

  private static generateGeneralContent(template: WorksheetTemplate, request: GenerationRequest): string {
    return `## Activities\n\n1. **Activity 1:** Complete the task related to ${request.topic.mainTopic}.\n\n2. **Activity 2:** Answer the questions about the topic.\n\n3. **Activity 3:** Create something that demonstrates your understanding.\n\n4. **Activity 4:** Reflect on what you have learned.\n\n5. **Activity 5:** Apply your knowledge to a new situation.\n`;
  }

  /**
   * Get template by ID using the real TemplateEngine
   */
  private static async getTemplateById(templateId: string): Promise<WorksheetTemplate> {
    const template = TemplateEngine.getTemplateById(templateId);
    if (!template) {
      // Return a fallback template if not found
      const allTemplates = TemplateEngine.getAllTemplates();
      return allTemplates[0] || this.getFallbackTemplate();
    }
    return template;
  }

  /**
   * Fallback template when none is found
   */
  private static getFallbackTemplate(): WorksheetTemplate {
    return {
      id: "fallback-template",
      name: "General Worksheet",
      category: "Assessment & Review",
      description: "A general worksheet template",
      gradeRange: [1, 12],
      subjects: ["General"],
      layout: {
        orientation: "portrait",
        columns: 1,
        header: true,
        footer: true,
        colorScheme: "default",
        font: "Arial"
      },
      contentSlots: [],
      imageRequirements: [],
      customizationOptions: []
    };
  }

  /**
   * Validate and process workflow state
   */
  static validateWorkflowForGeneration(state: WorkflowState): boolean {
    if (!state.isValid) {
      console.error('Workflow validation failed:', state.validationErrors);
      return false;
    }

    const progress = WorkflowEngine.getProgress(state);
    if (progress.percentComplete < 100) {
      console.error('Workflow incomplete:', progress);
      return false;
    }

    return true;
  }

  /**
   * Build generation request from workflow
   */
  static buildRequestFromWorkflow(state: WorkflowState): GenerationRequest {
    if (!this.validateWorkflowForGeneration(state)) {
      throw new Error('Invalid workflow state for generation');
    }

    return WorkflowEngine.buildGenerationRequest(state);
  }
}

// Export all main classes for external use
export {
  WorkflowEngine,
  ContentAdaptationEngine,
  ProfessionalOutputEngine
};
