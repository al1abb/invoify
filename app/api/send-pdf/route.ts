import sendPdfToEmail from "@/app/services/pdf/sendPdfToEmail";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const emailSent = await sendPdfToEmail(body.email, body.invoicePdf);

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
        return new Response("Failed to send email", { status: 500 });
    }
}
