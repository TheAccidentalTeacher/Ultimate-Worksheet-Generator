# Worksheet Template System — Implementation Instructions

## Objective

Build a robust, extensible system for defining, storing, and using 25–50 professional worksheet templates, categorized by educational function, as the foundation for dynamic worksheet generation.

---

## 1. Directory and File Structure

Create or update the following structure in your project root:

```
/src
  /templates
    index.ts
    categories.ts
    [template-id].ts (one file per template, e.g., labeling-plant-parts.ts)
    types.ts
  /lib
    TemplateEngine.ts
```

---

## 2. Type Definitions

### 2.1. Template Category Types

```typescript
export type TemplateCategory =
  | "Labeling & Identification"
  | "Fill-in-the-Blank"
  | "Matching & Sorting"
  | "Creative Writing"
  | "Math Practice"
  | "Timeline & Sequence"
  | "Assessment & Review";
```

### 2.2. Subject and Grade Types

```typescript
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
```

### 2.3. Template Core Types

```typescript
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
```

---

## 3. Template Categories Registry

```typescript
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Labeling & Identification",
  "Fill-in-the-Blank",
  "Matching & Sorting",
  "Creative Writing",
  "Math Practice",
  "Timeline & Sequence",
  "Assessment & Review",
];
```

---

## 4. Template Definitions

- Create one file per template (e.g., `labeling-plant-parts.ts`).
- Each file exports a single `WorksheetTemplate` object.
- Use unique `id` values (kebab-case, e.g., `math-multiplication-grid`).
- Ensure all required fields are filled and descriptions are explicit.

---

## 5. Template Index

```typescript
import labelingPlantPartsTemplate from "./labeling-plant-parts";
// import other templates here

export const WORKSHEET_TEMPLATES = [
  labelingPlantPartsTemplate,
  // ...add other templates here
];
```

---

## 6. Template Engine Library

```typescript
import { WORKSHEET_TEMPLATES } from "../templates";
import { WorksheetTemplate, TemplateCategory, Subject, GradeRange } from "../templates/types";

export class TemplateEngine {
  static getAllTemplates(): WorksheetTemplate[] {
    return WORKSHEET_TEMPLATES;
  }

  static getTemplatesByCategory(category: TemplateCategory): WorksheetTemplate[] {
    return WORKSHEET_TEMPLATES.filter(t => t.category === category);
  }

  static getTemplatesBySubject(subject: Subject): WorksheetTemplate[] {
    return WORKSHEET_TEMPLATES.filter(t => t.subjects.includes(subject));
  }

  static getTemplatesByGrade(grade: number): WorksheetTemplate[] {
    return WORKSHEET_TEMPLATES.filter(t => grade >= t.gradeRange[0] && grade <= t.gradeRange[1]);
  }

  static getTemplateById(id: string): WorksheetTemplate | undefined {
    return WORKSHEET_TEMPLATES.find(t => t.id === id);
  }
}
```

---

## 7. Edge Cases and Validation

- All templates must have unique `id` values.
- Descriptions must be explicit for both humans and AI to understand.
- Grade ranges must not overlap illogically (e.g., K-12 for a template meant for 1st–3rd grade).
- Customization options must have sensible defaults and be validated for type.
- Image requirements must specify if AI, stock, or user-upload is needed.
- If a template is subject-specific, ensure `subjects` is not `["General"]`.
- If a template is cross-disciplinary, list all relevant subjects.

---

## 8. Testing and Documentation

- Write a test script to iterate through all templates and validate:
  - All required fields are present.
  - All types are correct.
  - No duplicate IDs.
- Document each template in `/docs/templates.md` with:
  - Screenshot/mockup (if available)
  - Example use case
  - All customization options explained

---

## 9. Extensibility

- New templates must follow the same structure.
- To add a template: create a new file, export the object, and add it to `index.ts`.
- To add a new category: update `categories.ts` and ensure all logic supports it.

---

## 10. Integration

- The template system will be used by the worksheet generator UI and AI content engine.
- When a user selects grade, subject, and template, the system will:
  - Retrieve the template object
  - Present customization options
  - Pass the structure to the AI content generation pipeline

---

## 11. Summary Table

| File/Module                       | Purpose                                      |
|------------------------------------|----------------------------------------------|
| `/src/templates/types.ts`          | Type definitions for templates               |
| `/src/templates/categories.ts`     | List of template categories                  |
| `/src/templates/[id].ts`           | Individual template definitions              |
| `/src/templates/index.ts`          | Aggregates all templates                     |
| `/src/lib/TemplateEngine.ts`       | Query and retrieval logic                    |
| `/docs/templates.md`               | Human/AI documentation for all templates     |

---

## 12. Next Steps

- Implement at least 10 templates as a starting point (one per category).
- Validate and document each template.
- Integrate with the worksheet generator UI for selection and preview.

---

**END OF INSTRUCTIONS**
