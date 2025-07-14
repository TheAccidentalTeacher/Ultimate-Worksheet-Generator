import { WorksheetTemplate } from "./types";

const scienceExperimentWorksheetTemplate: WorksheetTemplate = {
  id: "science-experiment-worksheet",
  name: "Science Experiment Documentation",
  category: "Labeling & Identification",
  description: "A structured worksheet for students to document their science experiments, including hypothesis, materials, procedure, observations, and conclusions.",
  gradeRange: [3, 8],
  subjects: ["Science"],
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
      description: "The title of the worksheet, e.g., 'My Science Experiment: Plant Growth'",
      required: true
    },
    {
      id: "student-info",
      label: "Student Information",
      type: "input",
      description: "Fields for student name, date, and class",
      required: true
    },
    {
      id: "experiment-question",
      label: "Experiment Question",
      type: "text",
      description: "The scientific question being investigated",
      required: true
    },
    {
      id: "hypothesis-section",
      label: "Hypothesis Section",
      type: "input",
      description: "Section for students to write their hypothesis",
      required: true
    },
    {
      id: "materials-section",
      label: "Materials Section",
      type: "input",
      description: "Section for students to list materials used",
      required: true
    },
    {
      id: "procedure-section",
      label: "Procedure Section",
      type: "input",
      description: "Section for students to write or number the steps of their procedure",
      required: true
    },
    {
      id: "observations-section",
      label: "Observations Section",
      type: "input",
      description: "Section for students to record their observations",
      required: true
    },
    {
      id: "data-table",
      label: "Data Table",
      type: "table",
      description: "Table for students to record data",
      required: false
    },
    {
      id: "conclusion-section",
      label: "Conclusion Section",
      type: "input",
      description: "Section for students to write their conclusion",
      required: true
    },
    {
      id: "diagram-space",
      label: "Diagram Space",
      type: "custom",
      description: "Space for students to draw diagrams of their experiment",
      required: false
    }
  ],
  imageRequirements: [],
  customizationOptions: [
    {
      id: "experiment-type",
      label: "Experiment Type",
      type: "enum",
      description: "The type of science experiment",
      enumOptions: ["Plant Growth", "Chemical Reactions", "Simple Machines", "Weather", "States of Matter", "Electricity", "Custom"],
      defaultValue: "Plant Growth"
    },
    {
      id: "include-data-table",
      label: "Include Data Table",
      type: "boolean",
      description: "Whether to include a data table",
      defaultValue: true
    },
    {
      id: "include-diagram-space",
      label: "Include Diagram Space",
      type: "boolean",
      description: "Whether to include space for diagrams",
      defaultValue: true
    },
    {
      id: "include-vocabulary-section",
      label: "Include Vocabulary Section",
      type: "boolean",
      description: "Whether to include a section for key vocabulary terms",
      defaultValue: false
    },
    {
      id: "include-reflection-questions",
      label: "Include Reflection Questions",
      type: "boolean",
      description: "Whether to include reflection questions about the experiment",
      defaultValue: false
    },
    {
      id: "structure-level",
      label: "Structure Level",
      type: "enum",
      description: "How much structure to provide in the worksheet",
      enumOptions: ["High (Many Prompts)", "Medium (Some Prompts)", "Low (Few Prompts)"],
      defaultValue: "Medium (Some Prompts)"
    }
  ]
};

export default scienceExperimentWorksheetTemplate;