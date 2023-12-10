import { NextRequest } from "next/server";

// Services
import { exportInvoiceService } from "@/services/invoice/api/exportInvoiceService";

export async function POST(req: NextRequest) {
    const result = await exportInvoiceService(req);
    return result;
}
