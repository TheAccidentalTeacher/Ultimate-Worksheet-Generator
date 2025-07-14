import { WorksheetTemplate } from "./types";

const labelingPlantPartsTemplate: WorksheetTemplate = {
  id: "labeling-plant-parts",
  name: "Plant Parts Labeling Worksheet",
  category: "Labeling & Identification",
  description: "A worksheet for students to label the different parts of a plant including roots, stem, leaves, and flower.",
  gradeRange: [1, 3],
  subjects: ["Science"],
  layout: {
    orientation: "portrait",
    columns: 1,
    header: true,
    footer: true,
    colorScheme: "colorful",
    font: "Comic Sans MS"
  },
  contentSlots: [
    {
      id: "title",
      label: "Worksheet Title",
      type: "text",
      description: "The title of the worksheet, e.g., 'Label the Parts of a Plant'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students, e.g., 'Draw a line from each word to the correct part of the plant.'",
      required: true
    },
    {
      id: "plant-image",
      label: "Plant Image",
      type: "image",
      description: "An image of a plant with blank labels pointing to different parts",
      required: true
    },
    {
      id: "word-bank",
      label: "Word Bank",
      type: "text",
      description: "List of plant part names for students to use in labeling",
      required: true
    }
  ],
  imageRequirements: [
    {
      slotId: "plant-image",
      description: "Clear image of a plant with arrows or lines pointing to different parts (roots, stem, leaves, flower)",
      required: true,
      source: "AI",
      aspectRatio: "1:1"
    }
  ],
  customizationOptions: [
    {
      id: "show-word-bank",
      label: "Show Word Bank",
      type: "boolean",
      description: "Whether to show a word bank with the plant part names",
      defaultValue: true
    },
    {
      id: "plant-type",
      label: "Plant Type",
      type: "enum",
      description: "The type of plant to show in the image",
      enumOptions: ["Flowering Plant", "Tree", "Vegetable Plant", "Seed Germination"],
      defaultValue: "Flowering Plant"
    },
    {
      id: "difficulty",
      label: "Difficulty Level",
      type: "enum",
      description: "The difficulty level of the worksheet",
      enumOptions: ["Easy", "Medium", "Hard"],
      defaultValue: "Medium"
    }
  ]
};

export default labelingPlantPartsTemplate;