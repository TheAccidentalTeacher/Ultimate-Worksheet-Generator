# API Setup Instructions

## Current Status
Your app is deployed at: https://work-gen.netlify.app

### Working APIs:
- ✅ **OpenAI**: Configured and working for worksheet content generation
- ✅ **Unsplash**: Configured and working for image search fallback
- ✅ **Pixabay**: Configured for additional image search
- ✅ **Pexels**: Configured for image search

### Missing API:
- ❌ **Replicate**: Token is set to placeholder value `your-replicate-api-token-here`

## To Enable AI Image Generation (Replicate):

1. **Get a Replicate API Token:**
   - Visit: https://replicate.com/account/api-tokens
   - Sign up/login to Replicate
   - Create a new API token
   - Copy the token (starts with `r8_...`)

2. **Update the token in Netlify:**
   ```bash
   netlify env:set REPLICATE_API_TOKEN "r8_your_actual_token_here"
   ```

3. **Redeploy:**
   ```bash
   netlify deploy --prod
   ```

## Current Behavior:
- **Without Replicate**: The app falls back to Unsplash for coloring book images (real photos, not line art)
- **With Replicate**: The app generates proper black & white line art for coloring books

## Testing:
- Visit: https://work-gen.netlify.app
- Go to "Coloring Sheets" tab
- Try generating a coloring sheet
- Check browser console (F12) for detailed logs

## Troubleshooting:
- Check logs: https://app.netlify.com/projects/work-gen/logs/functions
- Health check: https://work-gen.netlify.app/health
