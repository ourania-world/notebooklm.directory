/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Updated from serverComponentsExternalPackages to serverExternalPackages
    serverExternalPackages: ['micro']
  }
}

module.exports = nextConfig;