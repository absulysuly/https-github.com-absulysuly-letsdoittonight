/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack(config) {
    config.resolve.extensions = [
      ...(config.resolve.extensions || []),
      ".ts",
      ".tsx",
    ];
    return config;
  },
};

export default nextConfig;
