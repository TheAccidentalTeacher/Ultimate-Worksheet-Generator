// Professional Output Quality System
// Transform from "list format" to actual professional worksheet templates

import { GenerationRequest } from '../workflow/types';

export interface OutputFormat {
  type: "PDF" | "HTML" | "DOCX" | "PNG" | "Interactive";
  quality: "Draft" | "Standard" | "High" | "Print-Ready";
  options: OutputOptions;
}

export interface OutputOptions {
  // Typography
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  
  // Layout
  pageSize: "Letter" | "A4" | "Legal" | "Custom";
  orientation: "Portrait" | "Landscape";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Styling
  colorScheme: "Full Color" | "Black & White" | "High Contrast";
  theme: "Modern" | "Classic" | "Playful" | "Academic" | "Minimal";
  
  // Accessibility
  largeText: boolean;
  highContrast: boolean;
  simpleLanguage: boolean;
  altTextForImages: boolean;
  
  // Branding
  includeLogo: boolean;
  customHeader: string;
  customFooter: string;
  watermark?: string;
  
  // Interactive Elements (for digital formats)
  interactive: boolean;
  autoGrading: boolean;
  progressTracking: boolean;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  sections: LayoutSection[];
  cssTemplate: string;
  variables: Record<string, any>;
}

export interface LayoutSection {
  id: string;
  type: "header" | "title" | "instructions" | "content" | "image" | "table" | "footer";
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styling: SectionStyling;
  content?: string;
  placeholder?: string;
}

export interface SectionStyling {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
  borderRadius?: number;
  padding: number;
  margin: number;
  textAlign: "left" | "center" | "right" | "justify";
  fontWeight: "normal" | "bold" | "light";
  fontStyle: "normal" | "italic";
  color: string;
}

export interface BrandingConfig {
  organizationName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPrimary: string;
  fontSecondary: string;
  tagline?: string;
  website?: string;
}

export interface AccessibilityCompliance {
  wcagLevel: "A" | "AA" | "AAA";
  features: AccessibilityFeature[];
  validation: AccessibilityValidation;
}

export interface AccessibilityFeature {
  type: "alt-text" | "color-contrast" | "font-size" | "keyboard-nav" | "screen-reader";
  implemented: boolean;
  description: string;
}

export interface AccessibilityValidation {
  passed: boolean;
  issues: string[];
  suggestions: string[];
  score: number; // 0-100
}

export class ProfessionalOutputEngine {
  private static readonly DEFAULT_BRANDING: BrandingConfig = {
    organizationName: "Worksheet Generator",
    primaryColor: "#2563eb",
    secondaryColor: "#64748b", 
    accentColor: "#10b981",
    fontPrimary: "Inter, system-ui, sans-serif",
    fontSecondary: "Georgia, serif",
    tagline: "Professional Educational Resources"
  };

  private static readonly LAYOUT_TEMPLATES: LayoutTemplate[] = [
    {
      id: "standard-worksheet",
      name: "Standard Worksheet",
      description: "Clean, professional layout with header, instructions, and content area",
      sections: [
        {
          id: "header",
          type: "header",
          position: { x: 0, y: 0, width: 100, height: 10 },
          styling: {
            padding: 16,
            margin: 0,
            textAlign: "center",
            fontWeight: "bold",
            fontStyle: "normal",
            color: "#1f2937"
          },
          placeholder: "Organization Name"
        },
        {
          id: "title",
          type: "title", 
          position: { x: 0, y: 10, width: 100, height: 8 },
          styling: {
            padding: 12,
            margin: 8,
            textAlign: "center",
            fontWeight: "bold",
            fontStyle: "normal",
            color: "#111827"
          },
          placeholder: "Worksheet Title"
        },
        {
          id: "instructions",
          type: "instructions",
          position: { x: 0, y: 18, width: 100, height: 7 },
          styling: {
            padding: 10,
            margin: 6,
            textAlign: "left",
            fontWeight: "normal",
            fontStyle: "normal",
            color: "#374151"
          },
          placeholder: "Instructions for completing the worksheet"
        },
        {
          id: "content",
          type: "content",
          position: { x: 0, y: 25, width: 100, height: 70 },
          styling: {
            padding: 16,
            margin: 8,
            textAlign: "left",
            fontWeight: "normal",
            fontStyle: "normal",
            color: "#1f2937"
          },
          placeholder: "Main worksheet content"
        },
        {
          id: "footer",
          type: "footer",
          position: { x: 0, y: 95, width: 100, height: 5 },
          styling: {
            padding: 8,
            margin: 0,
            textAlign: "center",
            fontWeight: "normal",
            fontStyle: "normal",
            color: "#6b7280"
          },
          placeholder: "© Organization Name - Page 1"
        }
      ],
      cssTemplate: `
        .worksheet-container {
          font-family: var(--font-primary);
          max-width: 8.5in;
          margin: 0 auto;
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header { border-bottom: 2px solid var(--primary-color); }
        .title { font-size: 1.5rem; }
        .instructions { background: #f9fafb; border-left: 4px solid var(--accent-color); }
        .content { min-height: 500px; }
        .footer { border-top: 1px solid #e5e7eb; font-size: 0.875rem; }
      `,
      variables: {}
    }
  ];

