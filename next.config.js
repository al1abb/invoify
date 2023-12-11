// const withNextIntl = require("next-intl/plugin")(
//     // This is the default (also the `src` folder is supported out of the box)
//     "./app/i18n/i18n.ts"
// );

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["puppeteer-core"],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.map$/,
            use: "ignore-loader",
        });
        return config;
    },
};

module.exports = nextConfig;
