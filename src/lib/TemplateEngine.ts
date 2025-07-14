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