  /**
   * Generate professional worksheet output
   */
  static async generateProfessionalOutput(
    request: GenerationRequest,
    content: string,
    format: OutputFormat,
    branding?: BrandingConfig
  ): Promise<{
    output: string | Buffer;
    metadata: OutputMetadata;
    accessibility: AccessibilityCompliance;
  }> {
    const brandingConfig = branding || this.DEFAULT_BRANDING;
    const template = this.selectTemplate(request);
    
    // Transform content from list format to structured format
    const structuredContent = this.transformContent(content, request);
    
    // Apply professional layout
    const layoutedContent = this.applyLayout(structuredContent, template, brandingConfig);
    
    // Generate output in requested format
    const output = await this.renderOutput(layoutedContent, format);
    
    // Generate metadata
    const metadata = this.generateMetadata(request, format);
    
    // Validate accessibility
    const accessibility = this.validateAccessibility(layoutedContent, format.options);
    
    return {
      output,
      metadata,
      accessibility
    };
  }

  /**
   * Transform raw content from list format to structured professional format
   */
  private static transformContent(content: string, request: GenerationRequest): StructuredContent {
    // Parse the raw content (which might be in list format)
    const lines = content.split('\n').filter(line => line.trim());
    
    const structured: StructuredContent = {
      title: this.extractTitle(lines, request),
      instructions: this.extractInstructions(lines),
      sections: this.extractSections(lines),
      images: this.extractImages(lines),
      metadata: {
        gradeLevel: request.basicInfo.gradeLevel,
        subject: request.basicInfo.subject,
        estimatedTime: request.basicInfo.estimatedTime,
        difficultyLevel: request.customization.difficulty
      }
    };

    return structured;
  }

  /**
   * Apply professional layout template
   */
  private static applyLayout(
    content: StructuredContent,
    template: LayoutTemplate,
    branding: BrandingConfig
  ): string {
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.title}</title>
        <style>
          :root {
            --primary-color: ${branding.primaryColor};
            --secondary-color: ${branding.secondaryColor};
            --accent-color: ${branding.accentColor};
            --font-primary: ${branding.fontPrimary};
            --font-secondary: ${branding.fontSecondary};
          }
          ${template.cssTemplate}
          ${this.generateResponsiveCSS()}
          ${this.generateAccessibilityCSS()}
        </style>
      </head>
      <body>
        <div class="worksheet-container">
    `;

    // Populate template sections with content
    template.sections.forEach(section => {
      html += this.renderSection(section, content, branding);
    });

    html += `
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Render individual template sections
   */
  private static renderSection(
    section: LayoutSection,
    content: StructuredContent,
    branding: BrandingConfig
  ): string {
    const styles = this.convertStylingToCSS(section.styling);
    
    let sectionContent = '';
    
    switch (section.type) {
      case "header":
        sectionContent = branding.organizationName;
        if (branding.logo) {
          sectionContent = `<img src="${branding.logo}" alt="${branding.organizationName}" class="logo"> ${sectionContent}`;
        }
        break;
        
      case "title":
        sectionContent = content.title;
        break;
        
      case "instructions":
        sectionContent = content.instructions;
        break;
        
      case "content":
        sectionContent = this.renderContentSections(content.sections);
        break;
        
      case "footer":
        sectionContent = `© ${branding.organizationName} - Grade ${content.metadata.gradeLevel} ${content.metadata.subject}`;
        if (branding.website) {
          sectionContent += ` - ${branding.website}`;
        }
        break;
    }

    return `
      <div class="${section.type}" style="${styles}">
        ${sectionContent}
      </div>
    `;
  }

