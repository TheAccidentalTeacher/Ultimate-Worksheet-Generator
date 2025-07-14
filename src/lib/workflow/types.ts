// Multi-Step Selection Workflow Types and Interfaces
// Guided, intuitive content generation process

import { ChristianContentLevel, Denomination, TeachingApproach, BibleTranslation } from '../denominational/types';

export type Subject = 
  | "Science"
  | "Math" 
  | "Language Arts"
  | "History"
  | "Geography"
  | "Art"
  | "Bible"
  | "General";

export type DifficultyLevel = "Beginner" | "Grade Level" | "Advanced" | "Challenge";

export type ContentStyle = 
  | "Academic"
  | "Creative" 
  | "Hands-on"
  | "Visual"
  | "Story-based"
  | "Game-based"
  | "Traditional"
  | "Modern";

export type SpecialNeed = 
  | "Visual Impairment"
  | "Hearing Impairment" 
  | "Dyslexia"
  | "ADHD"
  | "Autism Spectrum"
  | "Large Print"
  | "High Contrast"
  | "Simple Language"
  | "Extra Time";

export type Language = "English" | "Spanish" | "French" | "German" | "Mandarin" | "Other";

// Step 1: Basic Information
export interface BasicInfo {
  gradeLevel: number;
  subject: Subject;
  estimatedTime: number; // in minutes
  numStudents?: number;
  settingType?: "Homeschool" | "Classroom" | "Tutoring" | "Self-Study";
}

// Step 2: Topic Selection
export interface TopicSelection {
  mainTopic: string;
  subtopics: string[];
  learningObjectives: string[];
  priorKnowledge?: string[];
  assessmentType?: "Formative" | "Summative" | "Practice" | "Review";
}

// Step 3: Faith Integration
export interface FaithIntegration {
  level: ChristianContentLevel;
  denomination?: Denomination;
  specificRequests?: string[];
  avoidTopics?: string[];
  preferredApproach?: TeachingApproach;
  bibleTranslation?: BibleTranslation;
}

// Step 4: Customization Options
export interface CustomizationOptions {
  difficulty: DifficultyLevel;
  style: ContentStyle;
  specialNeeds: SpecialNeed[];
  languages: Language[];
  colorPreference?: "Full Color" | "Black & White" | "High Contrast";
  fontSize?: "Small" | "Normal" | "Large" | "Extra Large";
  includeSolutions?: boolean;
  includeRubric?: boolean;
}

// Step 5: Template Selection (will reference WorksheetTemplate from template system)
export interface TemplateSelection {
  templateId: string;
  templateName: string;
  templateCategory: string;
  customizations: Record<string, any>;
}

// Step 6: Final Review and Preview
export interface FinalReview {
  title: string;
  description: string;
  additionalNotes?: string;
  saveToLibrary?: boolean;
  sharePublicly?: boolean;
  tags?: string[];
}

// Complete Generation Request
export interface GenerationRequest {
  basicInfo: BasicInfo;
  topic: TopicSelection;
  faithIntegration: FaithIntegration;
  customization: CustomizationOptions;
  template: TemplateSelection;
  finalReview: FinalReview;
  requestId: string;
  userId?: string;
  createdAt: Date;
}

// Workflow State Management
export interface WorkflowState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  completedSteps: Set<number>;
  data: Partial<GenerationRequest>;
  validationErrors: Record<string, string[]>;
  isValid: boolean;
}

// Step Validation Rules
export interface StepValidation {
  step: number;
  required: string[];
  optional: string[];
  customRules?: (data: any) => string[];
}

// AI Suggestion System
export interface AISuggestion {
  type: "topic" | "objective" | "template" | "customization";
  suggestion: string;
  reason: string;
  confidence: number; // 0-1
}

// Progress Tracking
export interface WorkflowProgress {
  totalSteps: number;
  currentStep: number;
  percentComplete: number;
  estimatedTimeRemaining: number; // minutes
  stepsRemaining: string[];
}
