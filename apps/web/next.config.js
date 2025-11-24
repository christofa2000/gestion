/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/config", "@repo/supabase"],
  experimental: {
    reactCompiler: true,
  },
  // Fix para Windows + OneDrive: configurar tracing root para evitar problemas de permisos
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
};

module.exports = nextConfig;

