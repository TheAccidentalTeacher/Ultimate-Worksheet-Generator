import { WorksheetTemplate } from "./types";

const mathWordProblemsTemplate: WorksheetTemplate = {
  id: "math-word-problems",
  name: "Math Word Problems",
  category: "Math Practice",
  description: "A worksheet with word problems that require students to apply mathematical concepts to real-world scenarios.",
  gradeRange: [2, 6],
  subjects: ["Math"],
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
      description: "The title of the worksheet, e.g., 'Math Word Problems'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students, e.g., 'Solve each word problem. Show your work.'",
      required: true
    },
    {
      id: "problems",
      label: "Word Problems",
      type: "text",
      description: "A set of word problems for students to solve",
      required: true
    },
    {
      id: "work-space",
      label: "Work Space",
      type: "custom",
      description: "Space for students to show their work for each problem",
      required: true
    },
    {
      id: "answer-space",
      label: "Answer Space",
      type: "custom",
      description: "Space for students to write their final answers",
      required: true
    },
    {
      id: "illustrations",
      label: "Problem Illustrations",
      type: "image",
      description: "Optional illustrations to accompany word problems",
      required: false
    }
  ],
  imageRequirements: [
    {
      slotId: "illustrations",
      description: "Simple illustrations that help visualize the word problems",
      required: false,
      source: "AI"
    }
  ],
  customizationOptions: [
    {
      id: "math-operation",
      label: "Math Operation",
      type: "enum",
      description: "The primary mathematical operation featured in the problems",
      enumOptions: ["Addition", "Subtraction", "Multiplication", "Division", "Mixed Operations"],
      defaultValue: "Mixed Operations"
    },
    {
      id: "problem-theme",
      label: "Problem Theme",
      type: "enum",
      description: "The theme of the word problems",
      enumOptions: ["Money", "Time", "Measurement", "Food", "Sports", "Travel", "Animals"],
      defaultValue: "Money"
    },
    {
      id: "number-of-problems",
      label: "Number of Problems",
      type: "number",
      description: "The number of word problems to include",
      defaultValue: 5
    },
    {
      id: "include-illustrations",
      label: "Include Illustrations",
      type: "boolean",
      description: "Whether to include illustrations for the problems",
      defaultValue: true
    },
    {
      id: "include-hints",
      label: "Include Hints",
      type: "boolean",
      description: "Whether to include hints for solving the problems",
      defaultValue: false
    },
    {
      id: "difficulty",
      label: "Difficulty Level",
      type: "enum",
      description: "The difficulty level of the problems",
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

export default mathWordProblemsTemplate;