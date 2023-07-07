/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  experiments: {
    reactRoot: true,
  },
};

module.exports = nextConfig;
