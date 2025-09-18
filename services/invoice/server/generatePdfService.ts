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

    try {
        const { renderToStaticMarkup } = await import("react-dom/server");
        const templateId = body.details.pdfTemplate;
        const InvoiceTemplate = await getInvoiceTemplate(templateId);
        const appMarkup = renderToStaticMarkup(InvoiceTemplate(body));

        // Compact header template for every page
        const headerTemplate = `
          <div style="width: 100%; font-family: Arial, sans-serif; font-size: 10px; color: #111; padding: 6px 24px; border-bottom: 1px solid rgba(0,0,0,0.5); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 600; font-size: 12px;">Tax Invoice</div>
            <div style="display:flex; gap:16px; align-items:center;">
              <span>Invoice No: ${(body.details as any).invoiceNumber || ""}</span>
              <span>Date: ${new Date((body.details as any).invoiceDate || Date.now()).toLocaleDateString("en-US")}</span>
              <span>Page <span class="pageNumber"></span>/<span class="totalPages"></span></span>
            </div>
          </div>`;

        const htmlTemplate = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link href="${TAILWIND_CDN}" rel="stylesheet" />
                <style>
                  html, body { margin: 0; padding: 0; }
                  /* Reserve space for header/footer so content never overlaps */
                  @page { size: A4; margin: 96px 24px 72px 24px; }
                  @media print {
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    tr { break-inside: avoid; page-break-inside: avoid; }
                  }
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

		const pdf: Uint8Array = await page.pdf({
			format: "a4",
			printBackground: true,
			preferCSSPageSize: true,
			displayHeaderFooter: true,
			headerTemplate: headerTemplate,
			footerTemplate: '<div style="width:100%; padding:6px 24px; font-size:10px; font-family:Arial, sans-serif; color:#777; display:flex; justify-content:flex-end;">Page <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
			margin: { top: 96, right: 24, bottom: 72, left: 24 },
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
