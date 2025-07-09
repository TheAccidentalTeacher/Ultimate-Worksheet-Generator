# Local Development Setup

## Quick Start

1. **Clone and install:**
   ```bash
   git clone <your-repo>
   cd Worksheet-Generator
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   http://localhost:3000

## What Works Locally

✅ **Worksheet Generation** - Creates educational worksheets using AI
✅ **Coloring Sheet Generation** - Generates themed coloring pages  
✅ **PDF Downloads** - Download worksheets as PDF files
✅ **Image Integration** - Fetches images from multiple sources
✅ **Progress Tracking** - Real-time generation progress
✅ **Christian Content Options** - Adjustable faith-based content levels

## Key Features

- **Grade Levels**: Pre-K through 12th grade
- **Subjects**: Math, ELA, Science, Social Studies, Bible Studies, and more
- **Customization**: Problem count, difficulty, content style
- **Multiple Formats**: PDF download, visual layouts
- **Image Sources**: Unsplash, Wikimedia, Pixabay, AI-generated

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Troubleshooting

**"Failed to generate worksheet"**: Check your OpenAI API key
**Build errors**: Make sure all dependencies are installed
**Image loading issues**: Check internet connection and API keys
