import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Uncomment below if you set up R2 for caching
  // incrementalCache: r2IncrementalCache,
});

// "postinstall": "node node_modules/puppeteer/install.js",
