/**
 * Convert a PDF to PNG using Puppeteer's built-in PDF viewer.
 *
 * Usage: node scripts/pdf-to-png.mjs <input.pdf> <output.png>
 */
import puppeteer from 'puppeteer';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const [,, inputPdf, outputPng] = process.argv;
if (!inputPdf || !outputPng) {
  console.error('Usage: node pdf-to-png.mjs <input.pdf> <output.png>');
  process.exit(1);
}

const pdfPath = resolve(inputPdf);
const pngPath = resolve(outputPng);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Load PDF as data URI so Chromium's built-in viewer renders it
const pdfBytes = readFileSync(pdfPath);
const dataUri = `data:application/pdf;base64,${pdfBytes.toString('base64')}`;

await page.setViewport({ width: 893, height: 1263, deviceScaleFactor: 2 }); // A4 at 96dpi * 2x
await page.goto(dataUri, { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000)); // let PDF viewer render

await page.screenshot({ path: pngPath, fullPage: false });
await browser.close();

console.log(`Wrote ${pngPath}`);
