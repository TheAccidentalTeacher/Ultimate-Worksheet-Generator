import { WORKSHEET_TEMPLATES } from "./templates";
import { WorksheetTemplate } from "./templates/types";

/**
 * Test script to validate all worksheet templates
 */

// Function to validate a single template
function validateTemplate(template: WorksheetTemplate): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!template.id) errors.push(`Missing id in template: ${template.name || 'Unnamed template'}`);
  if (!template.name) errors.push(`Missing name in template: ${template.id || 'No ID'}`);
  if (!template.category) errors.push(`Missing category in template: ${template.id || 'No ID'}`);
  if (!template.description) errors.push(`Missing description in template: ${template.id || 'No ID'}`);
  if (!template.gradeRange) errors.push(`Missing gradeRange in template: ${template.id || 'No ID'}`);
  if (!template.subjects || template.subjects.length === 0) errors.push(`Missing subjects in template: ${template.id || 'No ID'}`);
  if (!template.layout) errors.push(`Missing layout in template: ${template.id || 'No ID'}`);
  if (!template.contentSlots || template.contentSlots.length === 0) errors.push(`Missing contentSlots in template: ${template.id || 'No ID'}`);
  
  // Check grade range validity
  if (template.gradeRange && (template.gradeRange[0] > template.gradeRange[1])) {
    errors.push(`Invalid grade range in template ${template.id}: [${template.gradeRange[0]}, ${template.gradeRange[1]}]`);
  }
  
  // Check content slots
  if (template.contentSlots) {
    const contentSlotIds = new Set<string>();
    template.contentSlots.forEach(slot => {
      if (!slot.id) errors.push(`Missing id in content slot in template: ${template.id}`);
      if (!slot.label) errors.push(`Missing label in content slot: ${slot.id || 'No ID'} in template: ${template.id}`);
      if (!slot.type) errors.push(`Missing type in content slot: ${slot.id || 'No ID'} in template: ${template.id}`);
      if (!slot.description) errors.push(`Missing description in content slot: ${slot.id || 'No ID'} in template: ${template.id}`);
      
      // Check for duplicate content slot IDs
      if (slot.id) {
        if (contentSlotIds.has(slot.id)) {
          errors.push(`Duplicate content slot ID: ${slot.id} in template: ${template.id}`);
        } else {
          contentSlotIds.add(slot.id);
        }
      }
    });
  }
  
  // Check image requirements
  if (template.imageRequirements) {
    template.imageRequirements.forEach(imgReq => {
      if (!imgReq.slotId) errors.push(`Missing slotId in image requirement in template: ${template.id}`);
      if (!imgReq.description) errors.push(`Missing description in image requirement: ${imgReq.slotId || 'No ID'} in template: ${template.id}`);
      
      // Check if the slotId references a valid content slot
      if (imgReq.slotId && template.contentSlots) {
        const contentSlotExists = template.contentSlots.some(slot => slot.id === imgReq.slotId);
        if (!contentSlotExists) {
          errors.push(`Image requirement references non-existent content slot: ${imgReq.slotId} in template: ${template.id}`);
        }
      }
    });
  }
  
  // Check customization options
  if (template.customizationOptions) {
    const customizationOptionIds = new Set<string>();
    template.customizationOptions.forEach(option => {
      if (!option.id) errors.push(`Missing id in customization option in template: ${template.id}`);
      if (!option.label) errors.push(`Missing label in customization option: ${option.id || 'No ID'} in template: ${template.id}`);
      if (!option.type) errors.push(`Missing type in customization option: ${option.id || 'No ID'} in template: ${template.id}`);
      if (!option.description) errors.push(`Missing description in customization option: ${option.id || 'No ID'} in template: ${template.id}`);
      
      // Check for enum options if type is enum
      if (option.type === 'enum' && (!option.enumOptions || option.enumOptions.length === 0)) {
        errors.push(`Missing enumOptions in enum customization option: ${option.id || 'No ID'} in template: ${template.id}`);
      }
      
      // Check for duplicate customization option IDs
      if (option.id) {
        if (customizationOptionIds.has(option.id)) {
          errors.push(`Duplicate customization option ID: ${option.id} in template: ${template.id}`);
        } else {
          customizationOptionIds.add(option.id);
        }
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Function to check for duplicate template IDs
function checkDuplicateIds(templates: WorksheetTemplate[]): string[] {
  const errors: string[] = [];
  const templateIds = new Set<string>();
  
  templates.forEach(template => {
    if (template.id) {
      if (templateIds.has(template.id)) {
        errors.push(`Duplicate template ID: ${template.id}`);
      } else {
        templateIds.add(template.id);
      }
    }
  });
  
  return errors;
}

// Main validation function
function validateAllTemplates(): void {
  console.log(`Validating ${WORKSHEET_TEMPLATES.length} worksheet templates...`);
  
  // Check for duplicate template IDs
  const duplicateIdErrors = checkDuplicateIds(WORKSHEET_TEMPLATES);
  if (duplicateIdErrors.length > 0) {
    console.error('Duplicate template ID errors:');
    duplicateIdErrors.forEach(error => console.error(`- ${error}`));
  }
  
  // Validate each template
  let validCount = 0;
  let invalidCount = 0;
  
  WORKSHEET_TEMPLATES.forEach(template => {
    const { valid, errors } = validateTemplate(template);
    
    if (valid) {
      validCount++;
    } else {
      invalidCount++;
      console.error(`\nErrors in template: ${template.id || 'No ID'}`);
      errors.forEach(error => console.error(`- ${error}`));
    }
  });
  
  // Print summary
  console.log('\nValidation Summary:');
  console.log(`- Total templates: ${WORKSHEET_TEMPLATES.length}`);
  console.log(`- Valid templates: ${validCount}`);
  console.log(`- Invalid templates: ${invalidCount}`);
  console.log(`- Duplicate ID errors: ${duplicateIdErrors.length}`);
  
  if (invalidCount === 0 && duplicateIdErrors.length === 0) {
    console.log('\n✅ All templates are valid!');
  } else {
    console.error('\n❌ Some templates have validation errors.');
  }
}

// Run validation
validateAllTemplates();