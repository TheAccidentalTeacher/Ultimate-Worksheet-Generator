# WorksheetWise Prompt Kitchen Template

## 1. Worksheet Generation (Text/LLM Prompts)

### When
- Parent requests a worksheet (after selecting grade, subject, topic, etc.)

### Prompt Template
```
SYSTEM PROMPT (for LLM, e.g., GPT-4)
-------------------------------------
You are an expert homeschool educator who creates engaging, age-appropriate worksheets.

Grade Level: {grade}
Subject: {subject}
Topic: {topic}
Style: {worksheetStyle}
Christian Content: {christianLevel}
Scaffolding: {scaffolding}
Difficulty: {differentiation}
Duration: {timeEstimate}

IMPORTANT SUBJECT-SPECIFIC GUIDELINES:
{subjectInfo.specialInstructions}

Recommended activity types for {subject}: {subjectInfo.activityTypes.join(', ')}

For Christian content levels:
- Secular: No religious content
- Gently Christian: Occasional positive biblical worldview, wholesome values
- Moderately Christian: Regular scripture references, biblical principles woven in naturally
- Richly Biblical: Heavy scripture integration, explicit faith connections, biblical applications

Return a JSON object with this exact structure:
{ ... }
```

---

## 2. Coloring Sheet Generation (Image Prompts)

### When
- For each coloring page, after worksheet or coloring sheet is generated.

### Prompt Template
```
IMAGE GENERATION PROMPT (for SDXL or other model)
-------------------------------------------------
{page.title}: {page.description}, black and white line art, coloring book page, simple, thick outlines, no shading, no color, high contrast, kid friendly, vector, clear background, centered subject, minimal background, for children to color

Negative Prompt:
color, photorealistic, realistic, 3d, shadow, blur, text, watermark, signature, background, grayscale, filled, painting, sketch, pencil, soft, blurry, low quality, cropped, cut off, extra limbs, extra objects, duplicate, error
```

---

## 3. Scope & Sequence Suggestion (for Parent Guidance)

### When
- Parent selects a grade and subject (or non-academic track).

### Prompt Template (if using LLM)
```
SCOPE & SEQUENCE SUGGESTION PROMPT
----------------------------------
You are an expert curriculum designer. List the most important topics, skills, and concepts that should be covered in {subject} for grade {grade}. Include both academic and character-building/non-academic elements if relevant. Return as a JSON array of strings.
```

---

## 4. [OPTIONAL] Add your own prompt recipes, negative prompts, or process notes below:

```
# Add your custom prompt templates, process steps, or notes here

```

---

## 5. [OPTIONAL] Example: Scope & Sequence for 3rd Grade Science

- Life cycles of plants and animals
- Weather and climate basics
- Simple machines
- Scientific method and experiments
- Environmental stewardship
- (etc.)

---

# Instructions
- Edit this file in your favorite editor or in another GPT chat.
- Add, remove, or modify any prompt templates, process steps, or notes.
- When ready, upload or paste the updated file back to me and I will implement your changes in the codebase.
