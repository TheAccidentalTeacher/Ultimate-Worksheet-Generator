import {
  WorkflowState,
  GenerationRequest,
  BasicInfo,
  TopicSelection,
  FaithIntegration,
  CustomizationOptions,
  TemplateSelection,
  FinalReview,
  StepValidation,
  AISuggestion,
  WorkflowProgress
} from './types';

export class WorkflowEngine {
  private static readonly STEP_VALIDATIONS: StepValidation[] = [
    {
      step: 1,
      required: ['gradeLevel', 'subject', 'estimatedTime'],
      optional: ['numStudents', 'settingType'],
      customRules: (data: BasicInfo) => {
        const errors: string[] = [];
        if (data.gradeLevel < 1 || data.gradeLevel > 12) {
          errors.push('Grade level must be between 1 and 12');
        }
        if (data.estimatedTime < 5 || data.estimatedTime > 180) {
          errors.push('Estimated time must be between 5 and 180 minutes');
        }
        return errors;
      }
    },
    {
      step: 2,
      required: ['mainTopic', 'learningObjectives'],
      optional: ['subtopics', 'priorKnowledge', 'assessmentType'],
      customRules: (data: TopicSelection) => {
        const errors: string[] = [];
        if (!data.mainTopic || data.mainTopic.trim().length < 3) {
          errors.push('Main topic must be at least 3 characters');
        }
        if (!data.learningObjectives || data.learningObjectives.length === 0) {
          errors.push('At least one learning objective is required');
        }
        return errors;
      }
    },
    {
      step: 3,
      required: ['level'],
      optional: ['denomination', 'specificRequests', 'avoidTopics', 'preferredApproach', 'bibleTranslation'],
      customRules: (data: FaithIntegration) => {
        const errors: string[] = [];
        if (data.level < 0 || data.level > 3) {
          errors.push('Faith integration level must be 0-3');
        }
        if (data.level > 0 && !data.denomination) {
          errors.push('Denomination required for faith integration levels 1-3');
        }
        return errors;
      }
    },
    {
      step: 4,
      required: ['difficulty', 'style'],
      optional: ['specialNeeds', 'languages', 'colorPreference', 'fontSize', 'includeSolutions', 'includeRubric'],
    },
    {
      step: 5,
      required: ['templateId', 'templateName', 'templateCategory'],
      optional: ['customizations'],
    },
    {
      step: 6,
      required: ['title'],
      optional: ['description', 'additionalNotes', 'saveToLibrary', 'sharePublicly', 'tags'],
      customRules: (data: FinalReview) => {
        const errors: string[] = [];
        if (!data.title || data.title.trim().length < 3) {
          errors.push('Title must be at least 3 characters');
        }
        return errors;
      }
    }
  ];

  /**
   * Initialize a new workflow state
   */
  static initializeWorkflow(): WorkflowState {
    return {
      currentStep: 1,
      completedSteps: new Set(),
      data: {},
      validationErrors: {},
      isValid: false
    };
  }

  /**
   * Update workflow data for a specific step
   */
  static updateStep<T>(
    state: WorkflowState,
    step: number,
    data: T
  ): WorkflowState {
    const newState = { ...state };
    
    // Update data for the step
    switch (step) {
      case 1:
        newState.data.basicInfo = data as BasicInfo;
        break;
      case 2:
        newState.data.topic = data as TopicSelection;
        break;
      case 3:
        newState.data.faithIntegration = data as FaithIntegration;
        break;
      case 4:
        newState.data.customization = data as CustomizationOptions;
        break;
      case 5:
        newState.data.template = data as TemplateSelection;
        break;
      case 6:
        newState.data.finalReview = data as FinalReview;
        break;
    }

    // Validate the step
    const validation = this.validateStep(step, data);
    if (validation.length === 0) {
      newState.completedSteps.add(step);
      delete newState.validationErrors[step];
    } else {
      newState.validationErrors[step] = validation;
      newState.completedSteps.delete(step);
    }

    // Update overall validity
    newState.isValid = newState.completedSteps.size === 6;

    return newState;
  }

  /**
   * Navigate to a specific step
   */
  static navigateToStep(state: WorkflowState, step: number): WorkflowState {
    if (step < 1 || step > 6) {
      throw new Error('Invalid step number. Must be 1-6.');
    }

    return {
      ...state,
      currentStep: step as 1 | 2 | 3 | 4 | 5 | 6
    };
  }

