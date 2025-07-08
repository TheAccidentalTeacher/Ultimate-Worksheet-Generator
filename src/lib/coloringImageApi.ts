// Client utility to call the coloring image API
export async function generateColoringImage(prompt: string): Promise<string | null> {
  const res = await fetch('/api/generate-coloring-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.imageUrl || null;
}
