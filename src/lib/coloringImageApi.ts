// Client utility to call the coloring image API
export async function generateColoringImage(
  prompt: string, 
  preferDalle = false, 
  theme?: string, 
  ageGroup?: string, 
  style?: string
): Promise<string | null> {
  try {
    console.log('[CLIENT] Requesting coloring image:', { prompt, theme, ageGroup, style });
    
    const res = await fetch('/api/generate-coloring-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, theme, ageGroup, style }),
    });
    
    if (!res.ok) {
      console.error('[CLIENT] API request failed:', res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    console.log('[CLIENT] API response:', data.source ? `Generated with ${data.source}` : 'No source info');
    
    return data.imageUrl || null;
  } catch (error) {
    console.error('[CLIENT] Error calling coloring image API:', error);
    return null;
  }
}