  /**
   * Move to the next step
   */
  static nextStep(state: WorkflowState): WorkflowState {
    const nextStep = Math.min(state.currentStep + 1, 6);
    return this.navigateToStep(state, nextStep);
  }

  /**
   * Move to the previous step
   */
  static previousStep(state: WorkflowState): WorkflowState {
    const prevStep = Math.max(state.currentStep - 1, 1);
    return this.navigateToStep(state, prevStep);
  }

  /**
   * Validate data for a specific step
   */
  static validateStep(step: number, data: any): string[] {
    const validation = this.STEP_VALIDATIONS.find(v => v.step === step);
    if (!validation) return [];

    const errors: string[] = [];

    // Check required fields
    validation.required.forEach(field => {
      if (!data || data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push(`${field} is required`);
      }
    });

    // Run custom validation rules
    if (validation.customRules) {
      errors.push(...validation.customRules(data));
    }

    return errors;
  }

  /**
   * Get workflow progress information
   */
  static getProgress(state: WorkflowState): WorkflowProgress {
    const totalSteps = 6;
    const percentComplete = (state.completedSteps.size / totalSteps) * 100;
    
    // Estimate time remaining based on average time per step
    const avgTimePerStep = 2; // minutes
    const stepsRemaining = totalSteps - state.completedSteps.size;
    const estimatedTimeRemaining = stepsRemaining * avgTimePerStep;

    const stepNames = [
      'Basic Information',
      'Topic Selection', 
      'Faith Integration',
      'Customization',
      'Template Selection',
      'Final Review'
    ];

    const remainingStepNames = stepNames.filter((_, index) => 
      !state.completedSteps.has(index + 1)
    );

    return {
      totalSteps,
      currentStep: state.currentStep,
      percentComplete,
      estimatedTimeRemaining,
      stepsRemaining: remainingStepNames
    };
  }

  /**
   * Generate AI suggestions for the current step
   */
  static async generateSuggestions(
    state: WorkflowState
  ): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = [];
    const { currentStep, data } = state;

    switch (currentStep) {
      case 2: // Topic Selection
        if (data.basicInfo) {
          // Suggest topics based on grade and subject
          suggestions.push({
            type: "topic",
            suggestion: this.suggestTopicForGradeSubject(
              data.basicInfo.gradeLevel, 
              data.basicInfo.subject
            ),
            reason: `Popular topic for ${data.basicInfo.subject} at grade ${data.basicInfo.gradeLevel}`,
            confidence: 0.8
          });

          // Suggest learning objectives
          suggestions.push({
            type: "objective",
            suggestion: this.suggestLearningObjectives(
              data.basicInfo.gradeLevel,
              data.basicInfo.subject
            ),
            reason: "Grade-appropriate learning objectives",
            confidence: 0.75
          });
        }
        break;

      case 5: // Template Selection
        if (data.basicInfo && data.topic) {
          suggestions.push({
            type: "template",
            suggestion: this.suggestTemplate(data.basicInfo, data.topic),
            reason: "Template matches your subject and learning objectives",
            confidence: 0.85
          });
        }
        break;

      case 4: // Customization
        if (data.basicInfo) {
          suggestions.push({
            type: "customization",
            suggestion: this.suggestCustomizations(data.basicInfo),
            reason: "Recommended settings for this grade level",
            confidence: 0.7
          });
        }
        break;
    }

