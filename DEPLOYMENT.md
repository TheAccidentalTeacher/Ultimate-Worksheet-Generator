# Netlify Deployment Guide for WorksheetWise

## Prerequisites

1. **OpenAI API Key**: Sign up at [OpenAI](https://platform.openai.com/) and get your API key
2. **Netlify Account**: Sign up at [Netlify](https://netlify.com)

## Step 1: Environment Variables

In your Netlify dashboard, go to Site Settings > Environment Variables and add:

```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

Optional (for enhanced image features):
```
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
PIXABAY_API_KEY=your_pixabay_key_here
```

## Step 2: Deploy from Git

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy!

## Step 3: Manual Deploy (Alternative)

If you prefer to deploy manually:

1. Run locally:
   ```bash
   npm install
   npm run build
   ```

2. Drag and drop the `.next` folder to Netlify deploy area

## Troubleshooting

### Build Errors
- Make sure all environment variables are set in Netlify
- Check that Node version is 18+ in build settings
- Verify that `@netlify/plugin-nextjs` is in your dependencies

### Runtime Errors
- Check Netlify function logs for API errors
- Verify OpenAI API key has sufficient credits
- Check that image domains are properly configured in next.config.js

### Common Issues

1. **"Failed to generate worksheet"**: Usually means OpenAI API key is missing or invalid
2. **Image loading issues**: Check the `images.domains` configuration in next.config.js
3. **Function timeout**: Large worksheets might take time; this is normal

## Features Working After Deployment

✅ Worksheet Generation (requires OpenAI API key)
✅ Coloring Sheet Generation 
✅ PDF Downloads
✅ Interactive UI
✅ Progress tracking
✅ Error handling

## Performance Notes

- First load may be slower due to serverless function cold starts
- Subsequent requests will be faster
- Image generation can take 30-60 seconds depending on complexity

## Support

If you encounter issues:
1. Check Netlify function logs
2. Verify environment variables are set
3. Ensure your OpenAI account has sufficient credits
4. Check that you're using a supported OpenAI model (gpt-4o is recommended)
Environment variables deployed to Vercel - Mon Jul 14 03:44:45 UTC 2025
