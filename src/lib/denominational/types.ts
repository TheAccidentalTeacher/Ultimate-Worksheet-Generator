// Denominational Integration System Types
// Supports 0-3 levels of Christian content influence with denominational awareness

export type ChristianContentLevel = 0 | 1 | 2 | 3;

export type Denomination =
  | "Reformed"
  | "Reformed Baptist"
  | "Lutheran LCMS"
  | "Lutheran ELCA"
  | "Methodist UMC"
  | "Methodist Free"
  | "Anglican"
  | "Episcopal"
  | "Presbyterian PCA"
  | "Presbyterian PCUSA"
  | "Baptist SBC"
  | "Baptist Independent"
  | "Baptist Progressive"
  | "Pentecostal"
  | "Charismatic"
  | "Non-denominational Evangelical"
  | "Mennonite"
  | "Amish"
  | "Catholic"
  | "Orthodox"
  | "General Christian";

export type BibleTranslation =
  | "ESV"
  | "NIV"
  | "NASB"
  | "KJV"
  | "NKJV"
  | "CSB"
  | "NLT"
  | "MSG"
  | "NRSV"
  | "RSV"
  | "CEB"
  | "NAB"
  | "RSV-CE"
  | "NRSV-CE";

export type TeachingApproach =
  | "Scripture-centered"
  | "Grace-focused"
  | "Works-balanced"
  | "Liturgical"
  | "Contemporary"
  | "Traditional"
  | "Experiential"
  | "Academic"
  | "Devotional"
  | "Service-oriented";

export interface DenominationalProfile {
  denomination: Denomination;
  theologicalEmphases: string[];
  preferredTranslations: BibleTranslation[];
  culturalConsiderations: string[];
  avoidedTopics: string[];
  preferredApproaches: TeachingApproach[];
  contentGuidelines: ContentGuideline[];
}

export interface ContentGuideline {
  level: ChristianContentLevel;
  description: string;
  examples: string[];
  restrictions: string[];
}

export interface AdaptationRule {
  triggerKeywords: string[];
  denominationalFocus: string;
  contentModification: string;
  level: ChristianContentLevel;
}

export interface ContentFilter {
  type: "include" | "exclude" | "modify";
  pattern: string;
  replacement?: string;
  level: ChristianContentLevel;
}

export interface ContentAdaptation {
  level: ChristianContentLevel;
  denomination?: Denomination;
  adaptationRules: AdaptationRule[];
  contentFilters: ContentFilter[];
  contextualPrompts: string[];
}

export interface FaithIntegrationRequest {
  level: ChristianContentLevel;
  denomination?: Denomination;
  specificRequests?: string[];
  avoidTopics?: string[];
  preferredApproach?: TeachingApproach;
  bibleTranslation?: BibleTranslation;
}
