// Phase 1: Enhanced Template System - Main Export
// Complete integration: Templates + Denominational + Workflow + Professional Output

// Core Systems
export { ContentAdaptationEngine } from './denominational/ContentAdaptationEngine';
export { WorkflowEngine } from './workflow/WorkflowEngine';
export { ProfessionalOutputEngine } from './output/ProfessionalOutputEngine';
export { EnhancedWorksheetGenerator } from './EnhancedWorksheetGenerator';
export { TemplateEngine } from './TemplateEngine';

// Types
export type {
  ChristianContentLevel,
  Denomination,
  DenominationalProfile,
  ContentAdaptation,
  FaithIntegrationRequest
} from './denominational/types';

export type {
  WorkflowState,
  GenerationRequest,
  BasicInfo,
  TopicSelection,
  FaithIntegration,
  CustomizationOptions,
  TemplateSelection,
  FinalReview,
  Subject,
  DifficultyLevel,
  ContentStyle,
  SpecialNeed,
  Language
} from './workflow/types';

export type {
  OutputFormat,
  OutputOptions,
  LayoutTemplate,
  BrandingConfig,
  AccessibilityCompliance
} from './output/ProfessionalOutputEngine';

// Data
export { DENOMINATIONAL_PROFILES } from './denominational/profiles';

// Template System
export type { 
  WorksheetTemplate,
  TemplateCategory,
  ContentSlot,
  ImageRequirement,
  CustomizationOption,
  LayoutConfig
} from '../templates/types';

export { WORKSHEET_TEMPLATES } from '../templates/index';
