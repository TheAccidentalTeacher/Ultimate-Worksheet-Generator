import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Present' : '❌ MISSING',
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY ? '✅ Present' : '❌ MISSING',
    PEXELS_API_KEY: process.env.PEXELS_API_KEY ? '✅ Present' : '❌ MISSING',
    PIXABAY_API_KEY: process.env.PIXABAY_API_KEY ? '✅ Present' : '❌ MISSING',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NOW_REGION: process.env.NOW_REGION,
    message: 'If any key is missing, set it in the Netlify dashboard (Project > Settings > Environment Variables) and redeploy.'
  });
}
