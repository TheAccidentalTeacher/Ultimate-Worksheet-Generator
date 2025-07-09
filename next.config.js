/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.pexels.com', 
      'pixabay.com', 
      'openclipart.org',
      'images.unsplash.com',
      'upload.wikimedia.org',
      'oaidalleapiprodscus.blob.core.windows.net'
    ],
    unoptimized: true,
  },
  // Optimize for Netlify deployment
  trailingSlash: false,
  // Remove standalone for Netlify
  transpilePackages: ['openai'],
}

module.exports = nextConfig
