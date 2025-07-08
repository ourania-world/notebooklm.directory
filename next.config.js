/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.pexels.com', 'ciwlmdnmnsymiwmschej.supabase.co'],
  },
  // NOTE: 'api' key removed. Configure bodyParser/externalResolver IN each API route file.
};

module.exports = nextConfig;
