import puppeteer, { Page } from "puppeteer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

// Define a custom helper that checks for equality
handlebars.registerHelper('ifEquals', function (
    arg1: any,
    arg2: any,
    options: handlebars.HelperOptions
) {
    const context = options.data.root; // Use options.data.root to access the data context

    return arg1 === arg2 ? options.fn(context) : options.inverse(context);
});

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        // Assuming this API file is in the 'pages/api' directory
        const templatePath = path.join(
            process.cwd(),
            "templates",
            "invoice-template-1.handlebars"
        );

        // Read the HTML template from a file
        const htmlTemplate = fs.readFileSync(templatePath, "utf8");

        // Compile the Handlebars template
        const template = handlebars.compile(htmlTemplate);

        // Render the HTML with dynamic data
        const htmlContent = template(body);

        // Create a Puppeteer browser instance
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            userDataDir: "/tmp/puppeteer",
        });

        const page: Page = await browser.newPage();

        // Set the HTML content of the page
        await page.setContent(htmlContent);

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
    } catch (error) {
        console.error(error);

        // Return an error response
        return new Response(`Error generating PDF: \n${error}`, {
            status: 500,
        });
    }
}
