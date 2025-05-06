import { NextRequest, NextResponse } from "next/server";

// Chromium
import chromium from "@sparticuz/chromium";

// Helpers
import { getInvoiceTemplate } from "@/lib/helpers";

// Variables
import { ENV, TAILWIND_CDN } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";
import path from "path";

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
    const ReactDOMServer = (await import("react-dom/server")).default;
    const templateId = body.details.pdfTemplate;
    const InvoiceTemplate = await getInvoiceTemplate(templateId);
    const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
      InvoiceTemplate(body)
    );

    console.log("Environment:", ENV);
    console.log("Launching Puppeteer...");

    let puppeteer;
    try {
      puppeteer = await import("puppeteer");
      console.log("Using puppeteer");
    } catch (error) {
      console.log("Falling back to puppeteer-core");
      puppeteer = await import("puppeteer-core");
    }

    // Determine the Chrome executable path
    let executablePath;
    
    if (process.env.VERCEL) {
      // We're in Vercel environment
      console.log("Running in Vercel environment");
      const chromePath = "/vercel/path0/.cache/puppeteer/chrome/linux-136.0.7103.49/chrome-linux64/chrome";
      console.log("Looking for Chrome at:", chromePath);
      executablePath = chromePath;
    } else if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      // We're in Docker environment
      console.log("Running in Docker environment");
      executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    } else {
      // We're in local environment
      console.log("Running in local environment");
      executablePath = await chromium.executablePath();
    }

    console.log("Chrome executable path:", executablePath);
    
    const launchOptions = {
      headless: true,
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--no-zygote",
        "--disable-dev-shm-usage",
      ],
      executablePath,
    };
    
    console.log("Launch options:", JSON.stringify({
      ...launchOptions,
      executablePath: launchOptions.executablePath ? "PATH EXISTS" : "PATH NOT SET",
    }));

    browser = await puppeteer.launch(launchOptions);

    if (!browser) {
      throw new Error("Failed to launch browser");
    }

    console.log("Browser launched successfully");

    page = await browser.newPage();
    console.log("New page created successfully");

    await page.setContent(htmlTemplate, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    console.log("Page content set successfully");

    await page.addStyleTag({
      url: TAILWIND_CDN,
    });
    console.log("Tailwind CSS added successfully");

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log("PDF generated successfully");

    return new NextResponse(
      new Blob([new Uint8Array(pdf)], { type: "application/pdf" }),
      {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=invoice.pdf",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to generate PDF", 
        details: error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      }),
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
