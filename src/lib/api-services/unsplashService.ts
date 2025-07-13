// Unsplash API service for stock photo search
import type { UnsplashImage } from '@/lib/types';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export async function searchUnsplashImages(query: string, count: number = 12): Promise<UnsplashImage[]> {
  // If no API key is configured, return empty array
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('[UNSPLASH] API key not configured, returning empty results');
    return [];
  }

  try {
    console.log(`[UNSPLASH] Searching for: "${query}" (${count} images)`);
    
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${UNSPLASH_ACCESS_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('[UNSPLASH] API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      console.log('[UNSPLASH] No results found');
      return [];
    }

    // Transform Unsplash results to our UnsplashImage format
    const images: UnsplashImage[] = data.results.map((photo: any) => ({
      id: photo.id,
      urls: {
        small: photo.urls.small,
        regular: photo.urls.regular,
        full: photo.urls.full,
      },
      alt_description: photo.alt_description || photo.description || 'Stock photo',
      user: {
        name: photo.user.name,
        username: photo.user.username,
      },
      links: {
        html: photo.links.html,
      },
    }));

    console.log(`[UNSPLASH] Found ${images.length} images`);
    return images;

  } catch (error: any) {
    console.error('[UNSPLASH] Search error:', error.message);
    return [];
  }
}

// Helper function to get download URL (for attribution tracking)
export async function getUnsplashDownloadUrl(photoId: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/${photoId}/download?client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      console.error('[UNSPLASH] Download URL error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.url || null;

  } catch (error: any) {
    console.error('[UNSPLASH] Download URL error:', error.message);
    return null;
  }
}

// Check if Unsplash service is configured
export function isUnsplashConfigured(): boolean {
  return !!(UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY.length > 10);
}