  /**
   * Render content sections (problems, questions, activities)
   */
  private static renderContentSections(sections: ContentSection[]): string {
    return sections.map((section, index) => `
      <div class="content-section" data-section="${index + 1}">
        <h3 class="section-title">${section.title}</h3>
        <div class="section-content">
          ${section.content}
        </div>
        ${section.image ? `<img src="${section.image}" alt="${section.imageAlt || ''}" class="section-image">` : ''}
      </div>
    `).join('');
  }

  /**
   * Generate responsive CSS
   */
  private static generateResponsiveCSS(): string {
    return `
      @media print {
        .worksheet-container { box-shadow: none; }
        .no-print { display: none; }
      }
      
      @media (max-width: 768px) {
        .worksheet-container { margin: 1rem; font-size: 0.9rem; }
        .content-section { margin-bottom: 1.5rem; }
      }
    `;
  }

  /**
   * Generate accessibility CSS
   */
  private static generateAccessibilityCSS(): string {
    return `
      .high-contrast {
        background: #000 !important;
        color: #fff !important;
      }
      
      .large-text {
        font-size: 1.25em !important;
        line-height: 1.6 !important;
      }
      
      .focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }
      
      .screen-reader-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
  }

  /**
   * Render output in requested format
   */
  private static async renderOutput(html: string, format: OutputFormat): Promise<string | Buffer> {
    switch (format.type) {
      case "HTML":
        return html;
        
      case "PDF":
        // This would use a library like Puppeteer or jsPDF
        return this.convertToPDF(html, format);
        
      case "PNG":
        // This would use Puppeteer to take a screenshot
        return this.convertToImage(html, format);
        
      case "DOCX":
        // This would use a library to convert HTML to DOCX
        return this.convertToDocx(html, format);
        
      case "Interactive":
        // Add interactive elements and return enhanced HTML
        return this.addInteractiveElements(html, format);
        
      default:
        return html;
    }
  }

  /**
   * Extract helper methods
   */
  private static extractTitle(lines: string[], request: GenerationRequest): string {
    // Look for title in first few lines or generate from request
    const titleLine = lines.find(line => 
      line.toLowerCase().includes('worksheet') || 
      line.toLowerCase().includes('activity') ||
      line.toLowerCase().includes(request.topic.mainTopic.toLowerCase())
    );
    
    return titleLine || `${request.topic.mainTopic} - Grade ${request.basicInfo.gradeLevel}`;
  }

  private static extractInstructions(lines: string[]): string {
    // Look for instruction indicators
    const instructionKeywords = ['instructions:', 'directions:', 'how to:', 'complete', 'fill'];
    const instructionLine = lines.find(line => 
      instructionKeywords.some(keyword => line.toLowerCase().includes(keyword))
    );
    
    return instructionLine || "Complete the activities below to the best of your ability.";
  }

  private static extractSections(lines: string[]): ContentSection[] {
    const sections: ContentSection[] = [];
    let currentSection: ContentSection | null = null;
    
    lines.forEach(line => {
      // Detect section headers (numbered items, bullet points, etc.)
      if (this.isSectionHeader(line)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: this.cleanSectionTitle(line),
          content: '',
          type: this.detectSectionType(line)
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    });
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }

  private static extractImages(lines: string[]): string[] {
    // Extract image URLs or references from content
    const imageRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|svg|webp))/gi;
    const images: string[] = [];
    
    lines.forEach(line => {
      const matches = line.match(imageRegex);
      if (matches) {
        images.push(...matches);
      }
    });
    
    return images;
  }

  // Placeholder methods for format conversion
  private static async convertToPDF(html: string, format: OutputFormat): Promise<Buffer> {
    // Implementation would use Puppeteer or similar
    throw new Error("PDF conversion not implemented");
  }

  private static async convertToImage(html: string, format: OutputFormat): Promise<Buffer> {
    // Implementation would use Puppeteer for screenshots
    throw new Error("Image conversion not implemented");
  }

  private static async convertToDocx(html: string, format: OutputFormat): Promise<Buffer> {
    // Implementation would use html-docx-js or similar
    throw new Error("DOCX conversion not implemented");
  }

  private static addInteractiveElements(html: string, format: OutputFormat): string {
    // Add JavaScript for interactive features
    return html + `
      <script>
        // Interactive worksheet functionality
        document.addEventListener('DOMContentLoaded', function() {
          // Add auto-save, progress tracking, etc.
        });
      </script>
    `;
  }

  // Helper methods
  private static isSectionHeader(line: string): boolean {
    return /^\d+\.|\*|\-|#/.test(line.trim());
  }

  private static cleanSectionTitle(line: string): string {
    return line.replace(/^\d+\.|\*|\-|#/, '').trim();
  }

  private static detectSectionType(line: string): string {
    if (line.toLowerCase().includes('question')) return 'question';
    if (line.toLowerCase().includes('problem')) return 'problem';
    if (line.toLowerCase().includes('activity')) return 'activity';
    return 'content';
  }

  private static convertStylingToCSS(styling: SectionStyling): string {
    return Object.entries(styling)
      .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
      .join('; ');
  }

  private static camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  private static selectTemplate(request: GenerationRequest): LayoutTemplate {
    // Logic to select appropriate template based on request
    return this.LAYOUT_TEMPLATES[0]; // Default to standard worksheet
  }

  private static generateMetadata(request: GenerationRequest, format: OutputFormat): OutputMetadata {
    return {
      title: request.finalReview.title,
      createdAt: new Date(),
      format: format.type,
      gradeLevel: request.basicInfo.gradeLevel,
      subject: request.basicInfo.subject,
      estimatedTime: request.basicInfo.estimatedTime,
      fileSize: 0, // Would be calculated after generation
      version: "1.0"
    };
  }

  private static validateAccessibility(html: string, options: OutputOptions): AccessibilityCompliance {
    const features: AccessibilityFeature[] = [
      {
        type: "alt-text",
        implemented: options.altTextForImages,
        description: "Images have descriptive alt text"
      },
      {
        type: "color-contrast",
        implemented: options.highContrast,
        description: "Sufficient color contrast ratio"
      },
      {
        type: "font-size",
        implemented: options.largeText,
        description: "Text is large enough to read"
      }
    ];

    const implementedCount = features.filter(f => f.implemented).length;
    const score = (implementedCount / features.length) * 100;

    return {
      wcagLevel: score >= 80 ? "AA" : score >= 60 ? "A" : "A",
      features,
      validation: {
        passed: score >= 60,
        issues: features.filter(f => !f.implemented).map(f => f.description),
        suggestions: ["Implement missing accessibility features"],
        score
      }
    };
  }
}

// Supporting interfaces
interface StructuredContent {
  title: string;
  instructions: string;
  sections: ContentSection[];
  images: string[];
  metadata: {
    gradeLevel: number;
    subject: string;
    estimatedTime: number;
    difficultyLevel: string;
  };
}

interface ContentSection {
  title: string;
  content: string;
  type: string;
  image?: string;
  imageAlt?: string;
}

interface OutputMetadata {
  title: string;
  createdAt: Date;
  format: string;
  gradeLevel: number;
  subject: string;
  estimatedTime: number;
  fileSize: number;
  version: string;
}
