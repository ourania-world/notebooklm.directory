/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['micro'],
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig;
