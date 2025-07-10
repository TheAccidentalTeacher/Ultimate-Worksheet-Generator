#!/bin/bash
echo "🔍 VERIFYING REPO STATUS"
echo "========================="

echo "📂 Current directory:"
pwd

echo "📋 Git status:"
git status --porcelain

echo "🏷️ Last 3 commits:"
git log --oneline -3

echo "🌐 Remote status:"
git remote -v

echo "✅ ContentGenerator.ts key lines:"
echo "Lines 68-72 (should show skipping visual assets):"
sed -n '68,72p' src/lib/ContentGenerator.ts

echo "🚀 Deployment should be triggered!"
echo "Check: https://work-gen.netlify.app/"
