import { NextRequest, NextResponse } from "next/server";

// Services
import { exportInvoiceService } from "@/services/invoice/server/exportInvoiceService";

export async function POST(req: NextRequest) {
    try {
        const result = await exportInvoiceService(req);
        return result;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Export failed" },
            { status: 500 }
        );
    }
}
