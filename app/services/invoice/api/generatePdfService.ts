import { NextRequest, NextResponse } from "next/server";

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Puppeteer
// import puppeteer, { Page } from "puppeteer";

// Helpers
import { getInvoiceTemplate } from "@/lib/helpers";

// Types
import { InvoiceType } from "@/app/types/types";

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

    try {
        const ReactDOMServer = (await import("react-dom/server")).default;

        // Get the selected invoice template
        const templateId = body.details.pdfTemplate;
        const InvoiceTemplate = await getInvoiceTemplate(templateId);

        // Read the HTML template from a React component
        const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
            InvoiceTemplate(body)
        );

        // Create a Puppeteer browser instance
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless === "new" ? true : chromium.headless,
        });

        const page = await browser.newPage();

        // Set the HTML content of the page
        // * "waitUntil" prop makes fonts work in templates
        await page.setContent(await htmlTemplate, {
            waitUntil: "networkidle0",
        });

        // Generate the PDF
        const pdf: Buffer = await page.pdf({
            format: "a4", // You can change the page format here
            printBackground: true,
        });

        // Close the Puppeteer browser
        await browser.close();

        // Create a Blob from the PDF data
        const pdfBlob = new Blob([pdf], { type: "application/pdf" });

        const response = new NextResponse(pdfBlob, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=invoice.pdf",
            },
            status: 200,
        });

        return response;
    } catch (error) {
        console.error(error);

        // Return an error response
        return new NextResponse(`Error generating PDF: \n${error}`, {
            status: 500,
        });
    }
}
