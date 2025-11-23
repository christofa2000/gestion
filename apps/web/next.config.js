/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/config", "@repo/supabase"],
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;

