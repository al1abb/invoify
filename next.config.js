/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["puppeteer-core"],
  experimental: {},
  webpack: (config) => {
    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
    });
    return config;
  },
};

// Bundle analyzer
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// Add next-intl configuration
const withNextIntl = require("next-intl/plugin")();

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));
