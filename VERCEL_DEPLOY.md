# Vercel Deployment Guide

## Quick Deploy to Vercel

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Deploy Options

**Option A: GitHub Integration (Recommended)**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `TheAccidentalTeacher/Worksheet-Generator`
5. Vercel will auto-detect Next.js settings
6. Add environment variables (see below)
7. Deploy!

**Option B: CLI Deploy**
```bash
vercel
# Follow prompts to link project
```

### 3. Environment Variables Setup

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
OPENAI_API_KEY=your_openai_key
AZURE_AI_FOUNDRY_KEY=your_azure_key
STABILITY_AI_API_KEY=your_stability_key
PIXABAY_API_KEY=your_pixabay_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
SERPAPI_KEY=your_serpapi_key
NEWS_API_KEY=your_news_key
YOUTUBE_API_KEY=your_youtube_key
WIKIMEDIA_API_KEY=your_wikimedia_key
```

### 4. Benefits of Vercel Deployment

✅ **60-second function timeout** (vs Netlify's 10s)
✅ **3GB RAM** for AI processing
✅ **Native Next.js support** - zero config
✅ **No EventSource issues** - better streaming
✅ **Edge deployment** - global performance
✅ **Built-in analytics** and monitoring

### 5. Domain Setup

- **Free**: `your-project.vercel.app`
- **Custom**: Add your domain in Project Settings

### 6. Performance Optimizations

The `vercel.json` config includes:
- 60-second max duration for worksheet generation
- Optimized regions for US users
- Proper API routing

## Migration Notes

- Remove Netlify-specific files after successful deploy
- Update any hardcoded URLs to new Vercel domain
- Test all 16 APIs and visual generation features
