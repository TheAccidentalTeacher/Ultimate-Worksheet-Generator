// src/lib/api-services/unsplashService.ts
export async function searchUnsplashImages(query: string) {
  const res = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to fetch Unsplash images');
  const data = await res.json();
  return data;
}
