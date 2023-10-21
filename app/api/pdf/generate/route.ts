import generatePdf from "@/app/services/pdf/generatePdfService";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const response = await generatePdf(body);

        return response;
    } catch (error) {
        console.error(error);

        // Return an error response
        return new Response(`Error generating PDF: \n${error}`, {
            status: 500,
        });
    }
}
