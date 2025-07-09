# Install Netlify CLI and bulk import environment variables

# 1. Install Netlify CLI globally
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Link your site (run this in your project directory)
netlify link

# 4. Create a .env file with your variables (DO NOT COMMIT THIS)
# .env
OPENAI_API_KEY=sk-your-actual-key-here
UNSPLASH_ACCESS_KEY=your-unsplash-key
PIXABAY_API_KEY=your-pixabay-key
REPLICATE_API_TOKEN=your-replicate-token

# 5. Import all environment variables at once
netlify env:import .env

# 6. Verify the variables were set
netlify env:list

# 7. Deploy
netlify deploy --prod
