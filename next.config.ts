/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optional: If you want to use src directory
  experimental: {
    appDir: false,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;