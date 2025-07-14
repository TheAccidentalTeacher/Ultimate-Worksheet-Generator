import { WorksheetTemplate } from "./types";

const animalHabitatMatchingTemplate: WorksheetTemplate = {
  id: "animal-habitat-matching",
  name: "Animal and Habitat Matching",
  category: "Matching & Sorting",
  description: "A worksheet where students match different animals to their natural habitats through drawing lines or writing corresponding letters/numbers.",
  gradeRange: [1, 4],
  subjects: ["Science"],
  layout: {
    orientation: "landscape",
    columns: 2,
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
      description: "The title of the worksheet, e.g., 'Match the Animals to Their Habitats'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students, e.g., 'Draw a line to match each animal with its habitat.'",
      required: true
    },
    {
      id: "animals",
      label: "Animals List",
      type: "text",
      description: "List of animals to be matched with habitats",
      required: true
    },
    {
      id: "habitats",
      label: "Habitats List",
      type: "text",
      description: "List of habitats to be matched with animals",
      required: true
    },
    {
      id: "animal-images",
      label: "Animal Images",
      type: "image",
      description: "Images of the animals listed",
      required: false
    },
    {
      id: "habitat-images",
      label: "Habitat Images",
      type: "image",
      description: "Images of the habitats listed",
      required: false
    }
  ],
  imageRequirements: [
    {
      slotId: "animal-images",
      description: "Clear, age-appropriate images of various animals",
      required: false,
      source: "Stock"
    },
    {
      slotId: "habitat-images",
      description: "Clear, age-appropriate images of various habitats",
      required: false,
      source: "Stock"
    }
  ],
  customizationOptions: [
    {
      id: "matching-type",
      label: "Matching Type",
      type: "enum",
      description: "The type of matching activity",
      enumOptions: ["Draw Lines", "Write Letters", "Write Numbers", "Cut and Paste"],
      defaultValue: "Draw Lines"
    },
    {
      id: "number-of-matches",
      label: "Number of Matches",
      type: "number",
      description: "The number of animal-habitat pairs to include",
      defaultValue: 6
    },
    {
      id: "include-images",
      label: "Include Images",
      type: "boolean",
      description: "Whether to include images of animals and habitats",
      defaultValue: true
    },
    {
      id: "difficulty",
      label: "Difficulty Level",
      type: "enum",
      description: "The difficulty level of the matches",
      enumOptions: ["Easy", "Medium", "Hard"],
      defaultValue: "Medium"
    }
  ]
};

export default animalHabitatMatchingTemplate;