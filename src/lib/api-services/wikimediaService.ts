// src/lib/api-services/wikimediaService.ts
export async function searchWikimediaImages(query: string) {
  const res = await fetch(`/api/wikimedia?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to fetch Wikimedia images');
  const data = await res.json();
  return data;
}
