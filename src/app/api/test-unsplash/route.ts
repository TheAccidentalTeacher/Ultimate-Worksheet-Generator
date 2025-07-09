import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    
    if (!UNSPLASH_ACCESS_KEY) {
      return NextResponse.json({ error: 'UNSPLASH_ACCESS_KEY not configured' });
    }

    const searchQuery = prompt || 'cat';
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: data,
      url: url.replace(UNSPLASH_ACCESS_KEY, '[HIDDEN]')
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
