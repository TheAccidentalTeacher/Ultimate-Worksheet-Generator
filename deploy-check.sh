#!/bin/bash

echo "🚀 WorksheetWise Deployment Readiness Check"
echo "==========================================="

# Check if required files exist
echo "📁 Checking configuration files..."
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml found"
else
    echo "❌ netlify.toml missing"
fi

if [ -f "next.config.js" ]; then
    echo "✅ next.config.js found"
else
    echo "❌ next.config.js missing"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json missing"
fi

echo ""
echo "📦 Installing dependencies..."
npm install --silent

echo ""
echo "🔧 Running build test..."
OPENAI_API_KEY=test npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    echo "Run 'npm run build' to see detailed errors"
fi

echo ""
echo "📋 Pre-deployment checklist:"
echo "  □ Set OPENAI_API_KEY in Netlify environment variables"
echo "  □ Optional: Set UNSPLASH_ACCESS_KEY for better images"
echo "  □ Optional: Set PIXABAY_API_KEY for more image options"
echo "  □ Connect GitHub repository to Netlify"
echo "  □ Set build command: 'npm run build'"
echo "  □ Set publish directory: '.next'"

echo ""
echo "🎯 Ready for deployment!"
echo "See DEPLOYMENT.md for detailed instructions."
