export type TemplateCategory =
  | "Labeling & Identification"
  | "Fill-in-the-Blank"
  | "Matching & Sorting"
  | "Creative Writing"
  | "Math Practice"
  | "Timeline & Sequence"
  | "Assessment & Review";

export type Subject =
  | "Science"
  | "Math"
  | "Language Arts"
  | "History"
  | "Geography"
  | "Art"
  | "Bible"
  | "General";

export type GradeRange = [number, number]; // e.g., [1, 3] for grades 1–3

export interface ContentSlot {
  id: string;
  label: string;
  type: "text" | "image" | "input" | "choice" | "table" | "custom";
  description: string;
  required: boolean;
  options?: string[]; // for choice/table/custom
}

export interface ImageRequirement {
  slotId: string;
  description: string;
  required: boolean;
  source: "AI" | "Stock" | "UserUpload";
  aspectRatio?: string; // e.g., "1:1", "16:9"
}

export interface CustomizationOption {
  id: string;
  label: string;
  type: "boolean" | "number" | "string" | "enum";
  description: string;
  enumOptions?: string[];
  defaultValue?: any;
}

export interface LayoutConfig {
  orientation: "portrait" | "landscape";
  columns: number;
  header: boolean;
  footer: boolean;
  colorScheme: "default" | "colorful" | "bw";
  font: string;
}

export interface WorksheetTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  gradeRange: GradeRange;
  subjects: Subject[];
  layout: LayoutConfig;
  contentSlots: ContentSlot[];
  imageRequirements: ImageRequirement[];
  customizationOptions: CustomizationOption[];
}