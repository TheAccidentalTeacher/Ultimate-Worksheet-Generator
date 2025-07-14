import { WorksheetTemplate } from "./types";

const bibleVerseMemorizationTemplate: WorksheetTemplate = {
  id: "bible-verse-memorization",
  name: "Bible Verse Memorization",
  category: "Fill-in-the-Blank",
  description: "A worksheet to help students memorize Bible verses through fill-in-the-blank exercises, word scrambles, and illustration activities.",
  gradeRange: [1, 8],
  subjects: ["Bible"],
  layout: {
    orientation: "portrait",
    columns: 1,
    header: true,
    footer: true,
    colorScheme: "default",
    font: "Times New Roman"
  },
  contentSlots: [
    {
      id: "title",
      label: "Worksheet Title",
      type: "text",
      description: "The title of the worksheet, e.g., 'Memorize John 3:16'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students on how to complete the worksheet",
      required: true
    },
    {
      id: "verse-reference",
      label: "Verse Reference",
      type: "text",
      description: "The Bible reference for the verse (e.g., 'John 3:16')",
      required: true
    },
    {
      id: "complete-verse",
      label: "Complete Verse",
      type: "text",
      description: "The complete text of the Bible verse",
      required: true
    },
    {
      id: "fill-in-blank-verse",
      label: "Fill-in-the-Blank Verse",
      type: "text",
      description: "The verse with key words replaced by blanks",
      required: true
    },
    {
      id: "word-bank",
      label: "Word Bank",
      type: "text",
      description: "List of words that go in the blanks",
      required: true
    },
    {
      id: "illustration-space",
      label: "Illustration Space",
      type: "custom",
      description: "Space for students to draw an illustration related to the verse",
      required: false
    },
    {
      id: "application-questions",
      label: "Application Questions",
      type: "text",
      description: "Questions that help students apply the verse to their lives",
      required: false
    },
    {
      id: "verse-image",
      label: "Verse Image",
      type: "image",
      description: "An optional decorative image related to the verse",
      required: false
    }
  ],
  imageRequirements: [
    {
      slotId: "verse-image",
      description: "An age-appropriate image that illustrates the meaning of the Bible verse",
      required: false,
      source: "Stock"
    }
  ],
  customizationOptions: [
    {
      id: "bible-translation",
      label: "Bible Translation",
      type: "enum",
      description: "The Bible translation to use for the verse",
      enumOptions: ["KJV", "NIV", "ESV", "NKJV", "NLT"],
      defaultValue: "NIV"
    },
    {
      id: "difficulty-level",
      label: "Difficulty Level",
      type: "enum",
      description: "The difficulty level of the fill-in-the-blank exercise",
      enumOptions: ["Easy (Few Blanks)", "Medium (Some Blanks)", "Hard (Many Blanks)"],
      defaultValue: "Medium (Some Blanks)"
    },
    {
      id: "include-word-bank",
      label: "Include Word Bank",
      type: "boolean",
      description: "Whether to include a word bank with the missing words",
      defaultValue: true
    },
    {
      id: "include-illustration-space",
      label: "Include Illustration Space",
      type: "boolean",
      description: "Whether to include space for students to draw an illustration",
      defaultValue: true
    },
    {
      id: "include-application-questions",
      label: "Include Application Questions",
      type: "boolean",
      description: "Whether to include questions about applying the verse",
      defaultValue: false
    },
    {
      id: "include-word-scramble",
      label: "Include Word Scramble",
      type: "boolean",
      description: "Whether to include a word scramble activity with key words from the verse",
      defaultValue: false
    },
    {
      id: "include-verse-image",
      label: "Include Verse Image",
      type: "boolean",
      description: "Whether to include a decorative image related to the verse",
      defaultValue: true
    }
  ]
};

export default bibleVerseMemorizationTemplate;