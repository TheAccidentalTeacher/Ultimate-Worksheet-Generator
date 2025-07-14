import { WorksheetTemplate } from "./types";

const storyStarterPromptsTemplate: WorksheetTemplate = {
  id: "story-starter-prompts",
  name: "Story Starter Prompts",
  category: "Creative Writing",
  description: "A worksheet with creative writing prompts that provide the beginning of a story for students to continue and complete.",
  gradeRange: [2, 6],
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
      description: "The title of the worksheet, e.g., 'Finish the Story!'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students, e.g., 'Read the beginning of the story below. Use your imagination to continue and complete the story.'",
      required: true
    },
    {
      id: "story-starter",
      label: "Story Starter",
      type: "text",
      description: "The beginning of a story that students will continue",
      required: true
    },
    {
      id: "writing-space",
      label: "Writing Space",
      type: "custom",
      description: "Lined space for students to write their story continuation",
      required: true
    },
    {
      id: "illustration-prompt",
      label: "Illustration Prompt",
      type: "text",
      description: "Optional prompt asking students to illustrate their story",
      required: false
    },
    {
      id: "illustration-space",
      label: "Illustration Space",
      type: "custom",
      description: "Space for students to draw an illustration for their story",
      required: false
    }
  ],
  imageRequirements: [],
  customizationOptions: [
    {
      id: "story-theme",
      label: "Story Theme",
      type: "enum",
      description: "The theme of the story starter",
      enumOptions: ["Adventure", "Fantasy", "Mystery", "Science Fiction", "Historical", "Everyday Life"],
      defaultValue: "Adventure"
    },
    {
      id: "writing-space-lines",
      label: "Number of Writing Lines",
      type: "number",
      description: "The number of lines to provide for writing",
      defaultValue: 15
    },
    {
      id: "include-illustration-space",
      label: "Include Illustration Space",
      type: "boolean",
      description: "Whether to include space for students to illustrate their story",
      defaultValue: true
    },
    {
      id: "include-vocabulary-words",
      label: "Include Vocabulary Words",
      type: "boolean",
      description: "Whether to include vocabulary words that students should try to use in their story",
      defaultValue: false
    },
    {
      id: "writing-prompts",
      label: "Additional Writing Prompts",
      type: "boolean",
      description: "Whether to include additional prompts to help students develop their story",
      defaultValue: false
    }
  ]
};

export default storyStarterPromptsTemplate;