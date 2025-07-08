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
    // Step 4: Visual asset selection (intelligent, robust)
    if (worksheet && worksheet.visualAssets && Array.isArray(worksheet.visualAssets)) {
      const { searchUnsplashImages } = await import('./api-services/unsplashService');
      const { searchWikimediaImages } = await import('./api-services/wikimediaService');
      const { searchPixabayImages } = await import('./api-services/pixabayService');
      const { generateAiImage } = await import('./api-services/imageGenerationService');
      for (let i = 0; i < worksheet.visualAssets.length; i++) {
        const asset = worksheet.visualAssets[i];
        this.progressCallback(55 + Math.floor((i * 30) / worksheet.visualAssets.length), `Preparing visual asset ${i + 1} of ${worksheet.visualAssets.length}...`);
        const sourceDecision = await this.determineOptimalImageSource(asset, userSelections);
        let imageResult;
        if (sourceDecision.recommendedSource === 'ai-generation') {
          imageResult = await generateAiImage(sourceDecision.enhancedPrompt);
          asset.imageUrl = imageResult.url;
          asset.source = 'AI Generated';
        } else if (sourceDecision.recommendedSource === 'wikimedia') {
          const wikimediaResults = await searchWikimediaImages(sourceDecision.enhancedQuery);
          if (wikimediaResults.length > 0) {
            asset.imageUrl = wikimediaResults[0].url;
            asset.source = 'Wikimedia Commons';
            asset.attribution = wikimediaResults[0].author;
            asset.license = wikimediaResults[0].license;
          } else {
            imageResult = await generateAiImage(sourceDecision.enhancedPrompt);
            asset.imageUrl = imageResult.url;
            asset.source = 'AI Generated (Wikimedia fallback)';
          }
        } else if (sourceDecision.recommendedSource === 'unsplash') {
          const unsplashResults = await searchUnsplashImages(sourceDecision.enhancedQuery);
          if (unsplashResults.length > 0) {
            asset.imageUrl = unsplashResults[0].url;
            asset.source = 'Unsplash';
            asset.attribution = unsplashResults[0].photographer;
            asset.attributionUrl = unsplashResults[0].photographerUrl;
          } else {
            imageResult = await generateAiImage(sourceDecision.enhancedPrompt);
            asset.imageUrl = imageResult.url;
            asset.source = 'AI Generated (Unsplash fallback)';
          }
        } else if (sourceDecision.recommendedSource === 'pixabay') {
          const pixabayResults = await searchPixabayImages(sourceDecision.enhancedQuery, sourceDecision.imageType, 3);
          if (pixabayResults.length > 0) {
            asset.imageUrl = pixabayResults[0].url;
            asset.source = 'Pixabay';
          } else {
            imageResult = await generateAiImage(sourceDecision.enhancedPrompt);
            asset.imageUrl = imageResult.url;
            asset.source = 'AI Generated (Pixabay fallback)';
          }
        }
      }
    }
    this.progressCallback(90, 'Formatting final worksheet...');
    await this.sleep(300);
    this.progressCallback(100, 'Worksheet ready!');
    return worksheet;
  async determineOptimalImageSource(asset: any, userSelections: any) {
    const { openai } = await import('./api-services/openaiService');
    const prompt = `As an expert educational content curator, analyze this visual asset request and determine the optimal source.\n\n## VISUAL ASSET DETAILS\nDescription: ${asset.description}\nPurpose: ${asset.purpose}\nEducational Context: ${userSelections.grade} grade ${userSelections.subject} about ${userSelections.topic}\n\n## AVAILABLE IMAGE SOURCES\n1. Wikimedia Commons - Best for: historical images, scientific diagrams, maps, public domain educational content\n2. Unsplash - Best for: high-quality photographs, modern settings, nature, general concepts\n3. Pixabay - Best for: illustrations, clipart, simple diagrams\n4. AI Image Generation - Best for: custom educational illustrations, coloring pages, conceptual diagrams not readily available in stock photos\n\n## SPECIAL CONSIDERATIONS\n- For K-6 grade coloring pages, AI generation is typically best\n- For historical figures/events, Wikimedia Commons usually has authentic images\n- For abstract concepts, AI generation may create the most relevant educational illustration\n- For general photographs of nature, places, or common objects, stock photos are often best\n\n## REQUIRED OUTPUT\nProvide your analysis as a JSON object with the following structure:\n{\n  "recommendedSource": "wikimedia|unsplash|pixabay|ai-generation",\n  "rationale": "Brief explanation of why this source is best",\n  "enhancedQuery": "Optimized search query for stock photo APIs",\n  "enhancedPrompt": "Optimized prompt for AI image generation",\n  "imageType": "photo|illustration|vector|all"\n}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.3
    });
    try {
      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
      // Fallback to AI generation if parsing fails
      return {
        recommendedSource: 'ai-generation',
        rationale: 'Fallback due to decision processing error',
        enhancedQuery: asset.description,
        enhancedPrompt: `Educational illustration for ${userSelections.grade} grade ${userSelections.subject} about ${asset.description}. ${asset.purpose}`,
        imageType: 'all'
      };
    }
  }
  }

  buildPrompt(userSelections: any) {
    // TODO: Use your prompt-kitchen-template.md for full prompt logic
    // This is a minimal version for now
    return `You are an expert homeschool educator who creates engaging, age-appropriate worksheets.\n\nGrade Level: ${userSelections.grade}\nSubject: ${userSelections.subject}\nTopic: ${userSelections.topic}\nStyle: ${userSelections.worksheetStyle}\nChristian Content: ${userSelections.christianContent}\nScaffolding: ${userSelections.scaffolding}\nDifficulty: ${userSelections.differentiation}\nDuration: ${userSelections.timeEstimate}\n\nIMPORTANT SUBJECT-SPECIFIC GUIDELINES: ${userSelections.subjectInfo?.specialInstructions || ''}\n\nReturn a JSON object with this exact structure: { ... }`;
  }

  async determineOptimalImageSource(asset: any, userSelections: any) {
    const { openai } = await import('./api-services/openaiService');
    const prompt = `As an expert educational content curator, analyze this visual asset request and determine the optimal source.\n\n## VISUAL ASSET DETAILS\nDescription: ${asset.description}\nPurpose: ${asset.purpose}\nEducational Context: ${userSelections.grade} grade ${userSelections.subject} about ${userSelections.topic}\n\n## AVAILABLE IMAGE SOURCES\n1. Wikimedia Commons - Best for: historical images, scientific diagrams, maps, public domain educational content\n2. Unsplash - Best for: high-quality photographs, modern settings, nature, general concepts\n3. Pixabay - Best for: illustrations, clipart, simple diagrams\n4. AI Image Generation - Best for: custom educational illustrations, coloring pages, conceptual diagrams not readily available in stock photos\n\n## SPECIAL CONSIDERATIONS\n- For K-6 grade coloring pages, AI generation is typically best\n- For historical figures/events, Wikimedia Commons usually has authentic images\n- For abstract concepts, AI generation may create the most relevant educational illustration\n- For general photographs of nature, places, or common objects, stock photos are often best\n\n## REQUIRED OUTPUT\nProvide your analysis as a JSON object with the following structure:\n{\n  "recommendedSource": "wikimedia|unsplash|pixabay|ai-generation",\n  "rationale": "Brief explanation of why this source is best",\n  "enhancedQuery": "Optimized search query for stock photo APIs",\n  "enhancedPrompt": "Optimized prompt for AI image generation",\n  "imageType": "photo|illustration|vector|all"\n}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.3
    });
    try {
      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
      // Fallback to AI generation if parsing fails
      return {
        recommendedSource: 'ai-generation',
        rationale: 'Fallback due to decision processing error',
        enhancedQuery: asset.description,
        enhancedPrompt: `Educational illustration for ${userSelections.grade} grade ${userSelections.subject} about ${asset.description}. ${asset.purpose}`,
        imageType: 'all'
      };
    }
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
