// src/lib/api-services/imageGenerationService.ts
export async function generateAiImage(prompt: string) {
  // This should call your AI image generation API (e.g., DALL-E, SDXL, etc.)
  const res = await fetch('/api/generate-coloring-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('Failed to generate AI image');
  const data = await res.json();
  return data;
}
