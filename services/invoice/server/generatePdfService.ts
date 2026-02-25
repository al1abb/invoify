import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

// Chromium
import chromium from "@sparticuz/chromium";

// Helpers
import { getInvoiceTemplate } from "@/lib/helpers/server";

// Variables
import { ENV, TAILWIND_CDN } from "@/lib/variables";
import { HttpError } from "@/lib/server/httpError";

// Types
import { InvoiceType } from "@/types";

/**
 * Generate a PDF document of an invoice based on the provided data.
 *
 * @async
 * @param {InvoiceType} body - Invoice payload.
 * @throws {Error} If there is an error during the PDF generation process.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generatePdfService(body: InvoiceType) {
  let browser;
  let page;

  try {
    const ReactDOMServer = (await import("react-dom/server")).default;
    const templateId = body.details.pdfTemplate;
    const InvoiceTemplate = await getInvoiceTemplate(templateId);

    if (!InvoiceTemplate) {
      throw new HttpError({
        status: 400,
        code: "template_not_found",
        message: `Invoice template ${templateId} was not found`,
      });
    }

    const htmlTemplate = ReactDOMServer.renderToStaticMarkup(InvoiceTemplate(body));

    if (ENV === "production") {
      const puppeteer = (await import("puppeteer-core")).default;
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          "--disable-dev-shm-usage",
          "--ignore-certificate-errors",
        ],
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

    await page.addStyleTag({
      url: TAILWIND_CDN,
    });

    const pdf: Uint8Array = await page.pdf({
      format: "a4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return new NextResponse(new Blob([pdf], { type: "application/pdf" }), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      status: 200,
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    Sentry.captureException(error, {
      tags: {
        service: "generatePdfService",
      },
    });
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError({
      status: 500,
      code: "pdf_generation_failed",
      message: "Failed to generate PDF",
    });
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
