/**
 * Render invoice Template 1 using Puppeteer (HTML + Tailwind CDN) and save as PDF + PNG.
 * Must run from the main branch with puppeteer installed.
 *
 * Usage: node scripts/render-puppeteer.mjs
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';

const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

function formatNumberWithCommas(number) {
  return number.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const data = {
  sender: {
    name: 'John Doe', address: '123 Main St', zipCode: '12345',
    city: 'Anytown', country: 'USA',
    email: 'johndoe@example.com', phone: '123-456-7890',
  },
  receiver: {
    name: 'Jane Smith', address: '456 Elm St', zipCode: '54321',
    city: 'Other Town', country: 'Canada',
  },
  details: {
    invoiceLogo: '', invoiceNumber: 'INV0001',
    invoiceDate: '2026-03-14', dueDate: '2026-04-14',
    items: [
      { name: 'Product 1', description: 'Description of Product 1', quantity: 4, unitPrice: 50, total: 200 },
      { name: 'Product 2', description: 'Description of Product 2', quantity: 5, unitPrice: 50, total: 250 },
      { name: 'Product 3', description: 'Description of Product 3', quantity: 5, unitPrice: 80, total: 400 },
    ],
    currency: 'USD',
    taxDetails: { amount: 15, amountType: 'percentage' },
    discountDetails: { amount: 5, amountType: 'percentage' },
    shippingDetails: { cost: 5, costType: 'percentage' },
    paymentInformation: { bankName: 'Bank Inc.', accountName: 'John Doe', accountNumber: '445566998877' },
    additionalNotes: 'Thank you for your business',
    paymentTerms: 'Net 30',
    subTotal: '850',
    totalAmount: '935.25',
    totalAmountInWords: 'Eight Hundred Fifty',
    pdfTemplate: 1,
  },
};

const { sender, receiver, details } = data;

// Build the same HTML that InvoiceTemplate1 + InvoiceLayout produces
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <section style="font-family: Outfit, sans-serif;">
  <div class="flex flex-col p-4 sm:p-10 bg-white rounded-xl min-h-[60rem]">
    <div class="flex justify-between">
      <div>
        <h1 class="mt-2 text-lg font-semibold text-blue-600">${sender.name}</h1>
      </div>
      <div class="text-right">
        <h2 class="text-2xl md:text-3xl font-semibold text-gray-800">Invoice #</h2>
        <span class="mt-1 block text-gray-500">${details.invoiceNumber}</span>
        <address class="mt-4 not-italic text-gray-800">
          ${sender.address}<br>
          ${sender.zipCode}, ${sender.city}<br>
          ${sender.country}
        </address>
      </div>
    </div>

    <div class="mt-6 grid sm:grid-cols-2 gap-3">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">Bill to:</h3>
        <h3 class="text-lg font-semibold text-gray-800">${receiver.name}</h3>
        <address class="mt-2 not-italic text-gray-500">
          ${receiver.address}, ${receiver.zipCode}<br>
          ${receiver.city}, ${receiver.country}
        </address>
      </div>
      <div class="text-right space-y-2">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-2">
          <dl class="grid sm:grid-cols-5 gap-x-3">
            <dt class="col-span-3 font-semibold text-gray-800">Invoice date:</dt>
            <dd class="col-span-2 text-gray-500">${new Date(details.invoiceDate).toLocaleDateString('en-US', DATE_OPTIONS)}</dd>
          </dl>
          <dl class="grid sm:grid-cols-5 gap-x-3">
            <dt class="col-span-3 font-semibold text-gray-800">Due date:</dt>
            <dd class="col-span-2 text-gray-500">${new Date(details.dueDate).toLocaleDateString('en-US', DATE_OPTIONS)}</dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="mt-3 border border-gray-200 p-1.5 rounded-lg space-y-1.5">
      <div class="hidden sm:grid sm:grid-cols-5">
        <div class="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">Item</div>
        <div class="text-xs font-medium text-gray-500 uppercase">Qty</div>
        <div class="text-xs font-medium text-gray-500 uppercase">Rate</div>
        <div class="text-xs font-medium text-gray-500 uppercase text-right">Amount</div>
      </div>
      <div class="hidden sm:block border-b border-gray-200"></div>
      ${details.items.map(item => `
        <div class="grid grid-cols-5 border-b border-gray-300 py-1">
          <div class="col-span-2">
            <p class="font-medium text-gray-800">${item.name}</p>
            <p class="text-xs text-gray-600">${item.description}</p>
          </div>
          <div><p class="text-gray-800">${item.quantity}</p></div>
          <div><p class="text-gray-800">${item.unitPrice} ${details.currency}</p></div>
          <div><p class="text-right text-gray-800">${item.total} ${details.currency}</p></div>
        </div>
      `).join('')}
    </div>

    <div class="mt-2 flex justify-end">
      <div class="text-right space-y-2">
        <dl class="grid sm:grid-cols-5 gap-x-3">
          <dt class="col-span-3 font-semibold text-gray-800">Subtotal:</dt>
          <dd class="col-span-2 text-gray-500">${formatNumberWithCommas(Number(details.subTotal))} ${details.currency}</dd>
        </dl>
        ${details.discountDetails.amount > 0 ? `
        <dl class="grid sm:grid-cols-5 gap-x-3">
          <dt class="col-span-3 font-semibold text-gray-800">Discount:</dt>
          <dd class="col-span-2 text-gray-500">- ${details.discountDetails.amount}%</dd>
        </dl>` : ''}
        ${details.taxDetails.amount > 0 ? `
        <dl class="grid sm:grid-cols-5 gap-x-3">
          <dt class="col-span-3 font-semibold text-gray-800">Tax:</dt>
          <dd class="col-span-2 text-gray-500">+ ${details.taxDetails.amount}%</dd>
        </dl>` : ''}
        ${details.shippingDetails.cost > 0 ? `
        <dl class="grid sm:grid-cols-5 gap-x-3">
          <dt class="col-span-3 font-semibold text-gray-800">Shipping:</dt>
          <dd class="col-span-2 text-gray-500">+ ${details.shippingDetails.cost}%</dd>
        </dl>` : ''}
        <dl class="grid sm:grid-cols-5 gap-x-3">
          <dt class="col-span-3 font-semibold text-gray-800">Total:</dt>
          <dd class="col-span-2 text-gray-500">${formatNumberWithCommas(Number(details.totalAmount))} ${details.currency}</dd>
        </dl>
        ${details.totalAmountInWords ? `
        <dl class="grid sm:grid-cols-5 gap-x-3">
          <dt class="col-span-3 font-semibold text-gray-800">Total in words:</dt>
          <dd class="col-span-2 italic text-gray-500">${details.totalAmountInWords} ${details.currency}</dd>
        </dl>` : ''}
      </div>
    </div>

    <div class="my-4 space-y-2">
      <div>
        <p class="font-semibold text-blue-600">Additional notes:</p>
        <p class="text-gray-800">${details.additionalNotes}</p>
      </div>
      <div>
        <p class="font-semibold text-blue-600">Payment terms:</p>
        <p class="text-gray-800">${details.paymentTerms}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800">Please send the payment to this address</p>
        <p class="text-sm text-gray-800">Bank: ${details.paymentInformation.bankName}</p>
        <p class="text-sm text-gray-800">Account name: ${details.paymentInformation.accountName}</p>
        <p class="text-sm text-gray-800">Account no: ${details.paymentInformation.accountNumber}</p>
      </div>
    </div>

    <p class="text-gray-500 text-sm">If you have any questions concerning this invoice, use the following contact information:</p>
    <p class="text-sm font-medium text-gray-800">${sender.email}</p>
    <p class="text-sm font-medium text-gray-800">${sender.phone}</p>
  </div>
  </section>
</body>
</html>`;

console.log('Rendering Puppeteer PDF...');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: ['networkidle0', 'load', 'domcontentloaded'], timeout: 30000 });

const pdf = await page.pdf({ format: 'a4', printBackground: true });

const outDir = resolve(import.meta.dirname, '..', '.github');
writeFileSync(resolve(outDir, 'template-1-before.pdf'), pdf);
console.log(`Wrote ${pdf.length} bytes to .github/template-1-before.pdf`);

// Screenshot page 1 for PNG comparison
await page.goto(`data:application/pdf;base64,${Buffer.from(pdf).toString('base64')}`, {
  waitUntil: 'networkidle0', timeout: 15000
});
await new Promise(r => setTimeout(r, 2000));

// Instead, just use qlmanage after
await browser.close();
console.log('Done. Run: qlmanage -t -s 1263 -o .github/ .github/before.pdf && mv .github/before.pdf.png .github/before.png');
