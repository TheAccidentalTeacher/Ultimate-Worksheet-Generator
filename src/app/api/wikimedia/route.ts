import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  // Wikimedia Commons API: search for images
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=12&iiprop=url|extmetadata`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch Wikimedia images' }, { status: 500 });
    }
    const data = await res.json();
    // Flatten results for easier frontend use
    const images = [];
    if (data.query && data.query.pages) {
      for (const pageId in data.query.pages) {
        const page = data.query.pages[pageId];
        if (page.imageinfo && page.imageinfo[0]) {
          images.push({
            id: pageId,
            title: page.title,
            url: page.imageinfo[0].url,
            thumb: page.imageinfo[0].thumburl || page.imageinfo[0].url,
            description: page.imageinfo[0].extmetadata?.ImageDescription?.value || '',
            credit: page.imageinfo[0].extmetadata?.Artist?.value || '',
            license: page.imageinfo[0].extmetadata?.LicenseShortName?.value || '',
            more: page.imageinfo[0].descriptionurl || '',
          });
        }
      }
    }
    return NextResponse.json({ results: images });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching Wikimedia images' }, { status: 500 });
  }
}
