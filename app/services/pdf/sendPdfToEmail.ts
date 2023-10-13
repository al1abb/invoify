import nodemailer, { SendMailOptions } from "nodemailer";
import { NODEMAILER_EMAIL, NODEMAILER_PW } from "@/lib/variables";
import SendPdfEmail from "@/app/components/templates/email/SendPdfEmail";

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
    try {
        // sending email from own to own account
        const mailOptions: SendMailOptions = {
            from: NODEMAILER_EMAIL,
            to: email,
            subject: "Your invoice PDF is ready",
            html: "",
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email", error);
        return false;
    }
};

export default sendPdfToEmail;
