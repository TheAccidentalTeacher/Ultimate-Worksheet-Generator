// Wikimedia Commons API service for free educational images
import type { WikimediaImage } from '@/lib/types';

const WIKIMEDIA_API_URL = 'https://commons.wikimedia.org/w/api.php';

export async function searchWikimediaImages(query: string, count: number = 12): Promise<WikimediaImage[]> {
  try {
    console.log(`[WIKIMEDIA] Searching for: "${query}" (${count} images)`);
    
    // Use Wikimedia Commons API to search for images
    const searchParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${query}`,
      gsrlimit: count.toString(),
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '400',
      origin: '*' // CORS header
    });

    const response = await fetch(`${WIKIMEDIA_API_URL}?${searchParams}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WorksheetWise/1.0 (Educational Use)'
      },
    });

    if (!response.ok) {
      console.error('[WIKIMEDIA] API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    
    if (!data.query || !data.query.pages) {
      console.log('[WIKIMEDIA] No results found');
      return [];
    }

    // Transform Wikimedia results to our WikimediaImage format
    const images: WikimediaImage[] = Object.values(data.query.pages)
      .filter((page: any) => page.imageinfo && page.imageinfo[0])
      .map((page: any) => {
        const imageinfo = page.imageinfo[0];
        const metadata = imageinfo.extmetadata || {};
        
        return {
          id: page.pageid?.toString() || Math.random().toString(),
          title: page.title || 'Wikimedia Image',
          url: imageinfo.url || '',
          thumbUrl: imageinfo.thumburl || imageinfo.url || '',
          width: imageinfo.width || 400,
          height: imageinfo.height || 300,
          description: metadata.ImageDescription?.value || page.title || 'Educational image from Wikimedia Commons',
          license: metadata.License?.value || 'Creative Commons',
          attribution: metadata.Artist?.value || 'Wikimedia Commons contributor',
          pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title || '')}`
        };
      })
      .slice(0, count);

    console.log(`[WIKIMEDIA] Found ${images.length} images`);
    return images;

  } catch (error: any) {
    console.error('[WIKIMEDIA] Search error:', error.message);
    return [];
  }
}

// Get detailed information about a specific Wikimedia image
export async function getWikimediaImageDetails(title: string): Promise<WikimediaImage | null> {
  try {
    const searchParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: title,
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '800',
      origin: '*'
    });

    const response = await fetch(`${WIKIMEDIA_API_URL}?${searchParams}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WorksheetWise/1.0 (Educational Use)'
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const pages = data.query?.pages;
    
    if (!pages) {
      return null;
    }

    const page = Object.values(pages)[0] as any;
    if (!page.imageinfo || !page.imageinfo[0]) {
      return null;
    }

    const imageinfo = page.imageinfo[0];
    const metadata = imageinfo.extmetadata || {};

    return {
      id: page.pageid?.toString() || Math.random().toString(),
      title: page.title || 'Wikimedia Image',
      url: imageinfo.url || '',
      thumbUrl: imageinfo.thumburl || imageinfo.url || '',
      width: imageinfo.width || 400,
      height: imageinfo.height || 300,
      description: metadata.ImageDescription?.value || page.title || 'Educational image from Wikimedia Commons',
      license: metadata.License?.value || 'Creative Commons',
      attribution: metadata.Artist?.value || 'Wikimedia Commons contributor',
      pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title || '')}`
    };

  } catch (error: any) {
    console.error('[WIKIMEDIA] Details error:', error.message);
    return null;
  }
}

// Check if an image is suitable for educational use (basic filtering)
export function isEducationallyAppropriate(image: WikimediaImage): boolean {
  const title = image.title.toLowerCase();
  const description = (image.description || '').toLowerCase();
  
  // Basic filtering for educational content
  const inappropriateTerms = ['adult', 'explicit', 'violence', 'weapon', 'war'];
  const hasInappropriateContent = inappropriateTerms.some(term => 
    title.includes(term) || description.includes(term)
  );
  
  return !hasInappropriateContent;
}
