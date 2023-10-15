import nodemailer, { SendMailOptions } from "nodemailer";

// Variables
import { NODEMAILER_EMAIL, NODEMAILER_PW } from "@/lib/variables";

import { SendPdfEmail } from "@/app/components";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PW,
    },
});

const sendPdfToEmail = async (
    email: string,
    invoicePdf: Blob
): Promise<boolean> => {
    // Get email html content
    const emailHTML = await SendPdfEmail(invoicePdf);

    // Convert Blob to ArrayBuffer
    const arrayBuffer = await new Response(invoicePdf).arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const pdfBuffer = Buffer.from(arrayBuffer);

    try {
        const mailOptions: SendMailOptions = {
            from: "Invoify <" + NODEMAILER_EMAIL + ">",
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
};

export default sendPdfToEmail;
