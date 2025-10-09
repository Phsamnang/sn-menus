/** @type {import('next').NextConfig} */
const nextConfig = {
  useFileSystemPublicRoutes: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig
