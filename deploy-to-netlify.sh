#!/bin/bash

# Netlify Deployment Setup Script
# Run this script to deploy your worksheet generator

echo "🚀 Setting up Worksheet Generator for Netlify Deployment"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from your project root directory"
    exit 1
fi

# Install Netlify CLI if not already installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login to Netlify
echo "🔐 Please login to Netlify (browser will open)..."
netlify login

# Link or create site
echo "🔗 Linking to Netlify site..."
netlify link

# Check for environment file
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment template..."
    cat > .env.local << EOF
# Required: Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: Get from https://unsplash.com/developers
UNSPLASH_ACCESS_KEY=your-unsplash-access-key

# Optional: Get from https://pixabay.com/api/docs/
PIXABAY_API_KEY=your-pixabay-api-key

# Optional: Get from https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=your-replicate-api-token
EOF
fi

echo ""
echo "📋 Next Steps:"
echo "1. Edit .env.local with your actual API keys"
echo "2. Run: netlify env:import .env.local"
echo "3. Run: netlify deploy --prod"
echo ""
echo "🔗 Key URLs:"
echo "- OpenAI API Keys: https://platform.openai.com/api-keys"
echo "- Unsplash API: https://unsplash.com/developers"
echo "- Pixabay API: https://pixabay.com/api/docs/"
echo "- Replicate API: https://replicate.com/account/api-tokens"
echo ""
echo "💡 Only OPENAI_API_KEY is required for basic functionality"
