import sendPdfToEmail from "@/app/services/pdf/sendPdfToEmail";

export async function POST(req: Request, res: Response) {
    try {
        const fd = await req.formData();

        const email = fd.get("email");
        const invoicePdf = fd.get("invoicePdf");

        const emailSent = await sendPdfToEmail(email, invoicePdf);

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
