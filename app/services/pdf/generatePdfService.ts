import puppeteer, { Page } from "puppeteer";

// Templates
import { InvoiceTemplate } from "@/app/components";

// Types
import { InvoiceType } from "@/app/types/types";

const generatePdf = async (body: InvoiceType) => {
    const ReactDOMServer = (await import("react-dom/server")).default;

    // Read the HTML template from a React component
    const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
        InvoiceTemplate(body)
    );

    // Create a Puppeteer browser instance
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
    });

    const page: Page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(await htmlTemplate, { waitUntil: "networkidle0" });

    // Generate the PDF
    const pdf: Buffer = await page.pdf({
        format: "A4", // You can change the page format here
        printBackground: true,
    });

    // Close the Puppeteer browser
    await browser.close();

    // Create a Blob from the PDF data
    const pdfBlob = new Blob([pdf], { type: "application/pdf" });

    const response = new Response(pdfBlob, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=invoice.pdf",
        },
        status: 200,
    });

    return response;
};

export default generatePdf;
