const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: process.env.VERCEL
    ? "/vercel/path0/.cache/puppeteer"
    : join(__dirname, ".cache", "puppeteer"),
};
