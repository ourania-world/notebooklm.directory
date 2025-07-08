/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.pexels.com', 'ciwlmdnmnsymiwmschej.supabase.co'],
  },
  // Required for Stripe webhooks
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    externalResolver: true,
  },
}

module.exports = nextConfig;