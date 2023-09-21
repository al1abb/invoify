import puppeteer, { Page } from "puppeteer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

		// Assuming this API file is in the 'pages/api' directory
		const templatePath = path.join(process.cwd(), "templates", "invoice-template-1.handlebars");

		// Read the HTML template from a file
        const htmlTemplate = fs.readFileSync(templatePath, "utf8");
		
		// Compile the Handlebars template
		const template = handlebars.compile(htmlTemplate);
		
		// Render the HTML with dynamic data
        const htmlContent = template(body);
		
        // Create a Puppeteer browser instance
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();

        // Set the HTML content of the page
        await page.setContent(htmlContent);

        // Generate the PDF
        const pdf: Buffer = await page.pdf({
            format: "Letter", // You can change the page format here
            printBackground: true,
        });

        // Close the Puppeteer browser
        await browser.close();

		// Convert the PDF buffer to base64
        // const pdfBase64 = pdf.toString("base64");

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
    } catch (error) {
        console.error(error);

        // Return an error response
        return new Response(`Error generating PDF: \n ${error}`, { status: 500 });
    }
}
