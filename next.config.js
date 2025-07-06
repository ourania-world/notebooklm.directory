const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
    serverComponentsExternalPackages: ['@prisma/client'],
    typedRoutes: true
  }
};

module.exports = nextConfig;
