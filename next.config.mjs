/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.extensions = Array.from(new Set([...config.resolve.extensions, '.ts', '.tsx']));
    return config;
  },
};

export default nextConfig;
