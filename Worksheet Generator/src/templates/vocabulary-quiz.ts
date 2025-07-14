import { WorksheetTemplate } from "./types";

const vocabularyQuizTemplate: WorksheetTemplate = {
  id: "vocabulary-quiz",
  name: "Vocabulary Assessment Quiz",
  category: "Assessment & Review",
  description: "A comprehensive vocabulary assessment worksheet with multiple question types to test students' understanding of vocabulary words.",
  gradeRange: [3, 8],
  subjects: ["Language Arts"],
  layout: {
    orientation: "portrait",
    columns: 1,
    header: true,
    footer: true,
    colorScheme: "default",
    font: "Arial"
  },
  contentSlots: [
    {
      id: "title",
      label: "Worksheet Title",
      type: "text",
      description: "The title of the worksheet, e.g., 'Vocabulary Assessment Quiz'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "General instructions for the quiz",
      required: true
    },
    {
      id: "matching-section",
      label: "Matching Section",
      type: "custom",
      description: "A section where students match vocabulary words with their definitions",
      required: false
    },
    {
      id: "multiple-choice-section",
      label: "Multiple Choice Section",
      type: "custom",
      description: "A section with multiple-choice questions about vocabulary words",
      required: false
    },
    {
      id: "fill-in-blank-section",
      label: "Fill in the Blank Section",
      type: "custom",
      description: "A section where students fill in blanks in sentences with vocabulary words",
      required: false
    },
    {
      id: "short-answer-section",
      label: "Short Answer Section",
      type: "custom",
      description: "A section where students write short answers using vocabulary words",
      required: false
    }
  ],
  imageRequirements: [],
  customizationOptions: [
    {
      id: "vocabulary-theme",
      label: "Vocabulary Theme",
      type: "enum",
      description: "The theme of the vocabulary words",
      enumOptions: ["Academic", "Literature", "Science", "Social Studies", "General"],
      defaultValue: "General"
    },
    {
      id: "include-matching",
      label: "Include Matching Section",
      type: "boolean",
      description: "Whether to include a matching section",
      defaultValue: true
    },
    {
      id: "include-multiple-choice",
      label: "Include Multiple Choice Section",
      type: "boolean",
      description: "Whether to include a multiple-choice section",
      defaultValue: true
    },
    {
      id: "include-fill-in-blank",
      label: "Include Fill in the Blank Section",
      type: "boolean",
      description: "Whether to include a fill-in-the-blank section",
      defaultValue: true
    },
    {
      id: "include-short-answer",
      label: "Include Short Answer Section",
      type: "boolean",
      description: "Whether to include a short answer section",
      defaultValue: false
    },
    {
      id: "number-of-questions",
      label: "Total Number of Questions",
      type: "number",
      description: "The total number of questions across all sections",
      defaultValue: 20
    },
    {
      id: "difficulty",
      label: "Difficulty Level",
      type: "enum",
      description: "The difficulty level of the quiz",
      enumOptions: ["Easy", "Medium", "Hard"],
      defaultValue: "Medium"
    },
    {
      id: "include-answer-key",
      label: "Include Answer Key",
      type: "boolean",
      description: "Whether to include an answer key",
      defaultValue: true
    }
  ]
};

export default vocabularyQuizTemplate;