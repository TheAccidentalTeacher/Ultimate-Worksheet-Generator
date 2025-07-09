#!/bin/bash
cd /workspaces/Worksheet-Generator
git add .
git commit -m "Fix coloring page generation - remove photo fallback, use SVG only"
git push origin main
echo "Deployment complete!"
