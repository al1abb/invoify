import { NextRequest } from "next/server";

// Nodemailer
import nodemailer, { SendMailOptions } from "nodemailer";

// Variables
import { NODEMAILER_EMAIL, NODEMAILER_PW } from "@/lib/variables";

// Components
import { SendPdfEmail } from "@/app/components";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PW,
    },
});

/**
 * Send a PDF as an email attachment.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<boolean>} A Promise that resolves to a boolean, indicating whether the email was sent successfully.
 * @throws {Error} Throws an error if there is an issue with sending the email.
 */
export async function sendPdfToEmailService(
    req: NextRequest
): Promise<boolean> {
    /**
     * @typedef {FormData} FormData
     * @property {string} email - The recipient's email address.
     * @property {Blob} invoicePdf - The PDF to be sent as an attachment.
     */

    /**
     * @typedef {SendMailOptions} SendMailOptions
     * @property {string} from - The sender's email address.
     * @property {string} to - The recipient's email address.
     * @property {string} subject - The email subject.
     * @property {string} html - The email content in HTML format.
     * @property {Array<{ filename: string, content: Buffer }>} attachments - Email attachments.
     */

    const fd = await req.formData();

    const email = fd.get("email")?.toString();
    const invoicePdf = fd.get("invoicePdf");

    // Get email html content
    const emailHTML = await SendPdfEmail();

    // Convert Blob to ArrayBuffer
    const arrayBuffer = await new Response(invoicePdf).arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const pdfBuffer = Buffer.from(arrayBuffer);

    try {
        const mailOptions: SendMailOptions = {
            from: "Invoify",
            to: email,
            subject: "Your invoice PDF is ready",
            html: emailHTML,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email", error);
        return false;
    }
}
