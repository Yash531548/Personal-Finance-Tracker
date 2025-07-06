/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  typescript: {
    ignoreBuildErrors: true, // ✅ disables type checking at build time
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
