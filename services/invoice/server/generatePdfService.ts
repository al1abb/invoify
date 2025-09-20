import { NextRequest, NextResponse } from "next/server";

// Chromium
import chromium from "@sparticuz/chromium";

// Helpers
import { getInvoiceTemplate } from "@/lib/helpers";

// Variables
import { ENV, TAILWIND_CDN } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

/**
 * Generate a PDF document of an invoice based on the provided data.
 *
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @throws {Error} If there is an error during the PDF generation process.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generatePdfService(req: NextRequest) {
	const body: InvoiceType = await req.json();
	let browser;
	let page;
	const PRINT_STYLES = `
@page { size: A4; }

@media print {
  .page-split { break-after: page; page-break-after: always; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  table { break-inside: auto; }
  tbody { break-inside: auto; }
}

body, html { margin: 0; padding: 0; }
`;


	try {
		const { renderToStaticMarkup } = await import("react-dom/server");
		const templateId = body.details.pdfTemplate;
		console.log("Generating PDF with template:", templateId);
		const InvoiceTemplate = await getInvoiceTemplate(templateId);
		const appMarkup = renderToStaticMarkup(InvoiceTemplate(body));

		// Build header markup separately for Puppeteer headerTemplate to repeat on each page
		const { sender, receiver, details } = body;
		const formatDate = (value: string | Date) => new Date(value).toLocaleDateString("en-US");
		const headerMarkup = `
<div  style="width:90%; margin: auto;  font-family: ui-sans-serif,system-ui,-apple-system; font-size:12px;">
  <div style="text-align:center; font-size:18px; font-weight:600;">Tax Invoice</div>
  <div style="margin-top:8px; display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid rgba(0,0,0,0.7);">
    <div style="padding:8px; border-right:1px solid rgba(0,0,0,0.7);">
      <div style="font-weight:600; font-size:14px;">${sender.name || ''}</div>
      <div>${sender.address || ''}</div>
      <div>${[sender.zipCode, sender.city].filter(Boolean).join(', ')}</div>
      <div>${sender.country || ''}</div>
      <div style="margin-top:4px;">
        <div>Email: ${sender.email || ''}</div>
        <div>Phone: ${sender.phone || ''}</div>
      </div>
    </div>
    <div style="font-size:11px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid rgba(0,0,0,0.7);">
        <div style="padding:4px; border-right:1px solid rgba(0,0,0,0.7);">Invoice No.</div>
        <div style="padding:4px;">${details.invoiceNumber || ''}</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid rgba(0,0,0,0.7);">
        <div style="padding:4px; border-right:1px solid rgba(0,0,0,0.7);">Dated</div>
        <div style="padding:4px;">${details.invoiceDate ? formatDate(details.invoiceDate) : ''}</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid rgba(0,0,0,0.7);">
        <div style="padding:4px; border-right:1px solid rgba(0,0,0,0.7);">Delivery Note</div>
        <div style="padding:4px;">${details.purchaseOrderNumber || ''}</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid rgba(0,0,0,0.7);">
        <div style="padding:4px; border-right:1px solid rgba(0,0,0,0.7);">Mode/Terms of Payment</div>
        <div style="padding:4px;">${details.paymentTerms || ''}</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid rgba(0,0,0,0.7);">
        <div style="padding:4px; border-right:1px solid rgba(0,0,0,0.7);">Reference No. & Date</div>
        <div style="padding:4px;">${details.updatedAt || ''}</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr;">
        <div style="padding:4px; border-right:1px solid rgba(0,0,0,0.7);">Other References</div>
        <div style="padding:4px;"></div>
      </div>
    </div>
  </div>
  <div style="display:grid; grid-template-columns:1fr 1fr; border:1px solid rgba(0,0,0,0.7); border-top:none;">
    <div style="padding:8px; border-right:1px solid rgba(0,0,0,0.7);">
      <div style="font-size:11px;">Consignee (Ship to)</div>
      <div style="font-weight:600; font-size:13px;">${receiver.name || ''}</div>
      <div style="font-size:12px;">${receiver.address || ''}</div>
      <div style="font-size:12px;">${[receiver.zipCode, receiver.city].filter(Boolean).join(', ')}</div>
      <div style="font-size:12px;">${receiver.country || ''}</div>
    </div>
    <div style="padding:8px;">
      <div style="font-size:11px;">Buyer (Bill to)</div>
      <div style="font-weight:600; font-size:13px;">${receiver.name || ''}</div>
      <div style="font-size:12px;">${receiver.address || ''}</div>
      <div style="font-size:12px;">${[receiver.zipCode, receiver.city].filter(Boolean).join(', ')}</div>
      <div style="font-size:12px;">${receiver.country || ''}</div>
    </div>
  </div>
</div>`;

		const htmlTemplate = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
	            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link href="${TAILWIND_CDN}" rel="stylesheet" />
                <style>
					${PRINT_STYLES}
    </style>
              </head>
              <body>
                ${appMarkup}
              </body>
            </html>`;

		if (ENV === "production") {
			const puppeteer = (await import("puppeteer-core")).default;
			browser = await puppeteer.launch({
				args: [...chromium.args, "--disable-dev-shm-usage", "--ignore-certificate-errors"],
				executablePath: await chromium.executablePath(),
				headless: true,
			});
		} else {
			const puppeteer = (await import("puppeteer")).default;
			browser = await puppeteer.launch({
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
				headless: true,
			});
		}

		if (!browser) {
			throw new Error("Failed to launch browser");
		}

		page = await browser.newPage();
		await page.setContent(htmlTemplate, {
			waitUntil: ["networkidle0", "load", "domcontentloaded"],
			timeout: 30000,
		});

		// Only apply header for template 3, others don't need it
		const isTemplate3 = templateId === 3;
		
		const pdf: Uint8Array = await page.pdf({
			format: "a4",
			printBackground: true,
			preferCSSPageSize: true,
			displayHeaderFooter: isTemplate3,
			headerTemplate: isTemplate3 ? `<div style="padding: 16px 24px; width:100%;">${headerMarkup}</div>` : "",
			margin: isTemplate3 
				? { top: "310px", bottom: "60px", left: "20px", right: "20px" }
				: { top: "20px", bottom: "60px", left: "20px", right: "20px" },
		});

		const blob = new Blob([pdf.buffer as ArrayBuffer], { type: "application/pdf" });
		return new NextResponse(blob, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": "attachment; filename=invoice.pdf",
				"Cache-Control": "no-cache",
				Pragma: "no-cache",
			},
			status: 200,
		});
	} catch (error: any) {
		console.error("PDF Generation Error:", error);
		return new NextResponse(
			JSON.stringify({ error: "Failed to generate PDF" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} finally {
		if (page) {
			try {
				await page.close();
			} catch (e) {
				console.error("Error closing page:", e);
			}
		}
		if (browser) {
			try {
				const pages = await browser.pages();
				await Promise.all(pages.map((p) => p.close()));
				await browser.close();
			} catch (e) {
				console.error("Error closing browser:", e);
			}
		}
	}
}