    return suggestions;
  }

  /**
   * Build final generation request from completed workflow
   */
  static buildGenerationRequest(state: WorkflowState): GenerationRequest {
    if (!state.isValid) {
      throw new Error('Cannot build generation request from invalid workflow state');
    }

    const { data } = state;
    
    return {
      basicInfo: data.basicInfo!,
      topic: data.topic!,
      faithIntegration: data.faithIntegration!,
      customization: data.customization!,
      template: data.template!,
      finalReview: data.finalReview!,
      requestId: this.generateRequestId(),
      createdAt: new Date()
    };
  }

  /**
   * Helper methods for AI suggestions
   */
  private static suggestTopicForGradeSubject(grade: number, subject: string): string {
    const topicMap: Record<string, Record<string, string[]>> = {
      "Science": {
        "K-2": ["Plants and Animals", "Weather", "Magnets", "Senses"],
        "3-5": ["Solar System", "Matter and Energy", "Ecosystems", "Human Body"],
        "6-8": ["Cells", "Forces and Motion", "Earth's Systems", "Genetics"],
        "9-12": ["Chemistry", "Physics", "Biology", "Environmental Science"]
      },
      "Math": {
        "K-2": ["Counting", "Addition and Subtraction", "Shapes", "Measurement"],
        "3-5": ["Multiplication", "Fractions", "Geometry", "Data and Graphs"],
        "6-8": ["Algebra", "Ratios and Proportions", "Probability", "Integers"],
        "9-12": ["Functions", "Trigonometry", "Statistics", "Calculus"]
      },
      "Language Arts": {
        "K-2": ["Phonics", "Reading Comprehension", "Writing Sentences", "Storytelling"],
        "3-5": ["Grammar", "Creative Writing", "Research Skills", "Literature"],
        "6-8": ["Essay Writing", "Poetry", "Character Analysis", "Debate"],
        "9-12": ["Literary Analysis", "Research Papers", "Rhetoric", "Creative Writing"]
      }
    };

    const gradeRange = grade <= 2 ? "K-2" : grade <= 5 ? "3-5" : grade <= 8 ? "6-8" : "9-12";
    const topics = topicMap[subject]?.[gradeRange] || ["General Topic"];
    
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private static suggestLearningObjectives(grade: number, subject: string): string {
    // This would typically call an AI service for more sophisticated suggestions
    return `Students will be able to understand and apply key concepts in ${subject} appropriate for grade ${grade}.`;
  }

  private static suggestTemplate(basicInfo: BasicInfo, topic: TopicSelection): string {
    // Use real template system to suggest appropriate templates
    const subjectTemplates = this.getTemplatesBySubject(basicInfo.subject);
    const gradeTemplates = this.getTemplatesByGrade(basicInfo.gradeLevel);
    
    // Find templates that match both subject and grade
    const matchingTemplates = subjectTemplates.filter(template => 
      gradeTemplates.some(gradeTemplate => gradeTemplate.id === template.id)
    );
    
    if (matchingTemplates.length > 0) {
      return matchingTemplates[0].id;
    }
    
    // Fallback to grade-appropriate templates
    if (gradeTemplates.length > 0) {
      return gradeTemplates[0].id;
    }
    
    // Final fallback
    return "labeling-plant-parts";
  }

  // Helper methods for template retrieval
  private static getTemplatesBySubject(subject: string): Array<{id: string}> {
    // This would integrate with the real TemplateEngine
    // For now, return mock data that matches common subjects
    const subjectMap: Record<string, string[]> = {
      "Science": ["labeling-plant-parts", "science-experiment-worksheet"],
      "Math": ["multiplication-grid", "math-word-problems"],
      "Language Arts": ["vocabulary-fill-in-blank", "story-starter-prompts", "vocabulary-quiz"],
      "History": ["historical-timeline"],
      "Geography": ["geography-map-skills"],
      "Bible": ["bible-verse-memorization"]
    };
    
    const templateIds = subjectMap[subject] || ["labeling-plant-parts"];
    return templateIds.map(id => ({id}));
  }

  private static getTemplatesByGrade(grade: number): Array<{id: string}> {
    // Simple grade-based filtering
    if (grade <= 3) {
      return [
        {id: "labeling-plant-parts"},
        {id: "animal-habitat-matching"},
        {id: "multiplication-grid"}
      ];
    } else if (grade <= 8) {
      return [
        {id: "vocabulary-fill-in-blank"},
        {id: "math-word-problems"},
        {id: "historical-timeline"},
        {id: "geography-map-skills"}
      ];
    } else {
      return [
        {id: "vocabulary-quiz"},
        {id: "science-experiment-worksheet"},
        {id: "story-starter-prompts"}
      ];
    }
  }

  private static suggestCustomizations(basicInfo: BasicInfo): string {
    if (basicInfo.gradeLevel <= 3) {
      return "Large font, colorful design, visual aids";
    } else if (basicInfo.gradeLevel <= 8) {
      return "Standard format with moderate challenge";
    } else {
      return "Academic format with advanced difficulty";
    }
  }

  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
