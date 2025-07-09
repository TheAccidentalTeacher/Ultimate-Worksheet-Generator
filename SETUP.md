# Worksheet Generator Setup Guide

## Quick Start for Development

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and add your API keys:
   ```bash
   cp .env.example .env.local
   ```

3. **Required API Key**
   - **OpenAI API Key** (Required): Get from https://platform.openai.com/api-keys
     ```
     OPENAI_API_KEY=sk-your-actual-openai-key-here
     ```

4. **Optional API Keys** (for enhanced features)
   - **Unsplash**: For stock photos (free tier available)
   - **Pixabay**: For additional images
   - **Replicate**: For AI-generated coloring pages

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Deployment to Netlify

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Set Environment Variables in Netlify**
   - Go to your Netlify dashboard
   - Navigate to Site Settings > Environment Variables
   - Add your `OPENAI_API_KEY` and other API keys

3. **Deploy**
   - Connect your GitHub repository to Netlify
   - The build command is already configured in `netlify.toml`

## Testing Without API Keys

The application will work with limited functionality:
- Worksheet structure generation requires OpenAI API key
- Images will show placeholders if image APIs are not configured
- The app won't crash, but will show helpful error messages

## Common Issues

### "OpenAI API key not configured"
- Make sure you have a valid API key in `.env.local`
- Restart your development server after adding the key

### Images not loading
- Check that image service API keys are correct
- Images will show placeholders if services are unavailable

### Build fails
- Ensure all required dependencies are installed
- Check that your `.env.local` file exists (even with placeholder values)
