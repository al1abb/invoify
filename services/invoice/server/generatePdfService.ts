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

		// Render header component separately for Puppeteer headerTemplate (template 3)
		let headerMarkup = "";
		if (templateId === 3) {
			const { default: InvoiceTemplate3Header } = await import("@/app/components/templates/invoice-pdf/headers/InvoiceTemplate3Header");
			headerMarkup = renderToStaticMarkup(InvoiceTemplate3Header({ data: body, isForPdf: true } as any));
		}

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

		// If we have a header, measure its height in a separate temporary page to set dynamic top margin
		let topMarginPx = 20;
		if (headerMarkup) {
			const tmp = await browser.newPage();
			await tmp.setContent(`<!DOCTYPE html><html><head>
			<link href="${TAILWIND_CDN}" rel="stylesheet" />
			<style>html,body{margin:0;padding:0;}</style>
			</head><body>${headerMarkup}</body></html>`);
			const measured = await tmp.evaluate(() => {
				const el = document.querySelector('#header-container') as HTMLElement | null;
				return el ? el.offsetHeight : 0;
			});
			topMarginPx = (measured || 0) + 20; // small buffer
			await tmp.close();
		}

		// Use Puppeteer headerTemplate with dynamic margin when headerMarkup is provided
		const pdf: Uint8Array = await page.pdf({
			format: "a4",
			printBackground: true,
			preferCSSPageSize: true,
			displayHeaderFooter: Boolean(headerMarkup),
			headerTemplate: headerMarkup,
			margin: { top: `${topMarginPx}px`, bottom: "60px", left: "20px", right: "20px" },
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
