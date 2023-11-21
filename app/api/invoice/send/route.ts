import { NextRequest } from "next/server";

// Services
import { sendPdfToEmailService } from "@/app/services/invoice/api/sendPdfToEmailService";

export async function POST(req: NextRequest) {
    try {
        const emailSent = await sendPdfToEmailService(req);

        if (emailSent) {
            return new Response("Email sent successfully", {
                status: 200,
            });
        } else {
            return new Response("Failed to send email", {
                status: 500,
            });
        }
    } catch (err) {
        console.log(err);
        return new Response("Failed to send email", { status: 500 });
    }
}
