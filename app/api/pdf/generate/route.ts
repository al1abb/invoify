import puppeteer, { Page } from "puppeteer";

// Templates
import { InvoiceTemplate } from "@/app/components";

export async function POST(req: Request, res: Response) {
    const start = performance.now();
    try {
        const body = await req.json();

        // Read the HTML template from a file
        const htmlTemplate = InvoiceTemplate(body);

        // Create a Puppeteer browser instance
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: "new",
        });

        const page: Page = await browser.newPage();

        // Set the HTML content of the page
        await page.setContent(await htmlTemplate);

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
        const end = performance.now();
        const responseTimeInSeconds = (end - start) / 1000;

        console.log("Response from server", responseTimeInSeconds);

        return response;
    } catch (error) {
        console.error(error);

        // Return an error response
        return new Response(`Error generating PDF: \n${error}`, {
            status: 500,
        });
    }
}
