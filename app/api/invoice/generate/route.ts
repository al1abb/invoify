import { NextRequest } from "next/server";

// Services
import { generatePdfService } from "@/app/services/invoice/api/generatePdfService";

export async function POST(req: NextRequest, res: Response) {
    const result = await generatePdfService(req);
    return result;
}
