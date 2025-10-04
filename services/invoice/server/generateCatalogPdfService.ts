import { NextRequest, NextResponse } from "next/server";

// Chromium
import chromium from "@sparticuz/chromium";
import { TAILWIND_CDN } from "@/lib/variables";
import { PRODUCT_CATALOG_DATA } from "@/app/components/templates/catalog-pdf/catalog_contant";

export async function generateCatalogPdfService(_req: NextRequest) {
    let browser: any;
    let page: any;
    try {
        const { renderToStaticMarkup } = await import("react-dom/server");
        const { default: ProductCatalogTemplate } = await import("@/app/components/templates/catalog-pdf/ProductCatalogTemplate");
        const { PdfHeader } = await import("@/app/components/templates/catalog-pdf/ProductCatalogHeader");

        const headerComponent = renderToStaticMarkup(PdfHeader({ company: PRODUCT_CATALOG_DATA.company }));

        const appMarkup = renderToStaticMarkup(ProductCatalogTemplate());

        const html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="${TAILWIND_CDN}" rel="stylesheet" />
            <style>
              @page { size: A4; margin: 20px; }
              body, html { margin: 0; padding: 0; }
              img { max-width: 100%; }
            </style>
          </head>
          <body>${appMarkup}</body>
        </html>`;

        if (process.env.NODE_ENV === "production") {
            const puppeteer = (await import("puppeteer-core")).default;
            browser = await puppeteer.launch({
                args: [...chromium.args, "--disable-dev-shm-usage", "--ignore-certificate-errors"],
                executablePath: await chromium.executablePath(),
                headless: true,
            });
        } else {
            const puppeteer = (await import("puppeteer")).default;
            browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"], headless: true });
        }

        if (!browser) throw new Error("Failed to launch browser");

        page = await browser.newPage();
        await page.setContent(html, { waitUntil: ["networkidle0", "load", "domcontentloaded"], timeout: 30000 });

        let topMarginPx = 20;
		if (headerComponent) {
			const tmp = await browser.newPage();
            const headerHtml = `<!DOCTYPE html>
			<html lang="en">
			  <head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="${TAILWIND_CDN}" rel="stylesheet" />
				<style>
				  body, html { margin: 0; padding: 0; }
				  #catalog-header {
					padding: 8px 0;
					display: grid;
					grid-template-columns: 1fr 2fr;
					align-items: center;
					gap: 12px;
					border-bottom: 1px solid rgba(0,0,0,0.3);
					color: #000;
					box-sizing: border-box;
					width: 100%;
				  }
				</style>
			  </head>
			  <body><div id="catalog-header">${headerComponent}</div></body>
			</html>`;
            await tmp.setContent(headerHtml, { waitUntil: 'load' });
			const measured = await tmp.evaluate(() => {
				const el = document.querySelector('#catalog-header') as HTMLElement | null;
				return el ? el.offsetHeight : 0;
			});
			topMarginPx = (measured || 0) + 40; // small buffer
            console.log(topMarginPx)
			await tmp.close();
		}

        const pdf: Uint8Array = await page.pdf({ 
            format: "a4", 
            printBackground: true, 
            preferCSSPageSize: false,
            displayHeaderFooter: true,
            headerTemplate: headerComponent || '<div></div>',
            footerTemplate: '<div></div>',
            margin: { 
                top: `${topMarginPx}px`, 
                bottom: "20px", 
                left: "20px", 
                right: "20px" 
            },
        });
        const blob = new Blob([pdf.buffer as ArrayBuffer], { type: "application/pdf" });
        return new NextResponse(blob, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=product-catalog.pdf",
                "Cache-Control": "no-cache",
            },
            status: 200,
        });
    } catch (error) {
        console.error("Catalog PDF Generation Error:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to generate catalog PDF" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        if (page) {
            try { await page.close(); } catch {}
        }
        if (browser) {
            try {
                const pages = await browser.pages();
                await Promise.all(pages.map((p: any) => p.close()));
                await browser.close();
            } catch {}
        }
    }
}


