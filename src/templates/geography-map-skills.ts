import { WorksheetTemplate } from "./types";

const geographyMapSkillsTemplate: WorksheetTemplate = {
  id: "geography-map-skills",
  name: "Geography Map Skills",
  category: "Labeling & Identification",
  description: "A worksheet for students to practice map skills by labeling countries, states, capitals, landforms, and other geographical features.",
  gradeRange: [3, 8],
  subjects: ["Geography"],
  layout: {
    orientation: "landscape",
    columns: 1,
    header: true,
    footer: true,
    colorScheme: "colorful",
    font: "Arial"
  },
  contentSlots: [
    {
      id: "title",
      label: "Worksheet Title",
      type: "text",
      description: "The title of the worksheet, e.g., 'United States Map Skills'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students, e.g., 'Label the states and their capitals on the map.'",
      required: true
    },
    {
      id: "map",
      label: "Map",
      type: "image",
      description: "A map image with blank labels for students to fill in",
      required: true
    },
    {
      id: "word-bank",
      label: "Word Bank",
      type: "text",
      description: "List of geographical names for students to use in labeling",
      required: false
    },
    {
      id: "legend",
      label: "Map Legend",
      type: "custom",
      description: "A legend explaining map symbols and colors",
      required: false
    },
    {
      id: "compass-rose",
      label: "Compass Rose",
      type: "image",
      description: "A compass rose showing cardinal directions",
      required: false
    },
    {
      id: "additional-questions",
      label: "Additional Questions",
      type: "text",
      description: "Additional geography questions related to the map",
      required: false
    }
  ],
  imageRequirements: [
    {
      slotId: "map",
      description: "A clear, age-appropriate map with outlines of geographical features to be labeled",
      required: true,
      source: "Stock",
      aspectRatio: "16:9"
    },
    {
      slotId: "compass-rose",
      description: "A simple compass rose showing cardinal directions",
      required: false,
      source: "Stock"
    }
  ],
  customizationOptions: [
    {
      id: "map-region",
      label: "Map Region",
      type: "enum",
      description: "The geographical region shown on the map",
      enumOptions: [
        "United States", 
        "North America", 
        "South America", 
        "Europe", 
        "Africa", 
        "Asia", 
        "Australia", 
        "World"
      ],
      defaultValue: "United States"
    },
    {
      id: "feature-type",
      label: "Feature Type",
      type: "enum",
      description: "The type of geographical features to label",
      enumOptions: [
        "Countries/States", 
        "Capitals", 
        "Major Cities", 
        "Bodies of Water", 
        "Mountains/Landforms", 
        "Mixed Features"
      ],
      defaultValue: "Countries/States"
    },
    {
      id: "include-word-bank",
      label: "Include Word Bank",
      type: "boolean",
      description: "Whether to include a word bank with the names of features",
      defaultValue: true
    },
    {
      id: "include-legend",
      label: "Include Legend",
      type: "boolean",
      description: "Whether to include a map legend",
      defaultValue: true
    },
    {
      id: "include-compass-rose",
      label: "Include Compass Rose",
      type: "boolean",
      description: "Whether to include a compass rose",
      defaultValue: true
    },
    {
      id: "include-additional-questions",
      label: "Include Additional Questions",
      type: "boolean",
      description: "Whether to include additional geography questions",
      defaultValue: false
    },
    {
      id: "map-style",
      label: "Map Style",
      type: "enum",
      description: "The visual style of the map",
      enumOptions: ["Political", "Physical", "Thematic", "Outline"],
      defaultValue: "Political"
    },
    {
      id: "difficulty",
      label: "Difficulty Level",
      type: "enum",
      description: "The difficulty level of the labeling activity",
      enumOptions: ["Easy", "Medium", "Hard"],
      defaultValue: "Medium"
    }
  ]
};

export default geographyMapSkillsTemplate;