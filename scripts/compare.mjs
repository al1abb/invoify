/**
 * Create side-by-side comparison and pixel diff of before.png and after.png.
 *
 * Usage: node scripts/compare.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(import.meta.dirname, '..', '.github');
const prefix = process.argv[2] || 'template-1';
const beforePath = resolve(dir, `${prefix}-before.png`);
const afterPath = resolve(dir, `${prefix}-after.png`);

// Read both images
const beforeImg = sharp(beforePath);
const afterImg = sharp(afterPath);
const beforeMeta = await beforeImg.metadata();
const afterMeta = await afterImg.metadata();

console.log(`Before: ${beforeMeta.width}x${beforeMeta.height}`);
console.log(`After:  ${afterMeta.width}x${afterMeta.height}`);

// Resize both to the same dimensions for comparison
const w = Math.max(beforeMeta.width, afterMeta.width);
const h = Math.max(beforeMeta.height, afterMeta.height);

const beforeBuf = await sharp(beforePath)
  .resize(w, h, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .raw()
  .toBuffer();

const afterBuf = await sharp(afterPath)
  .resize(w, h, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .raw()
  .toBuffer();

// Pixel diff
const channels = 3; // RGB
const totalPixels = w * h;
let diffCount = 0;
const diffBuf = Buffer.alloc(w * h * channels);

for (let i = 0; i < totalPixels; i++) {
  const idx = i * channels;
  const dr = Math.abs(beforeBuf[idx] - afterBuf[idx]);
  const dg = Math.abs(beforeBuf[idx + 1] - afterBuf[idx + 1]);
  const db = Math.abs(beforeBuf[idx + 2] - afterBuf[idx + 2]);

  if (dr + dg + db > 30) {
    // Red = darker in before (content shifted/missing in after)
    // Blue = darker in after (content shifted/missing in before)
    const beforeLum = beforeBuf[idx] + beforeBuf[idx + 1] + beforeBuf[idx + 2];
    const afterLum = afterBuf[idx] + afterBuf[idx + 1] + afterBuf[idx + 2];
    if (beforeLum < afterLum) {
      // Before is darker → red (content only in before)
      diffBuf[idx] = 255; diffBuf[idx + 1] = 60; diffBuf[idx + 2] = 60;
    } else {
      // After is darker → blue (content only in after)
      diffBuf[idx] = 60; diffBuf[idx + 1] = 120; diffBuf[idx + 2] = 255;
    }
    diffCount++;
  } else {
    // Show original (darkened)
    diffBuf[idx] = Math.floor(beforeBuf[idx] * 0.3);
    diffBuf[idx + 1] = Math.floor(beforeBuf[idx + 1] * 0.3);
    diffBuf[idx + 2] = Math.floor(beforeBuf[idx + 2] * 0.3);
  }
}

const diffPct = ((diffCount / totalPixels) * 100).toFixed(2);
console.log(`Diff pixels: ${diffCount} / ${totalPixels} (${diffPct}%)`);

// Write diff image
await sharp(diffBuf, { raw: { width: w, height: h, channels } })
  .png()
  .toFile(resolve(dir, `${prefix}-diff.png`));
console.log(`Wrote .github/${prefix}-diff.png`);

// Side-by-side comparison
const labelHeight = 40;
const gap = 20;
const compW = w * 2 + gap;
const compH = h + labelHeight;

// Create comparison with labels
const beforeResized = await sharp(beforePath)
  .resize(w, h, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toBuffer();

const afterResized = await sharp(afterPath)
  .resize(w, h, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toBuffer();

const comparison = await sharp({
  create: { width: compW, height: compH, channels: 3, background: { r: 245, g: 245, b: 245 } }
})
  .composite([
    { input: beforeResized, top: labelHeight, left: 0 },
    { input: afterResized, top: labelHeight, left: w + gap },
    // Add labels as SVG text
    {
      input: Buffer.from(`<svg width="${compW}" height="${labelHeight}">
        <text x="${w / 2}" y="28" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="#333">BEFORE (Puppeteer)</text>
        <text x="${w + gap + w / 2}" y="28" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="#333">AFTER (FormePDF)</text>
      </svg>`),
      top: 0,
      left: 0,
    },
  ])
  .png()
  .toFile(resolve(dir, `${prefix}-comparison.png`));

console.log(`Wrote .github/${prefix}-comparison.png`);
