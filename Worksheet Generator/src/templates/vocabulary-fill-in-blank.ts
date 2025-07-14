import { WorksheetTemplate } from "./types";

const vocabularyFillInBlankTemplate: WorksheetTemplate = {
  id: "vocabulary-fill-in-blank",
  name: "Vocabulary Fill-in-the-Blank",
  category: "Fill-in-the-Blank",
  description: "A worksheet where students fill in blanks in sentences with appropriate vocabulary words from a word bank.",
  gradeRange: [2, 5],
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
      description: "The title of the worksheet, e.g., 'Complete the Sentences with Vocabulary Words'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students, e.g., 'Fill in each blank with the correct word from the word bank.'",
      required: true
    },
    {
      id: "word-bank",
      label: "Word Bank",
      type: "text",
      description: "List of vocabulary words for students to use in filling the blanks",
      required: true
    },
    {
      id: "sentences",
      label: "Sentences with Blanks",
      type: "text",
      description: "A set of sentences with blanks where vocabulary words should be inserted",
      required: true
    },
    {
      id: "illustration",
      label: "Illustration",
      type: "image",
      description: "An optional illustration related to the vocabulary theme",
      required: false
    }
  ],
  imageRequirements: [
    {
      slotId: "illustration",
      description: "An illustration that represents the theme of the vocabulary words",
      required: false,
      source: "AI"
    }
  ],
  customizationOptions: [
    {
      id: "show-word-bank",
      label: "Show Word Bank",
      type: "boolean",
      description: "Whether to show a word bank with the vocabulary words",
      defaultValue: true
    },
    {
      id: "number-of-sentences",
      label: "Number of Sentences",
      type: "number",
      description: "The number of sentences to include in the worksheet",
      defaultValue: 10
    },
    {
      id: "vocabulary-theme",
      label: "Vocabulary Theme",
      type: "enum",
      description: "The theme of the vocabulary words",
      enumOptions: ["Animals", "Weather", "Food", "Sports", "Travel", "School"],
      defaultValue: "Animals"
    },
    {
      id: "include-word-definitions",
      label: "Include Word Definitions",
      type: "boolean",
      description: "Whether to include definitions of the vocabulary words",
      defaultValue: false
    }
  ]
};

export default vocabularyFillInBlankTemplate;