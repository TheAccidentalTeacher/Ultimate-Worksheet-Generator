import { WorksheetTemplate } from "./types";

const historicalTimelineTemplate: WorksheetTemplate = {
  id: "historical-timeline",
  name: "Historical Events Timeline",
  category: "Timeline & Sequence",
  description: "A worksheet where students organize historical events in chronological order on a timeline.",
  gradeRange: [3, 8],
  subjects: ["History"],
  layout: {
    orientation: "landscape",
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
      description: "The title of the worksheet, e.g., 'American Revolution Timeline'",
      required: true
    },
    {
      id: "instructions",
      label: "Instructions",
      type: "text",
      description: "Instructions for students, e.g., 'Place the historical events in the correct order on the timeline.'",
      required: true
    },
    {
      id: "timeline",
      label: "Timeline",
      type: "custom",
      description: "A visual timeline with dates and spaces for events",
      required: true
    },
    {
      id: "events",
      label: "Historical Events",
      type: "text",
      description: "List of historical events to be placed on the timeline",
      required: true
    },
    {
      id: "event-descriptions",
      label: "Event Descriptions",
      type: "text",
      description: "Brief descriptions of each historical event",
      required: false
    },
    {
      id: "event-images",
      label: "Event Images",
      type: "image",
      description: "Images representing the historical events",
      required: false
    }
  ],
  imageRequirements: [
    {
      slotId: "event-images",
      description: "Historical images representing key events on the timeline",
      required: false,
      source: "Stock"
    }
  ],
  customizationOptions: [
    {
      id: "timeline-period",
      label: "Timeline Period",
      type: "enum",
      description: "The historical period for the timeline",
      enumOptions: [
        "Ancient Civilizations", 
        "Middle Ages", 
        "Renaissance", 
        "American Revolution", 
        "Civil War", 
        "World War I", 
        "World War II", 
        "Civil Rights Movement", 
        "Modern Era"
      ],
      defaultValue: "American Revolution"
    },
    {
      id: "timeline-style",
      label: "Timeline Style",
      type: "enum",
      description: "The visual style of the timeline",
      enumOptions: ["Horizontal Line", "Vertical Line", "Zigzag", "Circular"],
      defaultValue: "Horizontal Line"
    },
    {
      id: "number-of-events",
      label: "Number of Events",
      type: "number",
      description: "The number of events to include on the timeline",
      defaultValue: 8
    },
    {
      id: "include-dates",
      label: "Include Dates",
      type: "boolean",
      description: "Whether to include dates on the timeline",
      defaultValue: true
    },
    {
      id: "include-images",
      label: "Include Images",
      type: "boolean",
      description: "Whether to include images for the events",
      defaultValue: false
    },
    {
      id: "include-descriptions",
      label: "Include Descriptions",
      type: "boolean",
      description: "Whether to include descriptions of the events",
      defaultValue: false
    },
    {
      id: "difficulty",
      label: "Difficulty Level",
      type: "enum",
      description: "The difficulty level of the timeline activity",
      enumOptions: ["Easy", "Medium", "Hard"],
      defaultValue: "Medium"
    }
  ]
};

export default historicalTimelineTemplate;