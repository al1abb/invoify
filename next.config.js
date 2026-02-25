const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["localhost", "127.0.0.1", "::1"],
    serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
    experimental: {
        clientTraceMetadata: ["sentry-trace", "baggage"],
    },
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

const sentryBuildOptions = {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    dryRun: !process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    webpack: {
        treeshake: {
            removeDebugLogging: true,
        },
    },
    sourcemaps: {
        disable: !process.env.SENTRY_AUTH_TOKEN,
    },
};

module.exports = withSentryConfig(
    withBundleAnalyzer(withNextIntl(nextConfig)),
    sentryBuildOptions
);
