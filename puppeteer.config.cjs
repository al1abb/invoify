const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // Changes the cache location for Puppeteer.
    cacheDirectory: join(__dirname, ".cache", "puppeteer"),
    executablePath: "/vercel/path0/.cache/puppeteer/chrome/linux-117.0.5938.88",
};
