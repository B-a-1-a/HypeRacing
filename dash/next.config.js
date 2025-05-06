/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Disable TypeScript type checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  // Allow server components to be used in development
  reactStrictMode: true,
  // For static export if needed
  output: process.env.NEXT_EXPORT === "true" ? "export" : undefined,
}

module.exports = nextConfig
