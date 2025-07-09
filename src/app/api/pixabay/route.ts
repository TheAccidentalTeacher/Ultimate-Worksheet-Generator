import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');
  const imageType = req.nextUrl.searchParams.get('imageType') || 'all';
  const perPage = req.nextUrl.searchParams.get('perPage') || '3';
  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Pixabay API key not set' }, { status: 500 });
  }
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=${imageType}&per_page=${perPage}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch Pixabay images' }, { status: 500 });
    }
    const data = await res.json();
    const images = (data.hits || []).map((hit: any) => ({
      url: hit.webformatURL,
      photographer: hit.user,
      photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
      tags: hit.tags,
      pageUrl: hit.pageURL
    }));
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching Pixabay images' }, { status: 500 });
  }
}
