/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.pexels.com', 'pixabay.com', 'openclipart.org'],
  },
}
module.exports = nextConfig
