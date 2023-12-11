// const withNextIntl = require("next-intl/plugin")(
//     // This is the default (also the `src` folder is supported out of the box)
//     "./app/i18n/i18n.ts"
// );

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.map$/,
            use: "ignore-loader",
        });

        if (!isServer) {
            config.externals = {
                ...config.externals,
                "puppeteer-core": "commonjs puppeteer-core",
                "@sparticuz/chromium": "commonjs @sparticuz/chromium",
            };
        }

        return config;
    },
};

module.exports = nextConfig;
