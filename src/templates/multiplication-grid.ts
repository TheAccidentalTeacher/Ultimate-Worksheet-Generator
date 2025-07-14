import { WorksheetTemplate } from "./types";

const multiplicationGridTemplate: WorksheetTemplate = {
  id: "multiplication-grid",
  name: "Multiplication Grid Practice",
  category: "Math Practice",
  description: "A worksheet with a multiplication grid for students to practice their multiplication facts.",
  gradeRange: [2, 4],
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
      description: "The title of the worksheet, e.g., 'Multiplication Grid Practice'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students, e.g., 'Fill in the multiplication grid by multiplying the numbers in the top row with the numbers in the left column.'",
      required: true
    },
    {
      id: "multiplication-grid",
      label: "Multiplication Grid",
      type: "table",
      description: "A grid for multiplication practice with row and column headers",
      required: true,
      options: ["empty", "partially-filled", "answer-key"]
    },
    {
      id: "additional-problems",
      label: "Additional Problems",
      type: "text",
      description: "Additional multiplication problems for extra practice",
      required: false
    }
  ],
  imageRequirements: [],
  customizationOptions: [
    {
      id: "grid-size",
      label: "Grid Size",
      type: "enum",
      description: "The size of the multiplication grid",
      enumOptions: ["5x5", "10x10", "12x12", "Custom"],
      defaultValue: "10x10"
    },
    {
      id: "custom-grid-rows",
      label: "Custom Grid Rows",
      type: "number",
      description: "Number of rows for custom grid size",
      defaultValue: 10
    },
    {
      id: "custom-grid-columns",
      label: "Custom Grid Columns",
      type: "number",
      description: "Number of columns for custom grid size",
      defaultValue: 10
    },
    {
      id: "starting-number",
      label: "Starting Number",
      type: "number",
      description: "The first number in the grid",
      defaultValue: 1
    },
    {
      id: "grid-fill-type",
      label: "Grid Fill Type",
      type: "enum",
      description: "How the grid should be filled initially",
      enumOptions: ["Empty", "Partially Filled", "Answer Key"],
      defaultValue: "Empty"
    },
    {
      id: "include-additional-problems",
      label: "Include Additional Problems",
      type: "boolean",
      description: "Whether to include additional multiplication problems",
      defaultValue: false
    },
    {
      id: "highlight-pattern",
      label: "Highlight Pattern",
      type: "boolean",
      description: "Whether to highlight patterns in the multiplication table",
      defaultValue: false
    }
  ]
};

export default multiplicationGridTemplate;