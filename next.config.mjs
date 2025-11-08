/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
