// src/lib/ContentGenerator.ts
export class ContentGenerator {
  progressCallback: (percentage: number, message: string) => void;

  constructor({ progressCallback }: { progressCallback: (percentage: number, message: string) => void }) {
    this.progressCallback = progressCallback;
  }

  async generateWorksheet(userSelections: any) {
    this.progressCallback(10, 'Analyzing educational requirements...');
    // Step 1: Assemble prompt
    const prompt = this.buildPrompt(userSelections);
    this.progressCallback(20, 'Generating educational content...');
    // Step 2: Call GPT API
    const { openai } = await import('./api-services/openaiService');
    let worksheetContent;
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2048
      });
      worksheetContent = completion.choices[0]?.message?.content;
      this.progressCallback(40, 'Processing worksheet structure...');
    } catch (err: any) {
      this.progressCallback(100, 'Error: ' + (err.message || 'Failed to generate worksheet'));
      throw err;
    }
    // Step 3: Parse and validate
    let worksheet;
    try {
      worksheet = JSON.parse(worksheetContent || '{}');
    } catch (e) {
      this.progressCallback(100, 'Error: Invalid JSON from LLM');
      throw new Error('Invalid JSON from LLM');
    }
    this.progressCallback(50, 'Planning visual assets...');
    // Step 4: Visual asset selection (placeholder)
    await this.sleep(500);
    this.progressCallback(90, 'Formatting final worksheet...');
    await this.sleep(300);
    this.progressCallback(100, 'Worksheet ready!');
    return worksheet;
  }

  buildPrompt(userSelections: any) {
    // TODO: Use your prompt-kitchen-template.md for full prompt logic
    // This is a minimal version for now
    return `You are an expert homeschool educator who creates engaging, age-appropriate worksheets.\n\nGrade Level: ${userSelections.grade}\nSubject: ${userSelections.subject}\nTopic: ${userSelections.topic}\nStyle: ${userSelections.worksheetStyle}\nChristian Content: ${userSelections.christianContent}\nScaffolding: ${userSelections.scaffolding}\nDifficulty: ${userSelections.differentiation}\nDuration: ${userSelections.timeEstimate}\n\nIMPORTANT SUBJECT-SPECIFIC GUIDELINES: ${userSelections.subjectInfo?.specialInstructions || ''}\n\nReturn a JSON object with this exact structure: { ... }`;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
