// src/lib/api-services/pixabayService.ts
export async function searchPixabayImages(query: string, imageType: string = 'all', perPage: number = 3) {
  const res = await fetch(`/api/pixabay?query=${encodeURIComponent(query)}&imageType=${imageType}&perPage=${perPage}`);
  if (!res.ok) throw new Error('Failed to fetch Pixabay images');
  const data = await res.json();
  return data;
}
