/**
 * Render invoice Template 1 using Forme and save as PDF + PNG.
 *
 * Usage: node scripts/render-forme.mjs
 *
 * Outputs:
 *   .github/template-1-after.pdf
 *   .github/template-1-after.png
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Forme
const { renderDocument } = await import('@formepdf/core');
const { Document, Page, View, Text, Image } = await import('@formepdf/react');
const { tw } = await import('@formepdf/tailwind');
import React from 'react';


function formatNumberWithCommas(number) {
  return number.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function isDataUrl(str) {
  return typeof str === 'string' && str.startsWith('data:');
}

const data = {
  sender: {
    name: 'John Doe',
    address: '123 Main St',
    zipCode: '12345',
    city: 'Anytown',
    country: 'USA',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
  },
  receiver: {
    name: 'Jane Smith',
    address: '456 Elm St',
    zipCode: '54321',
    city: 'Other Town',
    country: 'Canada',
    email: '',
    phone: '',
  },
  details: {
    invoiceLogo: '',
    invoiceNumber: 'INV0001',
    invoiceDate: 'March 24, 2026',
    dueDate: 'March 24, 2026',
    items: [
      { name: 'Product 1', description: 'Description of Product 1', quantity: 4, unitPrice: 50, total: 200 },
      { name: 'Product 2', description: 'Description of Product 2', quantity: 5, unitPrice: 50, total: 250 },
      { name: 'Product 3', description: 'Description of Product 3', quantity: 5, unitPrice: 80, total: 400 },
    ],
    currency: 'USD',
    language: 'English',
    taxDetails: { amount: 15, amountType: 'percentage', taxID: '' },
    discountDetails: { amount: 5, amountType: 'percentage' },
    shippingDetails: { cost: 5, costType: 'percentage' },
    paymentInformation: { bankName: 'Bank Inc.', accountName: 'John Doe', accountNumber: '445566998877' },
    additionalNotes: 'Thank you for your business',
    paymentTerms: 'Net 30',
    signature: { data: '' },
    subTotal: '850',
    totalAmount: '975.06',
    totalAmountInWords: 'Nine hundred seventy-five Dollar and six Cents',
    pdfTemplate: 1,
  },
};

// Inline the template — mirrors InvoiceTemplate1.tsx exactly
function InvoiceTemplate(data) {
  const { sender, receiver, details } = data;

  return React.createElement(Document, { title: `Invoice ${details.invoiceNumber}`, title: `Invoice ${details.invoiceNumber}` },
    React.createElement(Page, { size: 'A4', margin: 30 },
      // Header
      React.createElement(View, { style: tw('flex-row justify-between') },
        React.createElement(View, null,
          details.invoiceLogo && details.invoiceLogo !== '' && isDataUrl(details.invoiceLogo)
            ? React.createElement(Image, { src: details.invoiceLogo, width: 140 })
            : null,
          React.createElement(Text, { style: tw('mt-2 text-[14px] font-semibold text-blue-600') }, sender.name),
        ),
        React.createElement(View, { style: tw('text-right') },
          React.createElement(Text, { style: tw('text-xl font-semibold text-gray-800') }, 'Invoice #'),
          React.createElement(Text, { style: tw('mt-1 text-gray-500') }, details.invoiceNumber),
          React.createElement(View, { style: tw('mt-4') },
            React.createElement(Text, { style: tw('text-gray-800') }, sender.address),
            React.createElement(Text, { style: tw('text-gray-800') }, `${sender.zipCode}, ${sender.city}`),
            React.createElement(Text, { style: tw('text-gray-800') }, sender.country),
          ),
        ),
      ),

      // Bill To + Dates
      React.createElement(View, { style: tw('mt-4 flex-row gap-3') },
        React.createElement(View, { style: { flex: 1 } },
          React.createElement(Text, { style: tw('text-md font-semibold text-gray-800') }, 'Bill to:'),
          React.createElement(Text, { style: tw('text-md font-semibold text-gray-800 mt-1') }, receiver.name),
          React.createElement(View, { style: tw('mt-[12px]') },
            React.createElement(Text, { style: tw('text-gray-500') },
              [receiver.address, receiver.zipCode].filter(Boolean).join(', ')),
            React.createElement(Text, { style: tw('text-gray-500 mt-[2px]') }, `${receiver.city}, ${receiver.country}`),
          ),
        ),
        React.createElement(View, { style: { flex: 1, ...tw('gap-2') } },
          React.createElement(View, { style: tw('flex-row gap-12') },
            React.createElement(Text, { style: { flex: 3, ...tw('font-semibold text-gray-800 text-right') } }, 'Invoice date:'),
            React.createElement(Text, { style: { flex: 2, ...tw('text-gray-500 text-right') } }, details.invoiceDate),
          ),
          React.createElement(View, { style: tw('flex-row gap-12') },
            React.createElement(Text, { style: { flex: 3, ...tw('font-semibold text-gray-800 text-right') } }, 'Due date:'),
            React.createElement(Text, { style: { flex: 2, ...tw('text-gray-500 text-right') } }, details.dueDate),
          ),
        ),
      ),

      // Items Table
      React.createElement(View, { style: tw('mt-2 border border-gray-200 p-1 rounded-lg') },
        // Header Row
        React.createElement(View, { style: tw('flex-row') },
          React.createElement(View, { style: { flex: 2 } },
            React.createElement(Text, { style: tw('text-[8px] font-medium text-gray-500 uppercase') }, 'Item')),
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: tw('text-[8px] font-medium text-gray-500 uppercase') }, 'Qty')),
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: tw('text-[8px] font-medium text-gray-500 uppercase') }, 'Rate')),
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: tw('text-[8px] font-medium text-gray-500 uppercase text-right') }, 'Amount')),
        ),
        React.createElement(View, { style: tw('border-b border-gray-200 mt-1 mb-1') }),

        // Item Rows
        ...details.items.map((item, index) =>
          React.createElement(View, { key: index, style: tw('flex-row border-b border-gray-300 pt-[2px] pb-[2px]') },
            React.createElement(View, { style: { flex: 2 } },
              React.createElement(Text, { style: tw('text-[11px] font-bold text-gray-800') }, item.name),
              React.createElement(Text, { style: tw('text-[9px] text-gray-600') }, item.description)),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(Text, { style: tw('text-gray-800') }, String(item.quantity))),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(Text, { style: tw('text-gray-800') }, `${item.unitPrice} ${details.currency}`)),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(Text, { style: tw('text-right text-gray-800') }, `${item.total} ${details.currency}`)),
          )
        ),
      ),

      // Totals
      React.createElement(View, { style: tw('mt-1 flex-row justify-end') },
        React.createElement(View, { style: { width: 350, ...tw('gap-[7px]') } },
          React.createElement(View, { style: tw('flex-row') },
            React.createElement(View, { style: { flex: 4 } },
              React.createElement(Text, { style: tw('font-semibold text-gray-800 text-right mr-5') }, 'Subtotal:')),
            React.createElement(View, { style: { flex: 5 } },
              React.createElement(Text, { style: tw('text-gray-500 text-right') }, `${formatNumberWithCommas(Number(details.subTotal))} ${details.currency}`))),
          details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 &&
            React.createElement(View, { style: tw('flex-row') },
              React.createElement(View, { style: { flex: 4 } },
                React.createElement(Text, { style: tw('font-semibold text-gray-800 text-right mr-5') }, 'Discount:')),
              React.createElement(View, { style: { flex: 5 } },
                React.createElement(Text, { style: tw('text-gray-500 text-right') },
                  details.discountDetails.amountType === 'amount'
                    ? `- ${details.discountDetails.amount} ${details.currency}`
                    : `- ${details.discountDetails.amount}%`))),
          details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 &&
            React.createElement(View, { style: tw('flex-row') },
              React.createElement(View, { style: { flex: 4 } },
                React.createElement(Text, { style: tw('font-semibold text-gray-800 text-right mr-5') }, 'Tax:')),
              React.createElement(View, { style: { flex: 5 } },
                React.createElement(Text, { style: tw('text-gray-500 text-right') },
                  details.taxDetails.amountType === 'amount'
                    ? `+ ${details.taxDetails.amount} ${details.currency}`
                    : `+ ${details.taxDetails.amount}%`))),
          details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 &&
            React.createElement(View, { style: tw('flex-row') },
              React.createElement(View, { style: { flex: 4 } },
                React.createElement(Text, { style: tw('font-semibold text-gray-800 text-right mr-5') }, 'Shipping:')),
              React.createElement(View, { style: { flex: 5 } },
                React.createElement(Text, { style: tw('text-gray-500 text-right') },
                  details.shippingDetails.costType === 'amount'
                    ? `+ ${details.shippingDetails.cost} ${details.currency}`
                    : `+ ${details.shippingDetails.cost}%`))),
          React.createElement(View, { style: tw('flex-row') },
            React.createElement(View, { style: { flex: 4 } },
              React.createElement(Text, { style: tw('font-semibold text-gray-800 text-right mr-5') }, 'Total:')),
            React.createElement(View, { style: { flex: 5 } },
              React.createElement(Text, { style: tw('text-gray-500 text-right') }, `${formatNumberWithCommas(Number(details.totalAmount))} ${details.currency}`))),
          details.totalAmountInWords &&
            React.createElement(View, { style: tw('flex-row') },
              React.createElement(View, { style: { flex: 4 } },
                React.createElement(Text, { style: tw('font-semibold text-gray-800 text-right mr-5') }, 'Total in words:')),
              React.createElement(View, { style: { flex: 5 } },
                React.createElement(Text, { style: tw('italic text-gray-500 text-right') }, `${details.totalAmountInWords} ${details.currency}`))),
        ),
      ),

      // Notes & Payment
      React.createElement(View, { style: tw('mt-2') },
        React.createElement(View, { style: tw('mt-2') },
          React.createElement(Text, { style: tw('font-semibold text-blue-600') }, 'Additional notes:'),
          React.createElement(Text, { style: tw('text-gray-800') }, details.additionalNotes)),
        React.createElement(View, { style: tw('mt-2') },
          React.createElement(Text, { style: tw('font-semibold text-blue-600') }, 'Payment terms:'),
          React.createElement(Text, { style: tw('text-gray-800') }, details.paymentTerms)),
        React.createElement(View, { style: tw('mt-2') },
          React.createElement(Text, { style: tw('font-semibold text-gray-800') }, 'Please send the payment to this address'),
          React.createElement(Text, { style: tw('text-[10px] font-bold text-gray-800') }, `Bank: ${details.paymentInformation?.bankName}`),
          React.createElement(Text, { style: tw('text-[10px] font-bold text-gray-800') }, `Account name: ${details.paymentInformation?.accountName}`),
          React.createElement(Text, { style: tw('text-[10px] font-bold text-gray-800') }, `Account no: ${details.paymentInformation?.accountNumber}`)),
      ),

      React.createElement(View, { style: { marginTop: 14 } },
        React.createElement(Text, { style: tw('text-gray-500 text-[10px]') },
          'If you have any questions concerning this invoice, use the following contact information:'),
        React.createElement(Text, { style: tw('text-[10px] font-bold text-gray-800') }, sender.email),
        React.createElement(Text, { style: tw('text-[10px] font-bold text-gray-800') }, sender.phone),
      ),

      // Signature
      details?.signature?.data && isDataUrl(details?.signature?.data)
        ? React.createElement(View, { style: tw('mt-6') },
            React.createElement(Text, { style: tw('font-semibold text-gray-800') }, 'Signature:'),
            React.createElement(Image, { src: details.signature.data, width: 120 }))
        : details?.signature?.data
          ? React.createElement(View, { style: tw('mt-6') },
              React.createElement(Text, { style: tw('text-gray-800') }, 'Signature:'),
              React.createElement(Text, { style: { fontSize: 30, fontWeight: 400, color: tw('text-black').color } }, details.signature.data))
          : null,
    ),
  );
}

// Render
console.log('Rendering Forme PDF...');
const pdfBytes = await renderDocument(InvoiceTemplate(data));

const outDir = resolve(import.meta.dirname, '..', '.github');
writeFileSync(resolve(outDir, 'template-1-after.pdf'), pdfBytes);
console.log(`Wrote ${pdfBytes.length} bytes to .github/template-1-after.pdf`);

// Convert to PNG using pdftoppm (match before.png DPI)
import { execSync } from 'node:child_process';
const pdfPath = resolve(outDir, 'template-1-after.pdf');
const pngBase = resolve(outDir, 'template-1-after');
execSync(`pdftoppm -png -r 150 -singlefile "${pdfPath}" "${pngBase}"`);
console.log(`Wrote .github/template-1-after.png`);
