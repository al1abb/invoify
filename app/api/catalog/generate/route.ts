export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest } from "next/server";
import { generateCatalogPdfService } from "@/services/invoice/server/generateCatalogPdfService";

export async function POST(req: NextRequest) {
    const data = await generateCatalogPdfService(req);
    return data;
}
